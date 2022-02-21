package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/hashicorp/terraform-exec/tfexec"
	tfjson "github.com/hashicorp/terraform-json"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
	"strings"
)

type AppState struct {
	tfh *tfexec.Terraform

	tfState     *tfjson.State
	tfProviders *tfjson.ProviderSchemas
}

func (s *AppState) FetchState(ctx context.Context) {
	go func() {
		log.Printf("Gathering terraform state")
		state, err := s.tfh.Show(ctx)
		if err != nil {
			log.Fatalf("Failed to render Terraform state: %v", err)
		}
		log.Printf("Got state: %v", state)
		s.tfState = state
	}()
}

func (s *AppState) FetchProvidersSchema(ctx context.Context) {
	go func() {
		log.Printf("Gathering terraform providers")
		tfProviders, err := s.tfh.ProvidersSchema(ctx)
		if err != nil {
			log.Fatalf("Failed to get providers schema: %v", err)
		}
		log.Printf("Got providers: %v", tfProviders)
		s.tfProviders = tfProviders
	}()
}

func main() {
	var err error
	var workDir string
	flag.StringVar(&workDir, "workDir", ".", "Directory where terraform configuration is located")
	flag.Parse()

	ctx := context.TODO()

	terraform, err := tfexec.NewTerraform(workDir, "/usr/local/bin/terraform")
	if err != nil {
		log.Fatalf("Failed to initialize Terraform executable: %v", err)
	}

	state := &AppState{tfh: terraform}

	state.FetchState(ctx)
	state.FetchProvidersSchema(ctx)

	log.Printf("Starting HTTP server")

	srv := &http.Server{
		Addr:    ":8080",
		Handler: cors.AllowAll().Handler(createAPI(state)),
	}

	err = srv.ListenAndServe()
	if err != http.ErrServerClosed {
		os.Exit(-1)
	}
}

func createAPI(state *AppState) *http.ServeMux {
	srvMux := http.NewServeMux()
	srvMux.Handle("/terraform/state", jsonHandler(func(req *http.Request) (interface{}, error) {
		return state.tfState, nil
	}))
	srvMux.Handle("/terraform/providers", jsonHandler(func(req *http.Request) (interface{}, error) {
		return state.tfProviders, nil
	}))
	srvMux.Handle("/terraform/search", jsonHandler(func(req *http.Request) (interface{}, error) {
		params := req.URL.Query()
		query := ""
		if qs := params["q"]; len(qs) > 0 {
			query = qs[0]
		}
		results := make([]SearchResult, 0)
		if state.tfProviders != nil {
			for _, providerSchema := range state.tfProviders.Schemas {
				for resName, resSchema := range providerSchema.ResourceSchemas {
					if matchQuery(query, resName, resSchema) {
						results = append(results, SearchResult{
							Type: "resource", Name: resName, Schema: resSchema,
						})
					}
				}
				for dsName, dsSchema := range providerSchema.DataSourceSchemas {
					if matchQuery(query, dsName, dsSchema) {
						results = append(results, SearchResult{
							Type: "datasource", Name: dsName, Schema: dsSchema,
						})
					}
				}
			}
		}
		return results, nil
	}))
	return srvMux
}

func matchQuery(query string, resourceName string, resourceSchema *tfjson.Schema) bool {
	if query == "" {
		return true
	}
	query = strings.ToLower(query)
	nameMatched := strings.Contains(strings.ToLower(resourceName), query)
	descriptionMatched := strings.Contains(strings.ToLower(resourceSchema.Block.Description), query)
	return nameMatched || descriptionMatched
}

type SearchResult struct {
	Type   string      `json:"type"`
	Name   string      `json:"name"`
	Schema interface{} `json:"schema"`
}

func jsonHandler(handler func(req *http.Request) (interface{}, error)) http.HandlerFunc {
	return httpHandler(func(rw http.ResponseWriter, req *http.Request) error {
		result, err := handler(req)

		jsonData, err := json.Marshal(result)
		if err != nil {
			return err
		}

		rw.Header().Add("Content-Type", "application/json")
		_, _ = rw.Write(jsonData)

		return nil
	})
}

func httpHandler(handler func(rw http.ResponseWriter, req *http.Request) error) http.HandlerFunc {
	return func(rw http.ResponseWriter, req *http.Request) {
		err := handler(rw, req)
		if err != nil {
			rw.WriteHeader(500)
			_, _ = rw.Write([]byte(fmt.Sprintf("%v", err)))
		}
	}
}
