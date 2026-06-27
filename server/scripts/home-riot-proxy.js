/**
 * Home Riot Proxy — run on your PC (residential IP) to bypass datacenter blocks.
 *
 * Setup:
 *   1. Put RIOT_API_KEY and RIOT_PROXY_SECRET in server/.env
 *   2. npm run proxy:home
 *   3. Expose with Cloudflare Tunnel: cloudflared tunnel --url http://localhost:8787
 *   4. On Render set RIOT_PROXY_URL=https://your-tunnel.trycloudflare.com
 *      and RIOT_PROXY_SECRET=same-secret (remove direct RIOT_API_KEY from Render)
 */
const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const PORT = parseInt(process.env.RIOT_PROXY_PORT || '8787', 10);
const API_KEY = (process.env.RIOT_API_KEY || '').trim();
const PROXY_SECRET = (process.env.RIOT_PROXY_SECRET || '').trim();

if (!API_KEY || !PROXY_SECRET) {
  console.error('Missing RIOT_API_KEY or RIOT_PROXY_SECRET in server/.env');
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: '32kb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'home-riot-proxy' });
});

app.post('/forward', async (req, res) => {
  const secret = req.headers['x-proxy-secret'];
  if (secret !== PROXY_SECRET) {
    res.status(401).json({ error: 'Unauthorized proxy request' });
    return;
  }

  const { url } = req.body || {};
  if (typeof url !== 'string' || !url.startsWith('https://')) {
    res.status(400).json({ error: 'Invalid Riot API url' });
    return;
  }

  if (!url.includes('.api.riotgames.com')) {
    res.status(400).json({ error: 'Only riotgames.com API urls are allowed' });
    return;
  }

  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'X-Riot-Token': API_KEY,
        Accept: 'application/json',
        'User-Agent': 'LoL-Info-HomeProxy/1.0',
      },
      validateStatus: () => true,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[home-riot-proxy] forward failed:', error.message);
    res.status(502).json({ error: 'Failed to reach Riot API from home proxy' });
  }
});

app.listen(PORT, () => {
  console.log(`Home Riot proxy listening on http://localhost:${PORT}`);
  console.log('Expose with: cloudflared tunnel --url http://localhost:' + PORT);
});
