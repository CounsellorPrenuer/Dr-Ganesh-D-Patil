import { defineField, defineType } from "sanity";

export const standardPlan = defineType({
  name: "standardPlan",
  title: "Standard Plan",
  type: "document",
  fields: [
    defineField({ name: "planId", title: "Plan ID", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "subgroup",
      title: "Audience",
      type: "string",
      options: { list: ["8-10", "10-12", "college", "working"] },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "price", title: "Price (INR)", type: "number", validation: (rule) => rule.required().positive() }),
    defineField({ name: "features", title: "Features", type: "array", of: [{ type: "string" }], validation: (rule) => rule.required().min(1) }),
    defineField({
      name: "image",
      title: "Plan Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alternative Text", type: "string" }],
    }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
  preview: { select: { title: "title", subtitle: "subgroup", media: "image" } },
});
