import { respErr } from "@/utils/resp";

export async function POST(req: Request) {
  try {
  } catch (e) {
    console.log("fetch songs failed: ", e);
    return respErr("fetch songs failed");
  }
}
