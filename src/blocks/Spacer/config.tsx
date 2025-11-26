import { Block } from "payload"

export const SpacerBlock: Block = {
    slug: 'spacer',
    interfaceName: 'SpacerBlock',
    labels: {
        singular: 'Spacer',
        plural: 'Spacers',
    },
    fields: [
        {
            name: 'size',
            label: 'Size',
            type: 'radio',
            options: [
                {
                    label: 'Small',
                    value: 'small',
                },
                {
                    label: 'Medium',
                    value: 'medium',
                },
                {
                    label: 'Large',
                    value: 'large',
                },
            ],
        }
    ]
}