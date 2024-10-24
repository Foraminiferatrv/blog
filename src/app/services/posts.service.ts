import { revalidatePath } from "next/cache";
import { Post } from "../models/posts.model";
import { UpdatePost } from "../schemas/dto/posts.schema";

export async function getAllPosts(): Promise<Post[]> {
  const data = await fetch(process.env.NEXT_PUBLIC_API_URL + "/posts", {
    cache: "no-cache",
  });

  return data.json();
}

export async function getPostById(id: string | undefined): Promise<Post> {
  const data = await fetch(process.env.NEXT_PUBLIC_API_URL + "/posts/" + id, {
    cache: "no-cache",
  });

  return data.json();
}

export async function updatePost(id: string, data: any) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/posts/" + id,
    {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  return await response.json();
}
