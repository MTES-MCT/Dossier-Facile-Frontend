import Card from "df-shared/src/components/Card";

export default {
    title: 'Example/Card',
    component: Card,
    argTypes: {
        expandable: true,
        expanded: true
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Card },
    template:
        `<Card v-bind="$props" >
            <template v-slot:header>
              Title
            </template>
            <template v-slot:body>
              <div>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,
                similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
                eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas
                assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum.
              </div>
            </template>
        </Card>`,
});

export const Card1Story = Template.bind({});
Card1Story.args = {
    expandable: true
};

const Template2 = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Card },
    template:
        `<Card v-bind="$props" >
    <template v-slot:header>
      Title
    </template>
    <template v-slot:body>
      <div>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
        deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,
        similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
        eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas
        assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum.
      </div>
    </template>
    </Card>`,
});

export const Card2Story = Template2.bind({});
Card2Story.args = {
    expandable: false
};

const Template3 = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Card },
    template:
            `<Card v-bind="$props" >
    <template v-slot:header>
      Title
    </template>
    <template v-slot:body>
      <div>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
        deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,
        similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
        eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas
        assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum.
      </div>
    </template>
    </Card>`,
});

export const Card3Story = Template3.bind({});
Card3Story.args = {
    expandable: true,
    expanded: false
};

