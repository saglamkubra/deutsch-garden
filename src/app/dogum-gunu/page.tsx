import { BirthdayWelcomePage } from "@/components/birthday/welcome";
export const metadata = { title: "Sana özel bir karşılama" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ onizleme?: string }>;
}) {
  const query = await searchParams;
  return <BirthdayWelcomePage preview={query.onizleme === "1"} />;
}
