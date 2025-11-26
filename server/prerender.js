import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const template = readFileSync(join(__dirname, '../dist/public/index.html'), 'utf-8');

// Dynamic meta tags for social media crawlers
app.get('/details/*', (req, res) => {
  const html = template.replace('<title>', `<title>${req.query.title || 'Loksatya News'}</title>
    <meta property="og:title" content="${req.query.title || 'Loksatya News'}" />
    <meta property="og:description" content="${req.query.description || 'Latest news from Loksatya'}" />
    <meta property="og:image" content="${req.query.image || 'https://loksatya.com/logo.png'}" />
    <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}" />`);
  
  res.send(html);
});

export default app;