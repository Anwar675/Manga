"use client";
import { NewUpdate } from "@/modules/home/ui/newUpdate";
import { Mangas } from "@/payload-types";
import { useTRPC } from "@/trpc/client";

import { useQuery } from "@tanstack/react-query";

export const HistoryInfor = () => {
  const trpc = useTRPC();
  const { data: session } = useQuery(trpc.auth.session.queryOptions());
  const { data: history, isLoading } = useQuery(
    trpc.history.getHistory.queryOptions({ page: 1 }, {enabled: !!session?.user}),
    
  );
  const { data: category } = useQuery(trpc.category.getSubMany.queryOptions());
  if (isLoading || !history || !category) {
    return (
      <div className="w-full text-center py-12 font-bold bg-popular">
        VUI LÒNG ĐĂNG NHẬP ĐỂ XEM LỊCH SỬ
      </div>
    );
  }
  return (
    <div>
      <NewUpdate
        category={category}
        mangas={history?.docs as Mangas[]}
        page={history.page || 1}
        totalPages={history?.totalPages || 1}
      />
    </div>
  );
};
