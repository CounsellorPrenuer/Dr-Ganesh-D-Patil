import imageUrlBuilder from "@sanity/image-url";
import { workerPost } from "./workerApi";
import { CMS_FALLBACK } from "./cmsFallback";
import { SANITY_DATASET, SANITY_PROJECT_ID } from "./config";

const builder = imageUrlBuilder({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET });

export function imageUrl(source: unknown, width = 900) {
  return source ? builder.image(source).width(width).auto("format").url() : "";
}

export type SanityImage = {
  asset?: { _ref?: string };
  alt?: string;
};

export type StandardPlan = {
  _id: string;
  planId: string;
  title: string;
  subgroup: "8-10" | "10-12" | "college" | "working";
  price: number;
  features: string[];
  image?: SanityImage;
  order?: number;
};

export type CustomPlan = {
  _id: string;
  planId: string;
  title: string;
  price: number;
  description: string;
  image?: SanityImage;
  order?: number;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  featured?: boolean;
  image?: SanityImage;
  body?: Array<Record<string, unknown>>;
};

export type Testimonial = {
  _id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image?: SanityImage;
};

export type Service = {
  _id: string;
  title: string;
  description: string;
  link: string;
  image?: SanityImage;
  order?: number;
};

export type CmsContent = {
  standardPlans: StandardPlan[];
  customPlans: CustomPlan[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  services: Service[];
};

function withFallback(remote: Partial<CmsContent> | null | undefined): CmsContent {
  return {
    standardPlans: remote?.standardPlans?.length ? remote.standardPlans : CMS_FALLBACK.standardPlans,
    customPlans: remote?.customPlans?.length ? remote.customPlans : CMS_FALLBACK.customPlans,
    blogPosts: remote?.blogPosts?.length ? remote.blogPosts : CMS_FALLBACK.blogPosts,
    testimonials: remote?.testimonials?.length ? remote.testimonials : CMS_FALLBACK.testimonials,
    services: remote?.services?.length ? remote.services : CMS_FALLBACK.services,
  };
}

let cmsRequest: Promise<CmsContent> | null = null;

async function loadCms(): Promise<CmsContent> {
  try {
    const remote = await workerPost<Partial<CmsContent>>("/api/cms/bootstrap", {});
    return withFallback(remote);
  } catch {
    return CMS_FALLBACK;
  }
}

export function fetchCms(): Promise<CmsContent> {
  if (!cmsRequest) cmsRequest = loadCms();
  return cmsRequest;
}
