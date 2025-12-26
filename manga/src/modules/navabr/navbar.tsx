"use client"
import Image from "next/image";
import { NavbarCategory } from "./navbar-category";
import { Search } from "../home/search";
import { Button } from "@/components/ui/button";
import { Bookmark, Carrot, FacebookIcon, History, LogOut, MenuIcon, Trophy, Users, YoutubeIcon } from "lucide-react";
import { NavbarSidebar } from "./navbar-sidebar";
import { useState } from "react";

interface NavbarProps {
  data: any;
}

const NavbarItem = [
    {
        label: "Lịch sử",
        href: '/history',
        icon: History
    },
    {
        label: "Theo dõi",
        href: "/follow",
        icon: Bookmark
    },
    {
        label: "FanPage",
        href: "/facebook.com",
        icon: FacebookIcon
    }, 
    {
        label: "Thể loại",
        href: '/',
        icon: Carrot
    },
    
    {
        label: "Nhóm dịch",
        href: "/team",
        icon: Users
    },
    {
        label: "BXH truyện tranh",
        href: '/rank',
        icon: Trophy
    },
    {
        label: "Đăng xuất",
        href: "/logout",
        icon: LogOut
    }
]

export const Navbar = ({ data }: NavbarProps) => {
    const [isSidebar, setIsSidebar] = useState(false)
  return (
    <>
      <div className="bg-[#3C392B]/83 2xl:px-16  w-full hidden md:flex top-0 2xl:py-8 px-12 py-4 items-center justify-between">
        <div className="">
          <Image src="/img/logo.png" alt="logo" width={60} height={60} />
        </div>
        <div className="">
          <NavbarCategory data={data} />
        </div>
        <div className="flex items-center gap-2">
          <Search />
          <Button variant="default">Đăng ký</Button>
          <Button variant="default">Đăng nhập</Button>
        </div>
      </div>
      <div className="md:hidden bg-[#837b54] px-4 py-3">
        
        <div className="flex items-center justify-between">
          <Image src="/img/logo.png" alt="logo" width={48} height={48} />
          <div className="flex items-center gap-2">
            <Button variant="default">Đăng ký</Button>
            <Button variant="default">Đăng nhập</Button>
            <Button variant="ghost" onClick={() => setIsSidebar(true)}>
                <MenuIcon className="text-white cursor-pointer" />
            </Button>
            <NavbarSidebar items={NavbarItem} open={isSidebar} onOpenChange={setIsSidebar} />
        </div>         
        </div>

        
        <div className="mt-3">
          <Search />
        </div>
      </div>
    </>
  );
};
