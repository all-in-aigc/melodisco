import { getTimestamp } from "./time";

// get data from cache
export const cacheGet = (key: string): string | null => {
  let valueWithExpires = localStorage.getItem(key);
  if (!valueWithExpires) {
    return null;
  }

  let valueArr = valueWithExpires.split(":");
  if (!valueArr || valueArr.length < 2) {
    return null;
  }

  const expiresAt = Number(valueArr[0]);
  const currTimestamp = getTimestamp();

  if (expiresAt !== -1 && expiresAt < currTimestamp) {
    // value expired
    cacheRemove(key);

    return null;
  }

  const searchStr = valueArr[0] + ":";
  const value = valueWithExpires.replace(searchStr, "");

  return value;
};

// set data to cache
// expiresAt: absolute timestamp, -1 means no expire
export const cacheSet = (key: string, value: string, expiresAt: number) => {
  const valueWithExpires = expiresAt + ":" + value;

  localStorage.setItem(key, valueWithExpires);
};

// remove data from cache
export const cacheRemove = (key: string) => {
  localStorage.removeItem(key);
};

// clear all datas from cache
export const cacheClear = () => {
  localStorage.clear();
};
