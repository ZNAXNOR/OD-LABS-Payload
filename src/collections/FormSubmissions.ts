import { CollectionConfig } from "payload";

export const FormSubmissions: CollectionConfig = {
    slug: "form-submissions",
    fields: [
        {
            type: "text",
            name: "from",
            label: "From Email",
            admin: {
                readOnly: true,
            }
        },
        {
            type: "textarea",
            name: "message",
            label: "Message",
            admin: {
                readOnly: true,
            }
        },
        {
            type: "text",
            name: "source",
            label: "Source",
            admin: {
                position: "sidebar",
                readOnly: true,
            },
        },
    ],
}
