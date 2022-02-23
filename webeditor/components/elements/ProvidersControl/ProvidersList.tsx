import React from 'react'

interface Provider {
  name: string
  version: string
}

interface ListParams {
  providers: Provider[]
}

export class ProvidersList extends React.Component<ListParams, any> {
  render() {
    return (
      <table>
        <tr></tr>
      </table>
    )
  }
}
