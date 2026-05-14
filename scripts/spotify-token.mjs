#!/usr/bin/env node
/**
 * One-time script to get a Spotify refresh token.
 *
 * Usage:
 *   node scripts/spotify-token.mjs <CLIENT_ID> <CLIENT_SECRET>
 *
 * Starts a local server on :8888, opens the Spotify auth page,
 * and prints the refresh token after you authorize.
 */

import http from 'node:http';
import { execFile } from 'node:child_process';
import { URL, URLSearchParams } from 'node:url';

const [clientId, clientSecret] = process.argv.slice(2);

if (!clientId || !clientSecret) {
  console.error('Usage: node scripts/spotify-token.mjs <CLIENT_ID> <CLIENT_SECRET>');
  process.exit(1);
}

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = 'user-read-currently-playing user-read-playback-state';

const authUrl = new URL('https://accounts.spotify.com/authorize');
authUrl.searchParams.set('client_id', clientId);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('scope', SCOPES);

const authString = authUrl.toString();

console.log('\n→ Opening Spotify authorization page...');
console.log(`  If it doesn't open, go to:\n  ${authString}\n`);

try {
  execFile('xdg-open', [authString], () => {});
} catch {
  try { execFile('open', [authString], () => {}); } catch { /* best-effort */ }
}

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith('/callback')) return;

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('<h1>Authorization denied.</h1>');
    console.error('Authorization denied:', error);
    process.exit(1);
  }

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await tokenRes.json();

  if (!data.refresh_token) {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<h1>Error getting refresh token.</h1>');
    console.error('Token response:', data);
    process.exit(1);
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Done! You can close this tab.</h1><p>Check your terminal for the refresh token.</p>');

  console.log('──────────────────────────────────────');
  console.log('SPOTIFY_REFRESH_TOKEN:');
  console.log(data.refresh_token);
  console.log('──────────────────────────────────────');
  console.log('\nAdd these to your .env:');
  console.log(`SPOTIFY_CLIENT_ID=${clientId}`);
  console.log(`SPOTIFY_CLIENT_SECRET=${clientSecret}`);
  console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
  console.log('');

  server.close(() => process.exit(0));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Listening on http://127.0.0.1:${PORT} ...\n`);
});
