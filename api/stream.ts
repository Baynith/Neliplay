import { Readable } from 'stream';

export default async function handler(req: any, res: any) {
  const videoUrl = req.query?.url as string;
  if (!videoUrl || !videoUrl.startsWith('https://')) {
    return res.status(400).send('Invalid video url');
  }

  try {
    const headers: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    if (req.headers?.range) {
      headers['range'] = req.headers.range as string;
    }

    const upstream = await fetch(videoUrl, {
      method: 'GET',
      headers,
    });

    res.status(upstream.status);

    upstream.headers.forEach((val: string, key: string) => {
      const lowerKey = key.toLowerCase();
      if (!['content-encoding', 'connection', 'keep-alive'].includes(lowerKey)) {
        res.setHeader(key, val);
      }
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept-Ranges', 'bytes');

    if (upstream.body) {
      // @ts-expect-error Node stream from web stream
      const nodeStream = Readable.fromWeb(upstream.body);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    console.error('Vercel streaming proxy error:', err);
    if (!res.headersSent) {
      res.status(500).send('Streaming proxy failed');
    }
  }
}
