import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\\n/g, " ")
    .replace(/\s+/g, " ");
}

function extractFromXml(xml: string): string {
  const texts = xml.match(/<text[^>]*>([\s\S]*?)<\/text>/gi);
  if (!texts || texts.length === 0) return "";
  return texts.map(t => decodeEntities(t.replace(/<[^>]+>/g, ""))).join(" ").replace(/\s+/g, " ").trim();
}

async function getTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (res.ok) {
      const data = await res.json();
      return data.title || "";
    }
  } catch { /* ignore */ }
  return "";
}

async function getTranscript(videoId: string): Promise<{ title: string; transcript: string }> {
  const title = await getTitle(videoId);

  // Method 1: Use youtube.com/watch with various cookie/consent tricks
  const urls = [
    `https://www.youtube.com/watch?v=${videoId}&hl=es&has_verified=1`,
    `https://m.youtube.com/watch?v=${videoId}`,
    `https://www.youtube-nocookie.com/embed/${videoId}`,
  ];

  for (const pageUrl of urls) {
    try {
      const pageRes = await fetch(pageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
          "Cookie": "CONSENT=PENDING+987; SOCS=CAESEwgDEgk2MTcyODAxMTQaAmVuIAEaBgiA_LyaBg",
        },
        redirect: "follow",
      });
      
      if (!pageRes.ok) continue;
      const html = await pageRes.text();

      // Extract caption base URLs
      const baseUrlRegex = /"baseUrl"\s*:\s*"(https?:[^"]*timedtext[^"]*)"/g;
      let match;
      const captionUrls: string[] = [];
      while ((match = baseUrlRegex.exec(html)) !== null) {
        captionUrls.push(match[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/"));
      }

      for (const capUrl of captionUrls) {
        try {
          const capRes = await fetch(capUrl);
          if (!capRes.ok) continue;
          const xml = await capRes.text();
          const transcript = extractFromXml(xml);
          if (transcript.length > 50) return { title, transcript };
        } catch { continue; }
      }
    } catch { continue; }
  }

  // Method 2: Innertube player API (doesn't require login for most videos)
  try {
    const playerRes = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "com.google.android.youtube/19.09.37 (Linux; U; Android 12) gzip",
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "ANDROID",
            clientVersion: "19.09.37",
            androidSdkVersion: 31,
            hl: "es",
          },
        },
        videoId: videoId,
      }),
    });

    if (playerRes.ok) {
      const playerData = await playerRes.json();
      const tracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
      
      // Sort: prefer Spanish
      const sorted = [...tracks].sort((a: { languageCode: string }, b: { languageCode: string }) => {
        if (a.languageCode.startsWith("es")) return -1;
        if (b.languageCode.startsWith("es")) return 1;
        if (a.languageCode.startsWith("en")) return -1;
        if (b.languageCode.startsWith("en")) return 1;
        return 0;
      });

      for (const track of sorted) {
        if (!track.baseUrl) continue;
        try {
          const capRes = await fetch(track.baseUrl);
          if (!capRes.ok) continue;
          const xml = await capRes.text();
          const transcript = extractFromXml(xml);
          if (transcript.length > 50) return { title, transcript };
        } catch { continue; }
      }

      // Fallback: video description
      const desc = playerData?.videoDetails?.shortDescription;
      if (desc && desc.length > 50) {
        return { title: title + " (descripción)", transcript: desc };
      }
    }
  } catch { /* continue */ }

  // Method 3: Direct timedtext API
  const langs = ["es", "en", "es-419", "pt"];
  const kinds = ["asr", ""];
  for (const lang of langs) {
    for (const kind of kinds) {
      try {
        const kindParam = kind ? `&kind=${kind}` : "";
        const ttUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}${kindParam}&fmt=srv3`;
        const res = await fetch(ttUrl);
        if (!res.ok) continue;
        const xml = await res.text();
        const transcript = extractFromXml(xml);
        if (transcript.length > 50) return { title, transcript };
      } catch { continue; }
    }
  }

  throw new Error("No se pudieron extraer subtítulos de este video. Puede que no tenga subtítulos habilitados o YouTube esté bloqueando la extracción. Prueba copiando el contenido manualmente.");
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL de YouTube requerida" }, { status: 400 });

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "URL de YouTube no válida." }, { status: 400 });
    }

    const { title, transcript } = await getTranscript(videoId);
    const text = transcript.length > 3000 ? transcript.substring(0, 3000) + "..." : transcript;

    return NextResponse.json({ text, title, videoId, charCount: text.length, source: "youtube_transcript" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error extrayendo transcript";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
