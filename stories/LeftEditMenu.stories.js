import LeftEditMenu from "tenant/src/components/LeftEditMenu";
import MyButton from "df-shared/src/Button/Button";

export default {
    title: 'Example/LeftEditMenu',
    component: LeftEditMenu,
    argTypes: {
        step: 0,
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { LeftEditMenu },
    template:
        '<LeftEditMenu v-bind="$props" />',
});

export const Step0Story = Template.bind({});
Step0Story.args = {
    step: 0
};

export const Step1Story = Template.bind({});
Step1Story.args = {
    step: 1
};
