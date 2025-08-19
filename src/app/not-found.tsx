"use client"

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 space-y-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl font-semibold capitalize text-gray-900">
        Page not found!
      </h2>
      <p className="text-muted foreground max-w-md">
        Sorry, we couldn&apos; find the page you are looking for. It might have
        has been moved, deleted or you enterd the wrong URL
      </p>
      <div className="flex space-x-2 hover:shadow-lg">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <Button variant={"outline"} onClick={() => window.history.back()} className="cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
