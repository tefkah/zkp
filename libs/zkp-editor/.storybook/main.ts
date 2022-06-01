// @ts-expect-error shh
import rootMain from '../../../.storybook/main'
import type { StorybookViteConfig } from '@storybook/builder-vite'

const config: StorybookViteConfig = {
  ...rootMain,

  core: {
    ...rootMain.core,
    builder: 'webpack5',
  },

  stories: [
    ...rootMain.stories,
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [...rootMain.addons, '@nrwl/react/plugins/storybook'],
  // viteFinal: async (config, { configType }) => {
  //   return config
  // },
  // webpackFinal: async (config, { configType }) => {
  //   // apply any global webpack configs that might have been specified in .storybook/main.js
  //   if (rootMain.webpackFinal) {
  //     config = await rootMain.webpackFinal(config, { configType })
  //   }

  //   // add your own webpack tweaks if needed

  //   return config
  // },
  viteFinal: async (config, { configType }) => {
    if (rootMain.viteFinal) {
      config = await rootMain.viteFinal(config, { configType })
    }
    return config
  },
}

export default config
