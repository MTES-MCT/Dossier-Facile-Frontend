import MyHeader from "df-shared/src/Header/Header.vue";

export default {
  title: 'DfShared/Header',
  component: MyHeader,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MyHeader },
  template:
    '<MyHeader :user="user" />',
});

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {},
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
