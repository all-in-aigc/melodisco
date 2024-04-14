import { respErr, respOk } from "@/utils/resp";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("callback data", data);

    return respOk();
  } catch (e) {
    console.log("gen song callback failed:", e);
    return respErr("callback failed");
  }
}
