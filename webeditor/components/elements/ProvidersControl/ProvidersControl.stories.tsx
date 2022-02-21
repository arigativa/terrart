import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import {ProvidersControl} from "./ProvidersControl";

export default {
  title: 'Providers Control',
  component: ProvidersControl,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ProvidersControl>;

const Template: ComponentStory<typeof ProvidersControl> =
    (args) => <ProvidersControl {...args} />;

export const Empty = Template.bind({});

export const TwoProvidersFolded = Template.bind({});

// export const LoggedIn = Template.bind({});

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
// LoggedIn.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement);
//   const loginButton = await canvas.getByRole('button', { name: /Log in/i });
//   await userEvent.click(loginButton);
// };
