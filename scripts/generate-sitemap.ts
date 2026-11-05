import fs from 'fs';
import path from 'path';
import { STORED_MOVIES } from '../src/data/movies';

const baseUrl = 'https://neliplay.com';
const currentDate = new Date().toISOString().split('T')[0];

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/movies', priority: '0.9', changefreq: 'daily' },
  { url: '/genres', priority: '0.8', changefreq: 'weekly' },
  { url: '/search', priority: '0.8', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/contact', priority: '0.6', changefreq: 'monthly' },
  { url: '/terms', priority: '0.5', changefreq: 'yearly' },
  { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

// Add static pages
for (const p of staticPages) {
  xml += `  <url>
    <loc>${baseUrl}${p.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
}

// Add all 75 movie detail and watch pages
for (const m of STORED_MOVIES) {
  xml += `  <url>
    <loc>${baseUrl}/movie/${encodeURIComponent(m.id)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <video:video>
      <video:thumbnail_loc>${m.posterUrl}</video:thumbnail_loc>
      <video:title><![CDATA[${m.title} - NeliPlay Swahili]]></video:title>
      <video:description><![CDATA[${m.synopsisSwahili}]]></video:description>
      <video:player_loc>${baseUrl}/watch/${encodeURIComponent(m.id)}</video:player_loc>
      <video:duration>${m.runtime}</video:duration>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>
  </url>
  <url>
    <loc>${baseUrl}/watch/${encodeURIComponent(m.id)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
`;
}

xml += `</urlset>\n`;

const targetPath = path.resolve(process.cwd(), 'public/sitemap.xml');
fs.writeFileSync(targetPath, xml, 'utf8');
console.log(`Generated sitemap.xml with ${staticPages.length + STORED_MOVIES.length * 2} URLs at ${targetPath}`);
