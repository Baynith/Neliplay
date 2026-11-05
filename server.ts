import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Readable } from 'stream';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // 1. Streaming Proxy for Bunny CDN & Protected Media Streams
  // Bypasses domain hotlinking restrictions by stripping Referer & Origin headers
  app.get('/api/stream', async (req, res) => {
    const videoUrl = req.query.url as string;
    if (!videoUrl || !videoUrl.startsWith('https://')) {
      return res.status(400).send('Invalid video url');
    }

    try {
      const headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      };

      // Forward client Range request if available (essential for video seeking)
      if (req.headers.range) {
        headers['range'] = req.headers.range;
      }

      const upstream = await fetch(videoUrl, {
        method: 'GET',
        headers,
      });

      res.status(upstream.status);

      // Forward relevant video headers
      upstream.headers.forEach((val, key) => {
        const lowerKey = key.toLowerCase();
        if (!['content-encoding', 'connection', 'keep-alive'].includes(lowerKey)) {
          res.setHeader(key, val);
        }
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Accept-Ranges', 'bytes');

      if (upstream.body) {
        // Stream directly to response without buffering in memory
        // @ts-expect-error Node stream from web stream
        const nodeStream = Readable.fromWeb(upstream.body);
        nodeStream.pipe(res);
      } else {
        res.end();
      }
    } catch (err) {
      console.error('Video streaming proxy error:', err);
      if (!res.headersSent) {
        res.status(500).send('Streaming proxy failed');
      }
    }
  });

  // 2. Vite Middleware or Static Assets
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(import.meta.dirname || '.', 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(import.meta.dirname || '.', 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NeliPlay Swahili Server ready on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
