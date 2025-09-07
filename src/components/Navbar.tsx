"use client";

import React, { useEffect, useState } from "react";
import { Instagram, Rss, Twitter, Youtube, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, logout, isAdmin } = useAuth();

  // Gate để SSR và client-first-render khớp
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
      logout();
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <header className="px-6 md:px-48">
      <div className="flex items-center justify-between border-b border-b-black py-5">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold uppercase">
          Elowen
        </Link>

        {/* Desktop menu */}
        <ul className="hidden items-center gap-5 text-[20px] md:flex">
          <li>Magazine</li>
          <Link href="/profile">Posts</Link>
          <li>Authors</li>
          <span>—</span>
          <div className="flex items-center gap-4">
            <Instagram className="size-5" />
            <Twitter className="size-5" />
            <Youtube className="size-5" />

            {mounted && isAuthenticated.value ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {/* Nếu bạn wrap bằng Button/Link tuỳ biến, cân nhắc thêm asChild */}
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>HH</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin() && (
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className="uppercase">
                  Login
                </Link>
                <Link href="/register" className="uppercase">
                  Register
                </Link>
              </>
            )}
          </div>
        </ul>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <div className="flex items-center gap-3">
              <SheetTrigger>
                <Menu className="size-10" />
              </SheetTrigger>
            </div>
            <SheetContent side="right" className="w-[250px]">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold uppercase">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4 text-lg">
                {mounted && isAuthenticated.value ? (
                  <div className="flex items-center gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Avatar>
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                          />
                          <AvatarFallback>HH</AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="mt-2 shadow-xl"
                      >
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {isAdmin() && (
                          <DropdownMenuItem
                            onClick={() => router.push("/dashboard")}
                          >
                            Admin Dashboard
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <p className="text-xl font-semibold">Hi, Your name</p>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <Link href="/login" className="uppercase">
                      Login
                    </Link>
                    <Link href="/register" className="uppercase">
                      Register
                    </Link>
                  </div>
                )}

                <a href="#">Magazine</a>
                <a href="/profile">Posts</a>
                <a href="#">Authors</a>

                <div className="flex gap-4 pt-4">
                  <Instagram className="size-5" />
                  <Twitter className="size-5" />
                  <Youtube className="size-5" />
                  <Rss className="size-5" />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
