/* Do not change, this code is generated from Golang structs */


export enum ResourceMode {
    Managed = "managed",
    Data = "data",
}
export enum SchemaDescriptionKind {
    Plain = "plain",
    Markdown = "markdown",
}
export enum SchemaNestingMode {
    Single = "single",
    Group = "group",
    List = "list",
    Set = "set",
    Map = "map",
}
export interface SchemaBlockType {
    nesting_mode?: SchemaNestingMode;
    block?: SchemaBlock;
    min_items?: number;
    max_items?: number;
}
export interface SchemaNestedAttributeType {
    attributes?: {[key: string]: SchemaAttribute};
    nesting_mode?: SchemaNestingMode;
    min_items?: number;
    max_items?: number;
}
export interface Type {

}
export interface SchemaAttribute {
    type?: Type;
    nested_type?: SchemaNestedAttributeType;
    description?: string;
    description_kind?: SchemaDescriptionKind;
    deprecated?: boolean;
    required?: boolean;
    optional?: boolean;
    computed?: boolean;
    sensitive?: boolean;
}
export interface SchemaBlock {
    attributes?: {[key: string]: SchemaAttribute};
    block_types?: {[key: string]: SchemaBlockType};
    description?: string;
    description_kind?: SchemaDescriptionKind;
    deprecated?: boolean;
}
export interface Schema {
    version: number;
    block?: SchemaBlock;
}
export interface ProviderSchema {
    provider?: Schema;
    resource_schemas?: {[key: string]: Schema};
    data_source_schemas?: {[key: string]: Schema};
}
export interface ProviderSchemas {
    format_version?: string;
    provider_schemas?: {[key: string]: ProviderSchema};
}
export interface StateResource {
    address?: string;
    mode?: ResourceMode;
    type?: string;
    name?: string;
    index?: any;
    provider_name?: string;
    schema_version: number;
    values?: {[key: string]: any};
    sensitive_values?: string;
    depends_on?: string[];
    tainted?: boolean;
    deposed_key?: string;
}
export interface StateModule {
    resources?: StateResource[];
    address?: string;
    child_modules?: StateModule[];
}
export interface StateOutput {
    sensitive: boolean;
    value?: any;
}
export interface StateValues {
    outputs?: {[key: string]: StateOutput};
    root_module?: StateModule;
}
export interface State {
    format_version?: string;
    terraform_version?: string;
    values?: StateValues;
}
