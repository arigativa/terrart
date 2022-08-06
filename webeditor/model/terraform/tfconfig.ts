/* Do not change, this code is generated from Golang structs */


export enum ResourceMode {
    Invalid = 0,
    Managed = 77,
    Data = 68,
}
export interface Diagnostic {
    severity: number;
    summary: string;
    detail?: string;
    pos?: SourcePos;
}
export interface ModuleCall {
    name: string;
    source: string;
    version?: string;
    pos: SourcePos;
}
export interface Resource {
    mode: ResourceMode;
    type: string;
    name: string;
    provider: ProviderRef;
    pos: SourcePos;
}
export interface ProviderConfig {
    name: string;
    alias?: string;
}
export interface ProviderRef {
    name: string;
    alias?: string;
}
export interface ProviderRequirement {
    source?: string;
    version_constraints?: string[];
    aliases?: ProviderRef[];
}
export interface Output {
    name: string;
    description?: string;
    sensitive?: boolean;
    pos: SourcePos;
}
export interface SourcePos {
    filename: string;
    line: number;
}
export interface Variable {
    name: string;
    type?: string;
    description?: string;
    default: any;
    required: boolean;
    sensitive?: boolean;
    pos: SourcePos;
}
export interface Module {
    path: string;
    variables: {[key: string]: Variable};
    outputs: {[key: string]: Output};
    required_core?: string[];
    required_providers: {[key: string]: ProviderRequirement};
    provider_configs?: {[key: string]: ProviderConfig};
    managed_resources: {[key: string]: Resource};
    data_resources: {[key: string]: Resource};
    module_calls: {[key: string]: ModuleCall};
    diagnostics?: Diagnostic[];
}