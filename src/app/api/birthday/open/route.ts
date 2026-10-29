import { birthdayServer, birthdayUnavailable } from "@/lib/birthday/runtime";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    return await birthdayServer().open(request);
  } catch {
    return birthdayUnavailable();
  }
}
