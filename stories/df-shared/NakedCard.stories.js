import NakedCard from "df-shared/src/components/NakedCard";

export default {
    title: 'DfShared/NakedCard',
    component: NakedCard,
    argTypes: {},
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { NakedCard },
    template:
        `<NakedCard v-bind="$props" >
          Empty card
        </NakedCard>`,
});

export const NakedCard1Story = Template.bind({});
