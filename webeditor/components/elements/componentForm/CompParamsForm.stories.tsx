import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'
import { CompParamsForm } from './CompParamsForm'

export default {
  title: 'Component parameters editor',
  component: CompParamsForm,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof CompParamsForm>

const Template: ComponentStory<typeof CompParamsForm> = args => <CompParamsForm {...args} />

export const Pet = Template.bind({})
Pet.args = {
  schema: {
    attributes: {
      id: {
        type: 'string',
        description: 'The random pet name',
        description_kind: 'markdown',
        computed: true,
      },
      keepers: {
        type: ['map', 'string'],
        description:
          'Arbitrary map of values that, when changed, will trigger recreation of resource. See [the main provider documentation](../index.html) for more information.',
        description_kind: 'markdown',
        optional: true,
      },
      length: {
        type: 'number',
        description: 'The length (in words) of the pet name.',
        description_kind: 'markdown',
        optional: true,
      },
      prefix: {
        type: 'string',
        description: 'A string to prefix the name with.',
        description_kind: 'markdown',
        optional: true,
      },
      separator: {
        type: 'string',
        description: 'The character to separate words in the pet name.',
        description_kind: 'markdown',
        optional: true,
      },
    },
    description:
      'The resource `random_pet` generates random pet names that are intended to be used as unique identifiers for other resources.\n\nThis resource can be used in conjunction with resources that have the `create_before_destroy` lifecycle flag set, to avoid conflicts with unique names during the brief period where both the old and new resources exist concurrently.',
    description_kind: 'markdown',
  },
}
