import { HomeShell } from "@/components/HomeShell";
import { getContent, getOriginals } from "@/lib/content";

export default function HomePage() {
  const content = getContent();
  const originals = getOriginals();
  const year = new Date().getFullYear();

  return (
    <HomeShell content={content} originals={originals} year={year} />
  );
}
