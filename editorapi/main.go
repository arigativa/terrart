package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/hashicorp/terraform-exec/tfexec"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
)

func main() {
	var err error
	var workDir string
	flag.StringVar(&workDir, "workDir", ".", "Directory where terraform configuration is located")
	flag.Parse()

	ctx := context.TODO()

	terraform, err := tfexec.NewTerraform(workDir, "/usr/bin/terraform")
	if err != nil {
		log.Fatalf("Failed to initialize Terraform executable: %v", err)
	}

	log.Printf("Gathering terraform state")

	tfState, err := terraform.Show(ctx)
	if err != nil {
		log.Fatalf("Failed to render Terraform state: %v", err)
	}

	log.Printf("Gathering terraform providers")

	tfProviders, err := terraform.ProvidersSchema(ctx)
	if err != nil {
		log.Fatalf("Failed to get providers schema: %v", err)
	}

	log.Printf("Starting HTTP server")

	srvMux := http.NewServeMux()
	srvMux.Handle("/terraform/state", jsonHandler(func(req *http.Request) (interface{}, error) {
		return tfState, nil
	}))
	srvMux.Handle("/terraform/providers", jsonHandler(func(req *http.Request) (interface{}, error) {
		return tfProviders, nil
	}))

	srv := &http.Server{
		Addr:    ":8080",
		Handler: cors.AllowAll().Handler(srvMux),
	}

	err = srv.ListenAndServe()
	if err != http.ErrServerClosed {
		os.Exit(-1)
	}
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
