import { createI18n } from 'vue-i18n';
import type { Preview } from "@storybook/vue3";

import '../../df-shared-next/src/scss/_main.scss'
import '../../df-shared-next/src/scss/_variables.scss'
import '../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.module.min.js'
import '../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css'
import '../../node_modules/@gouvfr/dsfr/dist/utility/colors/colors.min.css'

import { setup } from "@storybook/vue3";
import i18n from '../../owner/src/i18n';
import { createPinia } from 'pinia';

// const i18n = createI18n({
//   legacy: false,
//   locale: 'fr',
//   messages: {
//     "en": {},
//     "fr": {},
//   },
// });

const pinia = createPinia();

setup((app) => {
    app.use(pinia);
    app.use(i18n);
});

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
