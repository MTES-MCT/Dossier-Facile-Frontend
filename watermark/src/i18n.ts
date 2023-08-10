import { createI18n } from 'vue-i18n';

import fr from './locales/fr.json';

const i18n = createI18n({
  locale: 'fr',
  messages: {
    fr,
  },
});

export default i18n;
