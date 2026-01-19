import { concatAST } from "graphql";

export function timeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;

  return past.toLocaleDateString("vi-VN");
}


export const formatViews = (views?:number | null) => {
  if (!views || views < 1000) return views ?? 0;

  if (views < 1_000_000) {
    return `${(views / 1000).toFixed(views % 1000 === 0 ? 0 : 1)}k`;
  }

  if (views < 1_000_000_000) {
    return `${(views / 1_000_000).toFixed(views % 1_000_000 === 0 ? 0 : 1)}M`;
  }

  return `${(views / 1_000_000_000).toFixed(1)}B`;
}