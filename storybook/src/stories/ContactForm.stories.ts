import type { Meta, StoryObj } from "@storybook/vue3"
import ContactPage from "../../../df-shared-next/src/components/ContactPage.vue"

const meta = {
  title: "DossierFacile/ContactPage",
  component: ContactPage,
  tags: ["autodocs"],
} satisfies Meta<typeof ContactPage>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
