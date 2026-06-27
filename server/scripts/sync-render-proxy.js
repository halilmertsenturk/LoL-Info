/**
 * Updates Render lol-info-api env vars for home proxy mode.
 * Requires RENDER_API_KEY in server/.env (from Render Dashboard → Account → API Keys)
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const RENDER_API_KEY = (process.env.RENDER_API_KEY || '').trim();
const PROXY_URL = (process.env.RIOT_PROXY_URL || '').trim();
const PROXY_SECRET = (process.env.RIOT_PROXY_SECRET || '').trim();
const SERVICE_NAME = 'lol-info-api';

async function renderFetch(endpoint, options = {}) {
  const response = await fetch(`https://api.render.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${RENDER_API_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    throw new Error(`Render API ${response.status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  }

  return body;
}

async function findServiceId() {
  const data = await renderFetch('/services?limit=50');
  const services = Array.isArray(data) ? data.map((item) => item.service || item) : data;
  const service = services.find((s) => s.name === SERVICE_NAME || s.slug === SERVICE_NAME);
  if (!service?.id) {
    throw new Error(`Service "${SERVICE_NAME}" not found on Render account`);
  }
  return service.id;
}

async function upsertEnvVar(serviceId, key, value) {
  const existing = await renderFetch(`/services/${serviceId}/env-vars?limit=100`);
  const vars = Array.isArray(existing) ? existing.map((item) => item.envVar || item) : existing;
  const current = vars.find((v) => v.key === key);

  if (current?.id) {
    await renderFetch(`/services/${serviceId}/env-vars/${current.id}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
    console.log(`Updated ${key}`);
    return;
  }

  await renderFetch(`/services/${serviceId}/env-vars`, {
    method: 'POST',
    body: JSON.stringify({ key, value }),
  });
  console.log(`Created ${key}`);
}

async function main() {
  if (!RENDER_API_KEY) {
    throw new Error('RENDER_API_KEY missing in server/.env');
  }
  if (!PROXY_URL) {
    throw new Error('RIOT_PROXY_URL missing — start cloudflared tunnel first');
  }
  if (!PROXY_SECRET) {
    throw new Error('RIOT_PROXY_SECRET missing in server/.env');
  }

  const serviceId = await findServiceId();
  console.log(`Found Render service: ${serviceId}`);

  await upsertEnvVar(serviceId, 'RIOT_PROXY_URL', PROXY_URL);
  await upsertEnvVar(serviceId, 'RIOT_PROXY_SECRET', PROXY_SECRET);
  await upsertEnvVar(serviceId, 'RIOT_CACHE_ONLY', 'false');

  console.log('Render env synced for home proxy mode.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
