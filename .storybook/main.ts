import * as path from "path";
import type { StorybookConfig } from "@storybook/nextjs";

const toPath = (filePath: string) => path.join(process.cwd(), filePath);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
    {
      name: "@storybook/addon-styling-webpack",
      options: {
        rules: [
          // Replaces existing CSS rules to support PostCSS
          {
            test: /\.css$/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: { importLoaders: 1 },
              },
              {
                // Gets options from `postcss.config.js` in your project root
                loader: "postcss-loader",
                options: { implementation: require.resolve("postcss") },
              },
            ],
          },
        ],
      },
    },
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (baseConfig) => {
    if (baseConfig.resolve) {
      baseConfig.resolve.alias = {
        ...baseConfig.resolve.alias,
        "styled-system": toPath("styled-system"),
      };
    }
    return baseConfig;
  },
  features: {
    experimentalRSC: true,
  },
};
export default config;
