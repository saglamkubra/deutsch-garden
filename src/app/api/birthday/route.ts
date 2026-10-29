import { birthdayServer, birthdayUnavailable } from "@/lib/birthday/runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    return await birthdayServer().publicStatus(request);
  } catch {
    return birthdayUnavailable();
  }
}
