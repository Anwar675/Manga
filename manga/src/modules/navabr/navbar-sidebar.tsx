import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HomeIcon, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavabrItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

interface Props {
  items: NavabrItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, open, onOpenChange }: Props) => {
  const pathname = usePathname();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none text-[#fae1c2] bg-[#94928b]"
      >
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center">
            <SheetTitle>
              <Link
                href="/"
                className="text-2xl text-[#fae1c2] flex items-center "
              >
                <HomeIcon />
                <span className="pl-4">Trang chủ</span>
              </Link>
            </SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {items.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex gap-4 items-center p-4 rounded-md m-3 transition ${isActive ? "text-[#94928b] bg-[#fae1c2]" : "text-[#fae1c2] bg-[#94928b]"}`} 
              >
                {item.icon && <item.icon size={20} />}
                <span className="pl-4">{item.label}</span>
              </Link>
            );
          })}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
