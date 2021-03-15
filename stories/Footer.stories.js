import MyFooter from "../df-shared/src/Footer/Footer.vue";

import Vue from 'vue';
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default {
  title: 'Example/Footer',
  component: MyFooter,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MyFooter },
  template:
    '<MyFooter />',
});

export const Footer = Template.bind({});
