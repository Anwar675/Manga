import { Home } from "lucide-react";
import Link from "next/link";

interface Props {
  manga: {
    title: string;
    slug: string;
  };
  chapter?: number;
}

export const BreadCrumb = ({ manga, chapter }: Props) => {
  return (
    <div className="flex md:gap-4 gap-1 px-4 py-2 text-sm md:text-[16px] bg-rank rounded-2xl navbar-title items-center">
      <div className="flex md:gap-2 gap-0 items-center">
        <Home className="" size={16} />
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>
      </div>
      <span>/</span>
      <Link href="/pages/1" className="hover:underline">
        Truyện Tranh
      </Link>
      <span>/</span>
      <Link 
        href={`/manga/${manga.slug}`}
        className="hover:underline truncate max-w-40 md:max-w-full"
        title={manga.title}
      >
        {manga.title}
      </Link>
      {chapter !== undefined && (
        <>
          <span>/</span>
          <span>Chapter {chapter}</span>
        </>
      )}
    </div>
  );
};
