import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const template = readFileSync(path.join(__dirname, 'public/index.html'), 'utf-8');

// Dynamic meta tags with better error handling
app.get('/details/*', async (req, res) => {
  try {
    const storyId = req.query.id;
    let html = template;

    if (storyId) {
      try {
        const API_URL = 'https://admin.loksatya.com/api';
        const requestUrl = `${API_URL}/article?id=${storyId}`;
        
        const articleResponse = await axios.get(requestUrl, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
          }
        });
        
        if (articleResponse.data && articleResponse.data[0]) {
          const articleData = articleResponse.data[0];
          
          const title = articleData.title || 'Loksatya News';
          const description = articleData.discription 
            ? articleData.discription.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
            : 'Stay updated with the latest news at Loksatya.';
          
          let imageUrl = articleData.image || 'https://loksatya.com/assets/Logo-new-BNYCZvJK.PNG';
          
          // Firebase URL optimize
          if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
            imageUrl = imageUrl.split('?')[0] + '?alt=media';
          }

          const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

          // Meta tags injection
          html = html
            .replace('<title>Loksatya News</title>', `<title>${title}</title>`)
            .replace('</head>', `
              <meta name="description" content="${description}" />
              <meta property="og:title" content="${title}" />
              <meta property="og:description" content="${description}" />
              <meta property="og:image" content="${imageUrl}" />
              <meta property="og:url" content="${currentUrl}" />
              <meta property="og:type" content="article" />
              <meta property="og:site_name" content="LokSatya News" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="${title}" />
              <meta name="twitter:description" content="${description}" />
              <meta name="twitter:image" content="${imageUrl}" />
              <meta name="author" content="${articleData.reportedBy || 'LokSatya'}" />
              <link rel="canonical" href="${currentUrl}" />
            </head>`);
          
        } else {
          console.log('❌ No article data found in response');
        }
      } catch (apiError) {
        console.log('❌ API Error:', apiError.message);
        console.log('⚠️ Using fallback meta tagss');
        
        const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        html = html.replace('</head>', `
          <meta name="description" content="Latest news from Loksatya" />
          <meta property="og:title" content="Loksatya News" />
          <meta property="og:description" content="Stay updated with latest news from Loksatya" />
          <meta property="og:image" content="https://loksatya.com/assets/Logo-new-BNYCZvJK.PNG" />
          <meta property="og:url" content="${currentUrl}" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Loksatya News" />
          <meta name="twitter:description" content="Latest news from Loksatya" />
          <meta name="twitter:image" content="https://loksatya.com/assets/Logo-new-BNYCZvJK.PNG" />
        </head>`);
      }
    } else {
      console.log('❌ No story ID provided in URL');
    }

    res.send(html);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.send(template);
  }
});


// add 30-10-25
// Add this specific route for Facebook crawler
app.get('/api/facebook-crawler', async (req, res) => {
  const { url } = req.query;

  try {
    // Extract ID from URL
    const urlObj = new URL(url);
    const id = urlObj.searchParams.get('id');

    if (id) {
      const API_URL = 'https://admin.loksatya.com/api';
      const articleResponse = await axios.get(`${API_URL}/article?id=${id}`);

      if (articleResponse.data && articleResponse.data[0]) {
        const article = articleResponse.data[0];

        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta property="og:title" content="${article.title}" />
            <meta property="og:description" content="${article.discription?.replace(/<[^>]*>/g, '').substring(0, 160)}" />
            <meta property="og:image" content="${getOptimizedImageUrl(article.image)}" />
            <meta property="og:url" content="${url}" />
            <meta property="og:type" content="article" />
            <meta property="og:site_name" content="LokSatya News" />
          </head>
          <body>
            <h1>${article.title}</h1>
          </body>
          </html>
        `;

        res.send(html);
        return;
      }
    }

    // Fallback
    res.redirect(302, url);
  } catch (error) {
    console.error('Facebook crawler error:', error);
    res.redirect(302, url);
  }
});

// All other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app; 