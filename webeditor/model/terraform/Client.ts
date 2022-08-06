import {State, ProviderSchemas, Schema} from './tfjson'

export interface TerraformAPI {
  getState(): Promise<State>
  getConfig(): Promise<object>
  getProvidersSchemas(): Promise<ProviderSchemas>
  searchComponents(query: string | undefined): Promise<SearchResult[]>
}

export type SearchResultType = 'resource' | 'datasource'

export interface SearchResult {
  type: SearchResultType
  name: string
  schema: Schema
}

export class TerraformAPIClient implements TerraformAPI {
  private readonly endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async getProvidersSchemas(): Promise<ProviderSchemas> {
    const response = await fetch(this.endpoint + '/providers')
    return response.json()
  }

  async getState(): Promise<State> {
    const response = await fetch(this.endpoint + '/state')
    return response.json()
  }

  async getConfig(): Promise<object> {
    const response = await fetch(this.endpoint + '/config')
    return response.json()
  }

  async searchComponents(query: string | undefined): Promise<SearchResult[]> {
    return this.getProvidersSchemas().then(
        provSchemas => {
          let result: SearchResult[] = [];
          if (query === undefined) {
            query = '';
          }
          for (let provKey in provSchemas.provider_schemas) {
            let provSchema = provSchemas.provider_schemas[provKey];
            for (let resKey in provSchema.resource_schemas) {
              let schema = provSchema.resource_schemas[resKey];
              if (resKey.indexOf(query) >= 0) {
                result.push({type: 'resource', name: resKey, schema: schema})
              } else if (schema.block && schema.block.description && schema.block.description.indexOf(query) >= 0) {
                result.push({type: 'resource', name: resKey, schema: schema})
              }
            }
            for (let resKey in provSchema.data_source_schemas) {
              let schema = provSchema.data_source_schemas[resKey];
              if (resKey.indexOf(query) >= 0) {
                result.push({type: 'datasource', name: resKey, schema: schema})
              } else if (schema.block && schema.block.description && schema.block.description.indexOf(query) >= 0) {
                result.push({type: 'datasource', name: resKey, schema: schema})
              }
            }
          }
          return result;
        }
    )
  }
}
