import type { Meta, StoryObj } from '@storybook/vue3';
import ContactForm from '../../../df-shared-next/src/components/ContactForm.vue';

const meta = {
  title: 'DossierFacile/ContactForm',
  component: ContactForm,
  tags: ['autodocs'],
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};
