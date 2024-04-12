const apiBaseUri = "https://www.udio.com";

export async function getTrendingSongs(page: number, page_size: number) {
  return getSongs(page, page_size, "trending_score");
}

export async function getLatestSongs(page: number, page_size: number) {
  return getSongs(page, page_size, "created_at");
}

export async function getSongInfo(ids: string[]) {
  try {
    const uri = `${apiBaseUri}/api/songs?songIds=${encodeURIComponent(
      ids.join(",")
    )}`;
    const headers = await getReqHeaders();

    const resp = await fetch(uri, {
      headers: headers,
    });

    console.log("res", headers, resp);
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("get song info failed: ", e);
  }
}

async function getSongs(page: number, page_size: number, sort: string) {
  if (!page) {
    page = 1;
  }
  if (!page_size) {
    page_size = 30;
  }

  try {
    const uri = `${apiBaseUri}/api/songs/search`;

    const headers = await getReqHeaders();

    const params = {
      searchQuery: { sort: sort, searchTerm: "" },
      pageParam: (page - 1) * page_size,
      pageSize: page_size,
      trendingId: process.env.UDIO_TRENDING_UUID,
    };
    const resp = await fetch(uri, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(params),
    });

    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("get songs failed:", e);
    return [];
  }
}

async function getReqHeaders(): Promise<any> {
  const userAgent = process.env.UDIO_UA;

  const headers = {
    cookie: process.env.UDIO_COOKIE,
    "user-agent": userAgent,
    origin: "https://www.udio.com",
    referer: "https://www.udio.com/",
  };

  return headers;
}
