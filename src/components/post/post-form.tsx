"use client";

import z, { success } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { resolve } from "path";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { createPost, UpdatePost } from "@/actions/post-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PostFormProps } from "@/lib/types";

const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 character long")
    .max(255, "Title must be less than 255 characters long"),
  description: z
    .string()
    .min(5, "Description must be at least 3 character long")
    .max(255, "Descriptions must be less than 255 characters long"),
  content: z.string().min(10, "Content must be at least 10 character long"),
});

type PostFormVale = z.infer<typeof postSchema>;

function PostForm({ isEditing, post }: PostFormProps) {
  const [isPending, startTransistion] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormVale>({
    resolver: zodResolver(postSchema),
    defaultValues:
      isEditing && post
        ? {
            title: post.title,
            description: post.description,
            content: post.content,
          }
        : {
            title: "",
            description: "",
            content: "",
          },
  });

  const onFormSubmit = async (data: PostFormVale) => {
    startTransistion(async () => {
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("content", data.content);

        let res;

        if (isEditing && post) {
          res = await UpdatePost(post.id, formData);
        } else {
          res = await createPost(formData);
        }

        console.log("Response of the form:", res);

        if (res.success) {
          toast(
            isEditing
              ? "Post edited successfully"
              : "A Post created sucessfully"
          );
          router.refresh();
          router.push("/");
        }
      } catch (e) {
        console.log("Failed to create post. Please try again", e);
        toast("Falied to create a new post. Please try again");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter post title"
          {...register("title")}
          disabled={isPending}
        />
        {errors?.title && (
          <p className="text-sm text-red-600">{errors?.title.message} </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter your description"
          {...register("description")}
          disabled={isPending}
        />
        {errors?.description && (
          <p className="text-sm text-red-600">{errors?.description.message} </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Enter your content"
          className="min-h-[250px]"
          {...register("content")}
          disabled={isPending}
        />
        {errors?.content && (
          <p className="text-sm text-red-600">{errors?.content.message} </p>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="mt-5 w-full cursor-pointer">
        {isPending
          ? " Saving Post..."
          : isEditing
            ? "Update Post"
            : "Create Post"}
      </Button>
    </form>
  );
}

export default PostForm;
