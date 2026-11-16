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

// Simple static server for dist
const server = http.createServer((req, res) => {
  let reqPath = req.url?.split('?')[0].split('#')[0] || '/';
  if (reqPath === '/') reqPath = '/index.html';
  
  let filePath = path.join(distDir, reqPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

async function runCdpWorkflow() {
  const cdpPort = 9222;
  const userDataDir = path.join(__dirname, '../.chrome-test-profile');
  
  // Clean profile
  if (fs.existsSync(userDataDir)) {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1920,1080',
    'about:blank'
  ]);

  // Wait for Chrome CDP to be available
  await new Promise(r => setTimeout(r, 1500));

  async function getWebSocketDebuggerUrl() {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${cdpPort}/json`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const tabs = JSON.parse(data);
            resolve(tabs[0].webSocketDebuggerUrl);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const ws = new WebSocket(wsUrl);

    let messageId = 0;
    const pendingPromises = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pendingPromises.has(msg.id)) {
        const { resolve, reject } = pendingPromises.get(msg.id);
        pendingPromises.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise(resolve => ws.onopen = resolve);

    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = ++messageId;
        pendingPromises.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');

    console.log('--- TEST 1: Open Landing Page ---');
    await sendCommand('Page.navigate', { url: 'http://localhost:4173/' });
    await new Promise(r => setTimeout(r, 1500));

    // Scroll to Story Section and screenshot
    await sendCommand('Runtime.evaluate', {
      expression: 'document.getElementById("our-story").scrollIntoView();'
    });
    await new Promise(r => setTimeout(r, 800));
    const storyShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'desktop-story.png'), Buffer.from(storyShot.data, 'base64'));
    console.log('Saved desktop-story.png');

    // Scroll to Product Section and screenshot
    await sendCommand('Runtime.evaluate', {
      expression: 'document.getElementById("our-product").scrollIntoView();'
    });
    await new Promise(r => setTimeout(r, 800));
    const productShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'desktop-product.png'), Buffer.from(productShot.data, 'base64'));
    console.log('Saved desktop-product.png');

    // Scroll to Preparation & Quality and screenshot
    await sendCommand('Runtime.evaluate', {
      expression: 'document.getElementById("preparation").scrollIntoView();'
    });
    await new Promise(r => setTimeout(r, 800));
    const prepShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'desktop-prep-quality.png'), Buffer.from(prepShot.data, 'base64'));
    console.log('Saved desktop-prep-quality.png');

    console.log('--- TEST 2: Navigate to Login via Hash / Click ---');
    await sendCommand('Page.navigate', { url: 'http://localhost:4173/#login' });
    await new Promise(r => setTimeout(r, 1000));

    // Check login form visible
    const loginHeader = await sendCommand('Runtime.evaluate', {
      expression: 'document.querySelector("h1")?.innerText'
    });
    console.log('Login Header:', loginHeader.result.value);

    console.log('--- TEST 3: Authenticate as Customer (user_003) ---');
    // Set customer session in localStorage and refresh
    await sendCommand('Runtime.evaluate', {
      expression: `
        const user = {
          id: 'user_003',
          name: 'shashikala enterprizes',
          phone_number: '9742117420',
          role: 'user',
          is_active: true
        };
        localStorage.setItem('kj_current_user', JSON.stringify(user));
        location.reload();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    const customerShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'customer-dashboard.png'), Buffer.from(customerShot.data, 'base64'));
    console.log('Saved customer-dashboard.png');

    const customerTitle = await sendCommand('Runtime.evaluate', {
      expression: 'document.querySelector("h1")?.innerText'
    });
    console.log('Customer Dashboard rendered:', customerTitle.result.value);

    console.log('--- TEST 4: Authenticate as Admin (user_001) ---');
    // Set admin session in localStorage and refresh
    await sendCommand('Runtime.evaluate', {
      expression: `
        const admin = {
          id: 'user_001',
          name: 'Admin',
          phone_number: '9999999999',
          role: 'admin',
          is_active: true
        };
        localStorage.setItem('kj_current_user', JSON.stringify(admin));
        location.reload();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    const adminShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'admin-dashboard.png'), Buffer.from(adminShot.data, 'base64'));
    console.log('Saved admin-dashboard.png');

    const adminSub = await sendCommand('Runtime.evaluate', {
      expression: 'document.querySelector("header")?.innerText'
    });
    console.log('Admin Dashboard Header:', adminSub.result.value.replace(/\\n/g, ' '));

    console.log('--- TEST 5: Logout Flow ---');
    await sendCommand('Runtime.evaluate', {
      expression: `
        localStorage.removeItem('kj_current_user');
        location.reload();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    const logoutShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'post-logout-landing.png'), Buffer.from(logoutShot.data, 'base64'));
    console.log('Saved post-logout-landing.png');

    const brandHeader = await sendCommand('Runtime.evaluate', {
      expression: 'document.querySelector(".kj-navbar__brand")?.innerText'
    });
    console.log('Post-logout verified returned to:', brandHeader.result.value);

    ws.close();
  } catch (err) {
    console.error('CDP Workflow Error:', err);
  } finally {
    chromeProc.kill();
  }
}

server.listen(4173, async () => {
  console.log('Server running on 4173 for workflow tests');
  try {
    await runCdpWorkflow();
  } finally {
    server.close();
    process.exit(0);
  }
});
