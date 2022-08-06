package main

import (
	"encoding/json"
	"fmt"
	"github.com/alexflint/go-arg"
	"os"

	"github.com/hashicorp/terraform-config-inspect/tfconfig"
	tfjson "github.com/hashicorp/terraform-json"
	"github.com/tkrajina/typescriptify-golang-structs/typescriptify"
)

func main() {
	var appArgs struct {
		OutputDir string `arg:"-d,--outputDir,env:OUTPUT_DIR" default:"." help:"Output directory for Typescript files"`
	}

	arg.MustParse(&appArgs)

	if appArgs.OutputDir != "" {
		err := os.Chdir(appArgs.OutputDir)
		if err != nil {
			panic(err.Error())
		}
	}

	err := generateTfjson()
	if err != nil {
		panic(err.Error())
	}
	err = generateTfconfig()
	if err != nil {
		panic(err.Error())
	}
	fmt.Println("OK")
}

func generateTfconfig() error {
	t := typescriptify.New()
	t.CreateInterface = true
	t.BackupDir = ""

	t.Add(tfconfig.Module{})
	t.AddEnum([]struct {
		Value  tfconfig.ResourceMode
		TSName string
	}{
		{tfconfig.InvalidResourceMode, "Invalid"},
		{tfconfig.ManagedResourceMode, "Managed"},
		{tfconfig.DataResourceMode, "Data"},
	})

	return t.ConvertToFile("tfconfig.ts")
}

func generateTfjson() error {
	t := typescriptify.New()
	t.CreateInterface = true
	t.BackupDir = ""

	t.Add(tfjson.ProviderSchemas{})
	t.Add(tfjson.State{})
	t.ManageType(json.RawMessage([]byte{}), typescriptify.TypeOptions{
		TSType: "string",
	})
	t.AddEnum([]struct {
		Value  tfjson.ResourceMode
		TSName string
	}{
		{tfjson.ManagedResourceMode, "Managed"},
		{tfjson.DataResourceMode, "Data"},
	})
	t.AddEnum([]struct {
		Value  tfjson.SchemaDescriptionKind
		TSName string
	}{
		{tfjson.SchemaDescriptionKindPlain, "Plain"},
		{tfjson.SchemaDescriptionKindMarkdown, "Markdown"},
	})
	t.AddEnum([]struct {
		Value  tfjson.SchemaNestingMode
		TSName string
	}{
		{tfjson.SchemaNestingModeSingle, "Single"},
		{tfjson.SchemaNestingModeGroup, "Group"},
		{tfjson.SchemaNestingModeList, "List"},
		{tfjson.SchemaNestingModeSet, "Set"},
		{tfjson.SchemaNestingModeMap, "Map"},
	})

	return t.ConvertToFile("tfjson.ts")
}
