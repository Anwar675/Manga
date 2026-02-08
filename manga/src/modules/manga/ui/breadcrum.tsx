import { Home } from "lucide-react";

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
        href={`/manga/${manga.slug}`}
        className="hover:underline truncate max-w-40 md:max-w-full"
        title={manga.title}
      >
        {manga.title}
      </a>
      {chapter !== undefined && (
        <>
          <span>/</span>
          <span>Chapter {chapter}</span>
        </>
      )}
    </div>
  );
};
