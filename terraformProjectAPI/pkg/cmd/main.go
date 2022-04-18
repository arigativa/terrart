package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	state2 "github.com/arigativa/terrart/pkg/tfproject"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
	"os/exec"
)

func main() {
	var err error
	var workDir, tfExecPath string

	flag.StringVar(&workDir, "workDir", ".", "Directory where terraform configuration is located")
	flag.StringVar(&tfExecPath, "tfExecPath", "", "Path to terraform executable (takes from PATH if not specified)")
	flag.Parse()

	if tfExecPath == "" {
		tfExecPath, err = exec.LookPath("terraform")
		if err != nil {
			log.Fatalf("Can't find terraform executable, specify it with option or make available at PATH: %v", err)
		}
	}

	ctx := context.TODO()

	state, err := state2.InitAppState(workDir, tfExecPath)
	if err != nil {
		log.Fatalf("Failed to initialize Terraform executable: %v", err)
	}

	state.Update(ctx)

	addr := ":8080"
	log.Printf("Starting HTTP server on %v", addr)

	srv := &http.Server{
		Addr:    addr,
		Handler: cors.AllowAll().Handler(createAPI(state)),
	}

	err = srv.ListenAndServe()
	if err != http.ErrServerClosed {
		os.Exit(-1)
	}
}

func createAPI(state state2.TfProject) *http.ServeMux {
	srvMux := http.NewServeMux()
	srvMux.Handle("/status", jsonHandler(func(req *http.Request) (interface{}, error) {
		return state.UpdateStatus(), nil
	}))
	srvMux.Handle("/state", jsonHandler(func(req *http.Request) (interface{}, error) {
		return state.TfState()
	}))
	srvMux.Handle("/providers", jsonHandler(func(req *http.Request) (interface{}, error) {
		return state.TfProviders()
	}))
	srvMux.Handle("/config", jsonHandler(func(req *http.Request) (interface{}, error) {
		config, _ := state.TfConfig()
		return config, nil
	}))
	srvMux.Handle("/config/diagnostics", jsonHandler(func(req *http.Request) (interface{}, error) {
		_, diagnostics := state.TfConfig()
		return diagnostics, nil
	}))
	return srvMux
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
