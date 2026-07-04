import { defineField, defineType } from "sanity";

export const services = defineType({
  name: "services",
  title: "Services",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: "link", title: "Website Path", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "image",
      title: "Service Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alternative Text", type: "string" }],
    }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
  preview: { select: { title: "title", subtitle: "link", media: "image" } },
});
