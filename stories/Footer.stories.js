import TheFooter from "../df-shared/src/Footer/Footer.vue";

import Vue from 'vue';
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default {
  title: 'Example/Footer',
  component: TheFooter,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TheFooter },
  template:
    '<TheFooter />',
});

export const Footer = Template.bind({});
