import { accountConfig } from "@/lib/account/config";
export const dynamic = "force-dynamic";
export function GET() {
  return Response.json(accountConfig(process.env), {
    headers: { "Cache-Control": "no-store" },
  });
}
