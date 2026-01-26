"use client";
import Image from "next/image";
import { NavbarCategory } from "./navbar-category";
import { Search } from "../home/search";
import { Button } from "@/components/ui/button";

import { NavbarSidebar } from "./navbar-sidebar";
import { useEffect, useRef, useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { NavbarAccount } from "./NavbarAccount";
import { MenuIcon } from "lucide-react";
import { NavbarItem } from "@/lib/types";

export const Navbar = () => {
  const [isSidebar, setIsSidebar] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const trpc = useTRPC();
  const accountRef = useRef<HTMLDivElement>(null);
  const DeskaccountRef = useRef<HTMLDivElement>(null);
  const { data } = useSuspenseQuery(trpc.category.getMany.queryOptions());
  const session = useQuery(trpc.auth.session.queryOptions());
  useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;

    if (
      DeskaccountRef.current?.contains(target) ||
      accountRef.current?.contains(target)
    ) {
      return;
    }

    setIsActive(false);
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);
  return (
    <>
      <div className="bg-navbar  2xl:px-16 w-full hidden md:flex top-0 2xl:py-6 px-12 py-4 items-center justify-between">
        <div>
          <Link href="/">
          
            <Image src="/img/logo.png" alt="logo" width={60} height={60} />
          </Link>
          
        </div>
        <div className="">
          <NavbarCategory data={data} />
        </div>
        <div className="flex items-center gap-2">
          <Search />

          {session.data?.user ? (
            <div ref={DeskaccountRef}  className="h-10 w-12  relative">
              <Image
                onClick={() => setIsActive((prev) => !prev)}
                src="/img/background.png"
                fill
                alt="avata"
                className="rounded-full cursor-pointer overflow-hidden"
              />
              {isActive && (
                <div className="absolute top-12 z-10 right-0  ">
                  <NavbarAccount />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="default">
                <Link href="/sign-up">Đăng ký</Link>
              </Button>
              <Button variant="default">
                <Link href="/sign-in">Đăng nhập</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden bg-[#837b54] px-4 py-3">
        <div className="flex items-center justify-between">
          <Image src="/img/logo.png" alt="logo" width={48} height={48} />
          <div className="flex items-center gap-4">
            {session.data?.user ? (
              <div ref={accountRef} className="h-9 w-9 cursor-pointer relative">
                <Image
                  onClick={() => setIsActive((prev) => !prev)}
                  src="/img/background.png"
                  fill
                  alt="avata"
                  className="rounded-full overflow-hidden"
                />
                {isActive && (
                  <div className="absolute top-12 z-10 -right-15  ">
                    <NavbarAccount />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="default">
                  <Link href="/sign-up">Đăng ký</Link>
                </Button>
                <Button variant="default">
                  <Link href="/sign-in">Đăng nhập</Link>
                </Button>
              </div>
            )}
            <Button variant="ghost" onClick={() => setIsSidebar(true)}>
              <MenuIcon className="text-white cursor-pointer" />
            </Button>
            <NavbarSidebar
              items={NavbarItem}
              open={isSidebar}
              onOpenChange={setIsSidebar}
            />
          </div>
        </div>

        <div className="mt-3">
          <Search />
        </div>
      </div>
    </>
  );
};
