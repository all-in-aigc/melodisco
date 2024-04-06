const apiBaseUri = "https://studio-api.suno.ai";

export async function genSong(
  description: string,
  is_no_lyric: boolean = false
) {
  try {
    const uri = `${apiBaseUri}/api/generate/v2/`;
    const headers = await getReqHeaders();
    const params = {
      gpt_description_prompt: description,
      mv: "chirp-v3-0",
      prompt: "",
      make_instrumental: is_no_lyric,
    };

    const resp = await fetch(uri, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(params),
    });
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("gen music failed: ", e);
  }
}

export async function getTrendingSongs(page: number) {
  try {
    const uri = `${apiBaseUri}/api/playlist/${
      process.env.SUNO_TRENDING_UUID
    }/?page=${page || 1}`;
    console.log("api uri", uri);
    const headers = await getReqHeaders();

    const resp = await fetch(uri, {
      headers: headers,
    });
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("get trending songs failed:", e);
    return [];
  }
}

export async function getLatestSongs(page: number) {
  try {
    const uri = `${apiBaseUri}/api/playlist/${
      process.env.SUNO_LATEST_UUID
    }/?page=${page || 1}`;
    console.log("api uri", uri);
    const headers = await getReqHeaders();

    const resp = await fetch(uri, {
      headers: headers,
    });
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("get latest songs failed:", e);
    return [];
  }
}

export async function getSongInfo(ids: string[]) {
  try {
    const uri = `${apiBaseUri}/api/feed/?ids=${encodeURIComponent(
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
    console.log("get music info failed: ", e);
  }
}

export async function getBillingInfo() {
  try {
    const uri = `${apiBaseUri}/api/billing/info/`;
    const headers = await getReqHeaders();

    const resp = await fetch(uri, {
      headers: headers,
    });
    const data = await resp.json();
    console.log("headers", uri, headers);
    return data;
  } catch (e) {
    console.log("get billing info failed: ", e);
  }
}

export async function getJwtToken() {
  try {
    const sessionId = process.env.SUNO_SESSION_ID;

    const uri = `https://clerk.suno.ai/v1/client/sessions/${sessionId}/tokens?_clerk_js_version=4.70.5`;

    const headers: any = {
      cookie: process.env.SUNO_COOKIE,
      "user-agent": process.env.SUNO_UA,
      origin: "https://app.suno.ai",
      referer: "https://app.suno.ai/",
    };

    const resp = await fetch(uri, {
      method: "POST",
      headers: headers,
    });

    if (resp.status === 200) {
      const data = await resp.json();
      if (data && data.jwt) {
        return data.jwt;
      }
    }

    console.log("get jwt token failed: ", resp);

    return "";
  } catch (e) {
    console.log("get jwt token failed: ", e);
    return "";
  }
}

async function getReqHeaders(): Promise<any> {
  const userAgent = process.env.SUNO_UA;
  const token = await getJwtToken();

  const headers = {
    "user-agent": userAgent,
    origin: "https://app.suno.ai",
    referer: "https://app.suno.ai/",
    authorization: `Bearer ${token}`,
  };

  return headers;
}
