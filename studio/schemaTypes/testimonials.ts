import { defineField, defineType } from "sanity";

export const testimonials = defineType({
  name: "testimonials",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Role / Organization", type: "string" }),
    defineField({ name: "quote", title: "Testimonial", type: "text", rows: 5, validation: (rule) => rule.required() }),
    defineField({ name: "rating", title: "Rating", type: "number", initialValue: 5, validation: (rule) => rule.min(1).max(5) }),
    defineField({
      name: "image",
      title: "Person Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alternative Text", type: "string" }],
    }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
