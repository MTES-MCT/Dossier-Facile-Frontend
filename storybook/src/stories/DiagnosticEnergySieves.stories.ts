import type { Meta, StoryObj } from '@storybook/vue3';
import PropertyDiagnosticEnergySieves from '../../../owner/src/components/property/PropertyDiagnosticEnergySieves.vue';

const meta = {
  title: 'DossierFacile/DiagnosticEnergySieves',
  component: PropertyDiagnosticEnergySieves,
  tags: ['autodocs'],
} satisfies Meta<typeof PropertyDiagnosticEnergySieves>;

export default meta;
type Story = StoryObj<typeof meta>;

export const E: Story = {
  args: {
    letter: "E"
    ,
  },
};

export const F: Story = {
  args: {
    letter: "F"
    ,
  },
};

export const G: Story = {
  args: {
    letter: "G"
    ,
  },
};

export const A: Story = {
  args: {
    letter: "A"
    ,
  },
};