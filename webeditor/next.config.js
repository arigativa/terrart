
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  webpackFinal: async (baseConfig, options) => {
    const { module = {} } = baseConfig;

    const newConfig = {
      ...baseConfig,
      module: {
        ...module,
        rules: [...(module.rules || [])],
      },
    };

    // SCSS
    newConfig.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: true,
            }
          }
        },
        'sass-loader',
      ],
    });

    return newConfig;
  }
}
