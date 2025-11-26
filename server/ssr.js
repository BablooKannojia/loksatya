import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve static files from dist directory
app.use(express.static(join(__dirname, '../dist/public')));

// Read the built HTML template
const template = readFileSync(join(__dirname, '../dist/public/index.html'), 'utf-8');

// Simple SSR route for details pages
app.get('/details/*', async (req, res) => {
  try {
    const storyId = req.query.id;
    
    // Here you would fetch your data server-side
    // For now, we'll use a simplified approach
    let initialData = null;
    
    if (storyId) {
      // You can add server-side data fetching here
      // initialData = await fetchArticleData(storyId);
    }

    // Basic HTML with meta tags for SEO
    const html = template
      .replace('<!--ssr-title-->', initialData?.title || 'Loksatya News')
      .replace('<!--ssr-meta-->', `
        <meta name="description" content="${initialData?.discription ? initialData.discription.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : 'Stay updated with the latest news at Loksatya.'}" />
        <meta property="og:title" content="${initialData?.title || 'Loksatya News'}" />
        <meta property="og:description" content="${initialData?.discription ? initialData.discription.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : 'Stay updated with the latest news at Loksatya.'}" />
        <meta property="og:image" content="${initialData?.image || 'https://loksatya.com/assets/Logo-new-BNYCZvJK.PNG'}" />
        <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}" />
        <meta property="og:type" content="article" />
      `);

    res.send(html);
  } catch (error) {
    console.error('SSR Error:', error);
    // Fallback to client-side rendering
    res.send(template);
  }
});

// All other routes use client-side rendering
app.get('*', (req, res) => {
  res.send(template);
});

export default app;