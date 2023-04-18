/** @type { import('@storybook/vue3').Preview } */

require('../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.module.min.js')
require('../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css')

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
