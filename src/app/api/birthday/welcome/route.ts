import { birthdayWelcome } from "@/config/birthday-welcome";
import { birthdayServer, birthdayUnavailable } from "@/lib/birthday/runtime";
import { welcomeResponse } from "@/lib/birthday/welcome-server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    return await welcomeResponse(
      request,
      birthdayWelcome,
      birthdayServer(),
      "GET",
    );
  } catch {
    return birthdayUnavailable();
  }
}
export async function POST(request: Request) {
  try {
    return await welcomeResponse(
      request,
      birthdayWelcome,
      birthdayServer(),
      "POST",
    );
  } catch {
    return birthdayUnavailable();
  }
}
