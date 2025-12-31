import { Bookmark, LogOut, MessageCircle, History, Moon, Settings } from "lucide-react"
import {  Carrot, FacebookIcon, Trophy, Users, LucideIcon } from "lucide-react";
type NavItem =
  | {
      type: "item";
      label: string;
      href: string;
      icon: LucideIcon;
    }
  | {
      type: "action";
      label: string;
      action: "logout";
      icon: LucideIcon;
    }
  | {
      type: "divider";
    };


export const navAccount: NavItem[] = [
  {
    type: "divider"
  },
  {
    type: "item",
    label: "Truyện theo dõi",
    href: "/follow",
    icon: Bookmark,
  },
  {
    type: "item",
    label: "Lịch sử",
    href: "/history",
    icon: History,
  },
  {
    type: "item",
    label: "Bình luận của tôi",
    href: "/comments",
    icon: MessageCircle,
  },

 
  {
    type: "divider",
  },
  {
    type:"item",
    label: "Giao diện",
    href: '/',
    icon: Moon
  },
  {
    type:"item",
    label: "Cài đặt",
    href: '/settings',
    icon: Settings
  },
  {
    type: "divider",
  },
  
  {
    type: "action",
    label: "Đăng xuất",
    action: "logout",
    icon: LogOut,
  },
];

export const NavbarItem = [
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