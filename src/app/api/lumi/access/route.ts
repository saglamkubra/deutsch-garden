import { lumiService, setupResponse, runtimeFailure } from "@/lib/lumi/runtime";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const s = await lumiService();
    return s ? await s.access(request) : setupResponse();
  } catch (error) {
    return runtimeFailure(error);
  }
}
