import ListItem from "tenant/src/components/uploads/ListItem";

export default {
    title: 'Tenant/ListItem',
    component: ListItem,
    argTypes: {
        file: {}
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ListItem },
    template:
        `<div><ListItem v-bind="$props" 
              :file="file"
              @remove="remove(file)"
            /></div>
        `,
});

export const ListItem1Story = Template.bind({});
ListItem1Story.args = {
    remove: () => {},
    file: {}
};