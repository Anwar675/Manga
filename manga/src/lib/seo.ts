import { Media } from "@/payload-types";



type PayloadRichText =
  | {
      root?: {
        children?: unknown[];
      };
    }
  | null
  | undefined;

export function richTextToPlainText(
  rich: PayloadRichText
): string {
  if (!rich?.root?.children) return "";

  const walk = (nodes: unknown[]): string =>
    nodes
      .map((node) => {
        if (
          typeof node === "object" &&
          node !== null
        ) {
          const n = node as {
            text?: unknown;
            children?: unknown[];
          };

          if (typeof n.text === "string")
            return n.text;

          if (Array.isArray(n.children))
            return walk(n.children);
        }

        return "";
      })
      .join(" ");

  return walk(rich.root.children)
    .replace(/\s+/g, " ")
    .trim();
}


export function getImageUrl(cover?: string | Media | null): string | undefined {
  return typeof cover === "object" && cover
    ? (cover.url ?? undefined)
    : undefined;
}
