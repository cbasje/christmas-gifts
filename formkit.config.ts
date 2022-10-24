const isCheckboxAndRadioMultiple = (node) =>
    (node.props.type === "checkbox" || node.props.type === "radio") &&
    node.props.options;

function addAsteriskPlugin(node) {
    node.on("created", () => {
        const schemaFn = node.props.definition.schema;
        node.props.definition.schema = (sectionsSchema) => {
            const isRequired = node.props.parsedRules.some(
                (rule) => rule.name === "required"
            );

            if (isRequired) {
                if (isCheckboxAndRadioMultiple(node)) {
                    sectionsSchema.legend = {
                        children: ["$label", "*"],
                    };
                } else {
                    sectionsSchema.label = {
                        children: ["$label", "*"],
                    };
                }
            }
            return schemaFn(sectionsSchema);
        };
    });
}

export default {
    iconLoaderUrl: (iconName) => `https://api.iconify.design/${iconName}.svg`,
    plugins: [addAsteriskPlugin],
};
