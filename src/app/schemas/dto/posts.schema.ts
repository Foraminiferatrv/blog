import { z } from "zod";

export const createPost = z.object({
  title: z.string(),
  content: z.string(),
  image: z.string().optional(),
  shortDescription: z.string(),
});
export type CreatePost = z.infer<typeof createPost>;

export const updatePost = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  shortDescription: z.string().optional(),
});
export type UpdatePost = z.infer<typeof updatePost>;
