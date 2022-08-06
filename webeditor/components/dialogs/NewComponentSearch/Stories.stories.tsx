import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import {TerraformAPI, SearchResult} from '../../../model/terraform/Client'
import { NewComponentDialog } from './NewComponentDialog'
import {ProviderSchemas, State} from "../../../model/terraform/tfjson";

export default {
  title: 'New component search',
  component: NewComponentDialog,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof NewComponentDialog>

const Template: ComponentStory<typeof NewComponentDialog> = args => (
  <NewComponentDialog tfClient={new TerraformClientMock()} />
)

class TerraformClientMock implements TerraformAPI {
  getProvidersSchemas(): Promise<ProviderSchemas> {
    return Promise.resolve({});
  }

  getState(): Promise<State> {
    return Promise.resolve({});
  }

  getConfig(): Promise<object> {
    return Promise.resolve({});
  }

  searchComponents(query: string | undefined): Promise<SearchResult[]> {
    console.log("invoked");
    let allOptions: SearchResult[] = [
      {
        name: "test_resource",
        type: "resource",
        schema: {
          version: 0,
          block: {
            description: "This is a *test* resource",
            description_kind: "markdown",
          }
        }
      }
    ]
    return Promise.resolve(allOptions);
  }
}

export const Empty = Template.bind({
  // tfClient: TerraformClient,
})

// export const TwoProvidersFolded = Template.bind({});

// export const LoggedIn = Template.bind({});

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
// LoggedIn.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement);
//   const loginButton = await canvas.getByRole('button', { name: /Log in/i });
//   await userEvent.click(loginButton);
// };
