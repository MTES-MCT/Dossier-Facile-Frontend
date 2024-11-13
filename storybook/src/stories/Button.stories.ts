import type { Meta, StoryObj } from '@storybook/vue3';
import MyButton from '../../../df-shared-next/src/Button/DfButton.vue';

const meta = {
  title: 'DossierFacile/Button',
  component: MyButton,
  tags: ['autodocs'],
  args: {},
  render: (args) => ({
    components: { MyButton },
    setup() {
      return { args };
    },
    template: `
      <MyButton v-bind="args">{{ args.title }}</MyButton>
    `,
  }),
} satisfies Meta<typeof MyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    title: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
    title: 'Secondary',
  },
};

export const Large: Story = {
  args: {
    title: 'Large Button',
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    title: 'Small Button',
    size: 'small',
  },
};
