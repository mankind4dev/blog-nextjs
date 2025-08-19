"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { post } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { de } from "date-fns/locale";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createPost(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session?.user) {
      return {
        success: false,
        message: "You must be logged in to create a post",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;

    const slug = slugify(title);

    const existingPost = await db.query.post.findFirst({
      where: eq(post.slug, slug),
    });

    if (existingPost) {
      return {
        success: false,
        message:
          "A post with the same title already exists! Please try with a different title",
      };
    }

    const [newPost] = await db
      .insert(post)
      .values({
        title,
        description,
        content,
        slug,
        authorId: session.user.id,
      })
      .returning();

    revalidatePath("/");
    revalidatePath(`/post/${slug}`);
    revalidatePath("/profile");

    return {
      success: true,
      message: "Post create successfully",
      slug,
    };
  } catch (error) {
    console.log("Error to create:", error);
    return {
      success: false,
      message: "Failed to create a new post. Please try again",
    };
  }
}

export async function UpdatePost(postId: number, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session?.user) {
      return {
        success: false,
        message: "You must logged in to have access to edit post",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;

    const slug = slugify(title);
    const existingPost = await db.query.post.findFirst({
      where: and(eq(post.slug, slug), ne(post.id, postId)),
    });

    if (existingPost) {
      return {
        success: false,
        message:
          "A post with that tile already exist. Try a different title name",
      };
    }

    const posts = await db.query.post.findFirst({
      where: eq(post.id, postId),
    });

    if (posts?.authorId !== session.user.id) {
      return {
        success: false,
        message: "You can only edit your created post",
      };
    }

    await db
      .update(post)
      .set({
        title,
        description,
        content,
        slug,
        createdAt: new Date(),
      })
      .where(eq(post.id, postId));

    revalidatePath("/");
    revalidatePath(`/post/${slug}`);
    revalidatePath("/profile");

    return {
      success: true,
      message: "Post edited successfully",
      slug,
    };
  } catch (e) {
    console.log("Edit post failed", e);
    return {
      success: false,
      message: "Failed to edit the post. Please try again.",
    };
  }
}

export async function DeletePost(postId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: "Must logged in before you can edit any post",
      };
    }

    const postToDelete = await db.query.post.findFirst({
      where: eq(post.id, postId),
    });

    if (!postToDelete) {
      return {
        success: false,
        message: "Post not found. Try again later",
      };
    }

    if (postToDelete?.authorId !== session.user.id) {
      return {
        success: false,
        message: "You can only delete your own post",
      };
    }

    await db.delete(post).where(eq(post.id, postId));

    revalidatePath("/");
    revalidatePath("/profile");

    return{
      success: true,
      message: "Post deleted successfully"
    }

  } catch (error) {
    console.log("Post delete faile", error);

    return {
      success: false,
      message: "Failed to delete post. Try again later",
    };
  }
}
