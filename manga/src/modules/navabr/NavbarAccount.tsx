import { navAccount } from "@/lib/types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const NavbarAccount = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const username = useQuery(trpc.auth.session.queryOptions());
  const logout = useMutation(
    trpc.auth.logout.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    }),
  );
  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      className="bg-[#FCF3E4] w-60 rounded-md overflow-hidden "
    >
      <div className=" flex items-center text-[#4f4c40]  text-md  2xl:text-[16px] font-light gap-4 p-4">
        <div className="w-11 relative h-11">
          <Image
            src="/img/background.png"
            fill
            alt="avata"
            className="rounded-full cursor-pointer overflow-hidden"
          />
        </div>
        <p className="font-medium text-md">{username.data?.user?.username}</p>
      </div>
      {navAccount.map((item, index) => {
        if (item.type === "divider") {
          return <div key={`divider-${index}`} className="h-px bg-gray-800" />;
        }
        const Icon = item.icon;
        if (item.type === "action") {
          return (
            <button
              key="logout"
              onClick={() => {
                if (item.action === "logout") {
                  logout.mutate();
                }

                if (item.action === "toggle-theme") {
                  const isDark =
                    document.documentElement.classList.toggle("dark");

                  localStorage.setItem("theme", isDark ? "dark" : "light");
                }
              }}
              className="flex w-full cursor-pointer text-[#4f4c40] items-center gap-4 px-4 py-3 hover:bg-[#cfccb3]"
            >
              <Icon className="text-2xl" />
              {item.label}
            </button>
          );
        }
        if (item.type === "item") {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center  text-[#4f4c40] hover:bg-[#cfccb3] text-md  2xl:text-[16px] font-light gap-4 px-4 py-3 "
            >
              <Icon className="text-2xl" />
              <p>{item.label}</p>
            </Link>
          );
        }
      })}
    </div>
  );
};
