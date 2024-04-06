import { v4 as uuidv4 } from "uuid";

export function genUuid(): string {
  return uuidv4();
}

export function genUniSeq(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);

  return `${prefix}${randomPart}${timestamp}`;
}

export function getIsoTimestr(): string {
  return new Date().toISOString();
}
