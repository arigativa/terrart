export interface ProviderSchemas {
  format_version?: string
  provider_schemas?: { [key: string]: ProviderSchema }
}

export type SearchResultType = 'resource' | 'datasource'

export interface SearchResult {
  type: SearchResultType
  name: string
  schema: Schema
}

export interface ProviderSchema {
  provider?: Schema
  resource_schemas?: { [key: string]: Schema }
  data_source_schemas?: { [key: string]: Schema }
}

export interface SchemaAttribute {
  type?: any
  nested_type?: SchemaNestedAttributeType
  description?: string
  description_kind?: SchemaDescriptionKind
  deprecated?: boolean
  required?: boolean
  optional?: boolean
  computed?: boolean
  sensitive?: boolean
}

export type SchemaNestingMode = 'single' | 'group' | 'list' | 'set' | 'map'

export interface SchemaBlockType {
  nesting_mode?: SchemaNestingMode
  block?: SchemaBlock
  min_items?: number
  max_items?: number
}

export type SchemaDescriptionKind = 'plain' | 'markdown'

export interface SchemaBlock {
  attributes?: { [key: string]: SchemaAttribute }
  block_types?: { [key: string]: SchemaBlockType }
  description?: string
  description_kind?: SchemaDescriptionKind
  deprecated?: boolean
}

export interface SchemaNestedAttributeType {
  attributes?: { [key: string]: SchemaAttribute }
  nesting_mode?: SchemaNestingMode
  min_items?: number
  max_items?: number
}

export interface Schema {
  version: number
  block?: SchemaBlock
}
