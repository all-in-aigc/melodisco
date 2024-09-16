import { respData, respErr } from "@/utils/resp";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    return respData("get ok");
  } catch (e) {
    return respErr("get failed");
  }
}
