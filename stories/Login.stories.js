import Login from "../df-shared/src/Authentification/Login.vue";

export default {
  title: 'Example/Login',
  component: Login,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Login },
  template:
    '<Login />',
});

export const LoginStory = Template.bind({});
LoginStory.args = {};
