import DeclinedMessage from "df-shared/src/components/DeclinedMessage";

export default {
    title: 'DfShared/DeclinedMessage',
    component: DeclinedMessage,
    argTypes: {
      message: "",
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { DeclinedMessage },
    template:
        `<DeclinedMessage v-bind="$props" >
        </DeclinedMessage>`,
});

export const DeclinedMessage1Story = Template.bind({});
DeclinedMessage1Story.args = {
    message: "Votre pièce d'identité n'est plus valide car elle a expiré."
};
