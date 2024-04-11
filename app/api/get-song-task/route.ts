import { respData, respErr } from "@/utils/resp";

import { findSongTaskByUuid } from "@/models/task";

export async function POST(req: Request) {
  try {
    const { task_uuid } = await req.json();
    if (!task_uuid) {
      return respErr("invalid params");
    }

    const task = await findSongTaskByUuid(task_uuid);
    if (!task) {
      return respErr("task not exist");
    }

    return respData(task);
  } catch (e) {
    console.log("get song task failed:", e);
    return respErr("get song task failed");
  }
}
