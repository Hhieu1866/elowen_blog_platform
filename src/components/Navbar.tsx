import { Instagram, Rss, Twitter, Youtube, Menu } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  return (
    <header className="container mx-auto flex items-center justify-between border-b border-b-black p-6 py-5 md:px-0">
      {/* Logo */}
      <h1 className="text-3xl font-bold uppercase">Elowen</h1>

      {/* Desktop menu */}
      <ul className="hidden items-center gap-5 text-[20px] md:flex">
        <li>Magazine</li>
        <li>Podcast</li>
        <li>Authors</li>
        <span>—</span>
        <div className="flex items-center gap-4">
          <Instagram className="size-5" />
          <Twitter className="size-5" />
          <Youtube className="size-5" />
          <Rss className="size-5" />
        </div>
      </ul>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu className="size-7" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px]">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold uppercase">
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-4 text-lg">
              <a href="#">Magazine</a>
              <a href="#">Podcast</a>
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
    </header>
  );
};

export default Navbar;
