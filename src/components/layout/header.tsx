"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import UserMenu from "../auth/user-menu";
import ThemeToggle from "../theme/theme-toggle";

const navItems = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Create",
    link: "/post/create",
  },
];
function Header() {
  const { data: session, isPending } = useSession();
  const route = useRouter();

  return (
    <header className="border-b bg-background sticky top-0 z-18">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Next.js 15 Blog
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">{/* placehoder */}</div>
          <ThemeToggle />
          <div className="flex items-center gap-2">
            {isPending ? null : session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <Button
                onClick={() => route.push("/auth")}
                className="cursor-pointer"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
