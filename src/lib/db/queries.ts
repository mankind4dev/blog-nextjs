import { desc, eq } from "drizzle-orm";
import { db } from ".";
import { post } from "./schema";

export async function getAllPosts() {
  try {
    const appPosts = await db.query.post.findMany({
      orderBy: [desc(post.createdAt)],
      with: {
        author: true,
      },
    });

    return appPosts;
  } catch (e) {
    console.log("Failed to fetch posts:", e);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const posts = await db.query.post.findFirst({
      where: eq(post?.slug, slug),
      with: {
        author: true,
      },
    });

    return posts;
  } catch (e) {
    console.log(e);
    return null;
  }
}
