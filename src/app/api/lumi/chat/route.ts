import { lumiService, setupResponse, runtimeFailure } from "@/lib/lumi/runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const service = await lumiService();
    return service ? await service.status(request) : setupResponse(200);
  } catch (error) {
    return runtimeFailure(error);
  }
}
export async function POST(request: Request) {
  try {
    const s = await lumiService();
    return s ? await s.handle(request) : setupResponse();
  } catch (error) {
    return runtimeFailure(error);
  }
}
export async function DELETE(request: Request) {
  try {
    const s = await lumiService();
    return s ? await s.remove(request) : setupResponse();
  } catch (error) {
    return runtimeFailure(error);
  }
}
