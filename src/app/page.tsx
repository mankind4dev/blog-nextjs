import PostList from "@/components/post/post-list";
import { getAllPosts } from "@/lib/db/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js 15 blog",
  description: "My New blog app using Next.js Typescript",
};

export default async function Home() {
  const posts = await getAllPosts(); 

  return (
    <main className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-2">Welcome to the Blogs</h2>
        {posts?.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium">No post created yet</h3>
          </div>
        ) : (
          <PostList
            posts={(posts ?? []).map((post) => ({
              id: post.id,
              title: post.title,
              description: post.description,
              slug: post.slug,
              createdAt: post.createdAt,
              author: {
                name: post.author.name,
              },
            }))}
          />
        )}
      </div>
    </main>
  );
}
