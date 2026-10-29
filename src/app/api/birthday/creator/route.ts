import { birthdayServer, birthdayUnavailable } from "@/lib/birthday/runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    return await birthdayServer().creatorStatus(request);
  } catch {
    return birthdayUnavailable();
  }
}
export async function POST(request: Request) {
  try {
    return await birthdayServer().save(request);
  } catch {
    return birthdayUnavailable();
  }
}
export async function DELETE(request: Request) {
  try {
    return await birthdayServer().logout(request);
  } catch {
    return birthdayUnavailable();
  }
}
