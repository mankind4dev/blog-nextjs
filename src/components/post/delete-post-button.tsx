"use client";

import { DelePostButtonProps } from "@/lib/types";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeletePost } from "@/actions/post-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function DeletePostButton({ postId }: DelePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await DeletePost(postId);
      if (res.success) {
        toast(res.message);
        router.push("/");
        router.refresh();
      } else {
        toast(res.success);
      }
    } catch (e) {
      toast("An error occured while deleting the post ");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      <Button
        onClick={handleDelete}
        disabled={isDeleting}
        variant="destructive"
        size="sm"
        className="cursor-pointer"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </>
  );
}

export default DeletePostButton;
