package tfproject

import (
	"context"
	"github.com/hashicorp/terraform-config-inspect/tfconfig"
	"github.com/hashicorp/terraform-exec/tfexec"
	tfjson "github.com/hashicorp/terraform-json"
	"log"
)

type TfProject interface {
	Update(ctx context.Context)
	UpdateStatus() UpdateStatus

	TfState() (*tfjson.State, error)
	TfProviders() (*tfjson.ProviderSchemas, error)
	TfConfig() (*tfconfig.Module, tfconfig.Diagnostics)
}

type tfProjectImpl struct {
	tfh     *tfexec.Terraform
	workDir string

	tfState        *tfjson.State
	tfStateErr     error
	tfProviders    *tfjson.ProviderSchemas
	tfProvidersErr error
	tfConfig       *tfconfig.Module
	tfConfigDiags  tfconfig.Diagnostics
}

func (s *tfProjectImpl) TfState() (*tfjson.State, error) {
	return s.tfState, s.tfStateErr
}

func (s *tfProjectImpl) TfProviders() (*tfjson.ProviderSchemas, error) {
	return s.tfProviders, s.tfProvidersErr
}

func (s *tfProjectImpl) TfConfig() (*tfconfig.Module, tfconfig.Diagnostics) {
	return s.tfConfig, s.tfConfigDiags
}

var _ TfProject = &tfProjectImpl{}

func InitAppState(workDir string, tfExecPath string) (TfProject, error) {
	terraform, err := tfexec.NewTerraform(workDir, tfExecPath)
	if err != nil {
		return nil, err
	}
	return &tfProjectImpl{
		workDir: workDir,
		tfh:     terraform,
	}, nil
}

func (s *tfProjectImpl) Update(ctx context.Context) {
	s.FetchState(ctx)
	s.FetchProvidersSchema(ctx)
	s.FetchConfiguration()
}

type UpdateStatus struct {
	StateLoaded           bool `json:"state_loaded"`
	ProvidersSchemaLoaded bool `json:"schema_loaded"`
	ConfigurationLoaded   bool `json:"configuration_loaded"`
}

func (s *tfProjectImpl) UpdateStatus() UpdateStatus {
	return UpdateStatus{
		StateLoaded:           s.tfState != nil || s.tfStateErr != nil,
		ProvidersSchemaLoaded: s.tfProviders != nil || s.tfProvidersErr != nil,
		ConfigurationLoaded:   s.tfConfig != nil || len(s.tfConfigDiags) > 0,
	}
}

func (s *tfProjectImpl) FetchState(ctx context.Context) {
	go func() {
		s.tfState, s.tfStateErr = s.tfh.Show(ctx)
		log.Printf("FetchState: %v %v", s.tfState, s.tfStateErr)
	}()
}

func (s *tfProjectImpl) FetchProvidersSchema(ctx context.Context) {
	go func() {
		s.tfProviders, s.tfProvidersErr = s.tfh.ProvidersSchema(ctx)
		log.Printf("FetchProvidersSchema: %v %v", s.tfProviders, s.tfProvidersErr)
	}()
}

func (s *tfProjectImpl) FetchConfiguration() {
	go func() {
		s.tfConfig, s.tfConfigDiags = tfconfig.LoadModule(s.workDir)
		log.Printf("FetchConfiguration: %v %v", s.tfConfig, s.tfConfigDiags)
	}()
}
