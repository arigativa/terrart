
export interface State {
  format_version?: string;
  terraform_version?: string;
  values?: StateValues;
}

export interface StateValues {
  outputs?: { [key: string]: StateOutput };
  root_module?: StateModule;
}

export interface StateModule {
  resources?: StateResource[];
  address?: string;
  child_modules?: StateModule[];
}

type ResourceMode = "data" | "managed";

export interface StateResource {
  address?: string;
  mode?: ResourceMode;
  type?: string;
  name?: string;
  index?: number | string;
  provider_name?: string;
  schema_version: number;
  values?: { [key: string]: any };
  sensitive_values?: string; // raw json
  depends_on?: string[];
  tainted?: boolean;
  deposed_key?: string;
}

export interface StateOutput {
  sensitive: boolean;
  value?: any;
}
