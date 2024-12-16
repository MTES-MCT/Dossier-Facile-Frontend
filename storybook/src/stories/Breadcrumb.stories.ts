import type { Meta, StoryObj } from '@storybook/vue3';
import Breadcrumb from 'df-shared-next/src/components/dsfr/BreadcrumbItem.vue';

const meta = {
  title: 'DossierFacile/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    currentPage: 'Page courante',
  },
};
