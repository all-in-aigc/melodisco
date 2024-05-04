import { genUniSeq, genUuid } from "@/utils";

const apiBaseUri = "https://studio-api.suno.ai";

export async function genSong(
  task_uuid: string,
  description: string,
  title?: string,
  lyrics?: string,
  is_no_lyrics?: boolean,
  tags?: string
) {
  try {
    if (process.env.SUNOAPI_ENABLE === "true") {
      return genSongWithSunoApi(
        task_uuid,
        description,
        title,
        lyrics,
        is_no_lyrics,
        tags
      );
    }

    const uri = `${apiBaseUri}/api/generate/v2/`;
    const headers = await getReqHeaders();
    const params = {
      gpt_description_prompt: description,
      title: title,
      prompt: lyrics,
      make_instrumental: is_no_lyrics,
      tags: tags,
      mv: "chirp-v3-0",
    };

    console.log("gen song params", params);

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

export async function genSongWithSunoApi(
  task_uuid: string,
  description: string,
  title?: string,
  lyrics?: string,
  is_no_lyrics?: boolean,
  tags?: string
) {
  try {
    const callbackUrl = `${process.env.SUNOAPI_CALLBACK_BASE_URL}/api/gen-song-callback/${task_uuid}`;
    console.log("gen song callback url", callbackUrl);

    const uri = `${process.env.SUNOAPI_BASE_URL}/api/v1/generate`;
    let params = null;
    if (lyrics) {
      params = {
        customMode: true,
        instrumental: is_no_lyrics,
        title: title,
        prompt: lyrics,
        style: tags,
        callBackUrl: callbackUrl,
      };
    } else {
      params = {
        customMode: false,
        instrumental: is_no_lyrics,
        prompt: description,
        callBackUrl: callbackUrl,
      };
    }

    const resp = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUNOAPI_API_KEY}`,
      },
      body: JSON.stringify(params),
    });
    const { code, msg, data } = await resp.json();
    console.log("gen song with sunoapi:", code, msg, data);
    if (code !== 200) {
      console.log("gen song failed:", msg);
      return;
    }
    const uuid1 = genUniSeq();
    const uuid2 = genUniSeq();

    return {
      clips: [
        {
          id: `SUNOAPI_${uuid1}`,
        },
        {
          id: `SUNOAPI_${uuid2}`,
        },
      ],
    };
  } catch (e) {
    console.log("gen song with suno api failed:", e);
  }
}

export async function genLyrics(description: string) {
  try {
    const uri = `${apiBaseUri}/api/generate/lyrics/`;
    const headers = await getReqHeaders();
    const params = {
      prompt: description,
    };

    const resp = await fetch(uri, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(params),
    });
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("gen lyrics failed: ", e);
  }
}

export async function getLyrics(taskid: string) {
  try {
    const uri = `${apiBaseUri}/api/generate/lyrics/${taskid}`;
    console.log("uri", uri);
    const headers = await getReqHeaders();

    const resp = await fetch(uri, {
      headers: headers,
    });
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("get lyrics failed:", e);
    return [];
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

    const uri = `https://clerk.suno.com/v1/client/sessions/${sessionId}/tokens?_clerk_js_version=4.70.5`;

    const headers: any = {
      cookie: process.env.SUNO_COOKIE,
      "user-agent": process.env.SUNO_UA,
      origin: "https://suno.com",
      referer: "https://suno.com/",
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
    origin: "https://suno.com",
    referer: "https://suno.com/",
    authorization: `Bearer ${token}`,
  };

  return headers;
}
