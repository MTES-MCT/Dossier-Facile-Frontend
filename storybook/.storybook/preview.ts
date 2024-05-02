import type { Preview } from "@storybook/vue3";

import '../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.module.min.js'
import '../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
