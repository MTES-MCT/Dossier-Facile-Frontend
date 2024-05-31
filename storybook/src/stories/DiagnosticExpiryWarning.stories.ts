import type { Meta, StoryObj } from '@storybook/vue3';
import PropertyDiagnosticExpiryWarning from '../../../owner/src/components/property/PropertyDiagnosticExpiryWarning.vue';

const meta = {
  title: 'DossierFacile/DiagnosticExpiryWarning',
  component: PropertyDiagnosticExpiryWarning,
  tags: ['autodocs'],
} satisfies Meta<typeof PropertyDiagnosticExpiryWarning>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
