import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const artifactDir = 'C:\\Users\\NITRO\\.gemini\\antigravity\\brain\\7de0b06a-157d-47c5-90e6-b9ee3df8f32d';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url?.split('?')[0].split('#')[0] || '/';
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(distDir, reqPath);
  if (!fs.existsSync(filePath)) filePath = path.join(distDir, 'index.html');
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

async function runMobileMenuTest() {
  const cdpPort = 9223;
  const userDataDir = path.join(__dirname, '../.chrome-mobile-profile');
  if (fs.existsSync(userDataDir)) fs.rmSync(userDataDir, { recursive: true, force: true });

  const proc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=390,844',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const wsUrl = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${cdpPort}/json`, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(JSON.parse(data)[0].webSocketDebuggerUrl));
    }).on('error', reject);
  });

  const ws = new WebSocket(wsUrl);
  let id = 0;
  const map = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && map.has(m.id)) {
      map.get(m.id)(m.result);
      map.delete(m.id);
    }
  };
  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise(resolve => {
      const msgId = ++id;
      map.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 1500));

  // Click hamburger
  await send('Runtime.evaluate', {
    expression: 'document.querySelector(".kj-navbar__hamburger")?.click();'
  });
  await new Promise(r => setTimeout(r, 500));

  const mobileNavShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'mobile-navigation.png'), Buffer.from(mobileNavShot.data, 'base64'));
  console.log('Saved mobile-navigation.png successfully!');

  ws.close();
  proc.kill();
}

server.listen(4173, async () => {
  try {
    await runMobileMenuTest();
  } finally {
    server.close();
    process.exit(0);
  }
});
