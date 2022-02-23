import { State } from './State'
import { ProviderSchemas } from './Providers'

export interface TerraformAPI {
  getState(): Promise<State>
  getProvidersSchemas(): Promise<ProviderSchemas>
}

export class TerraformAPIClient implements TerraformAPI {
  constructor(private endpoint: string) {}

  async getProvidersSchemas(): Promise<ProviderSchemas> {
    const response = await fetch(this.endpoint + '/terraform/providers')
    return response.json()
  }

  async getState(): Promise<State> {
    const response = await fetch(this.endpoint + '/terraform/state')
    return response.json()
  }
}
