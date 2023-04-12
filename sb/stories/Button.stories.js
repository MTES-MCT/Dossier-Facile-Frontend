import MyButton from '../../df-shared-next/src/Button/Button.vue';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
export default {
  title: 'Example/Button',
  component: MyButton,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: {
      control: 'color',
    },
    onClick: {},
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large'],
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MyButton },
  template: '<MyButton @onClick="onClick" v-bind="$props" >Valider</MyButton>',
});


// More on writing stories with args: https://storybook.js.org/docs/7.0/vue/writing-stories/args
export const Primary = Template.bind({});
Primary.args = {
    primary: true,
    label: 'Button',
  };
