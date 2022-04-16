const path = require('path')

module.exports = {
  "stories": [
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  "presets": [path.resolve(__dirname, "../next.config.js")],
  "framework": "@storybook/react",
  "core": {
    "builder": "webpack5"
  },
  // "sassOptions": {
  //   "includePaths": [path.join(__dirname, 'styles')]
  // },
}
