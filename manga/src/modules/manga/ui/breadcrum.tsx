import { Home } from "lucide-react";

export const BreadCrumb = () => {
  return (
    <div className="flex md:gap-4 gap-1 px-4 py-2 text-sm md:text-[16px] bg-rank rounded-2xl navbar-title items-center">
      <div className="flex md:gap-2 gap-0 items-center">
        <Home className="" size={16} />
        <a href="/" className="hover:underline">
          Trang chủ
        </a>
      </div>
      <span>/</span>
      <a href="/pages/2" className="hover:underline">
        Truyện Tranh
      </a>
      <span>/</span>
      <a
        href="/"
        className="
          hover:underline
          truncate
          max-w-40
          md:max-w-full
        "
        title="na-tra-ma-dong-nao-hai"
      >
        na-tra-ma-dong-nao-hai
      </a>
    </div>
  );
};
