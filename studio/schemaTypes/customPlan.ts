import { defineField, defineType } from "sanity";

export const customPlan = defineType({
  name: "customPlan",
  title: "Custom Plan",
  type: "document",
  fields: [
    defineField({ name: "planId", title: "Plan ID", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "price", title: "Price (INR)", type: "number", validation: (rule) => rule.required().positive() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 5, validation: (rule) => rule.required() }),
    defineField({
      name: "image",
      title: "Plan Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alternative Text", type: "string" }],
    }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
  preview: { select: { title: "title", subtitle: "planId", media: "image" } },
});
