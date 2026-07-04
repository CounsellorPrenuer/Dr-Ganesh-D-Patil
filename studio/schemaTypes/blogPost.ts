import { defineArrayMember, defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "author", title: "Author", type: "string", initialValue: "Growth Platter Academy" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({
      name: "image",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alternative Text", type: "string" }],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" }), defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
  ],
  preview: { select: { title: "title", subtitle: "author", media: "image" } },
});
