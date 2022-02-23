import { State } from './State'
import { ProviderSchemas, SearchResult } from './Providers'

export interface TerraformAPI {
  getState(): Promise<State>
  getProvidersSchemas(): Promise<ProviderSchemas>
  searchComponents(query: string | undefined): Promise<SearchResult[]>
}

export class TerraformAPIClient implements TerraformAPI {
  private readonly endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async getProvidersSchemas(): Promise<ProviderSchemas> {
    const response = await fetch(this.endpoint + '/terraform/providers')
    return response.json()
  }

  async getState(): Promise<State> {
    const response = await fetch(this.endpoint + '/terraform/state')
    return response.json()
  }

  async searchComponents(query: string | undefined): Promise<SearchResult[]> {
    const response = await fetch(this.endpoint + '/terraform/search?q=' + query)
    return response.json()
  }
}
