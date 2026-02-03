

export function timeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return "Vừa xong";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(diff / 3600);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days} ngày trước`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return weeks === 1 ? "1 tuần trước" : `${weeks} tuần trước`;

  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "1 tháng trước" : `${months} tháng trước`;

  const years = Math.floor(days / 365);
  return years === 1 ? "1 năm trước" : `${years} năm trước`;
}

export function formatDate(date: string | Date) {
  const d = new Date(date);

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
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