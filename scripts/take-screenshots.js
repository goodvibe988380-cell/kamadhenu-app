import http from 'http';
import fs from 'fs';
import path from 'path';
import { execFile, spawn } from 'child_process';
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

async function runScreenshot(name, url, windowSize = '1920,1080', delay = 1000) {
  const outputPath = path.join(artifactDir, name);
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--window-size=${windowSize}`,
      `--screenshot=${outputPath}`,
      `--virtual-time-budget=${delay}`,
      url
    ];

    const proc = spawn(chromePath, args);
    proc.on('close', (code) => {
      if (fs.existsSync(outputPath)) {
        console.log(`Captured ${name} successfully (${fs.statSync(outputPath).size} bytes)`);
        resolve(outputPath);
      } else {
        console.error(`Failed to capture ${name}, code: ${code}`);
        resolve(null);
      }
    });
    proc.on('error', (err) => {
      console.error(`Error capturing ${name}:`, err);
      reject(err);
    });
  });
}

server.listen(4173, async () => {
  console.log('Test server running at http://localhost:4173');

  try {
    // 1. Desktop Hero (1920x1080)
    await runScreenshot('desktop-hero.png', 'http://localhost:4173/', '1920,1080', 2000);

    // 2. Mobile Hero (390x844)
    await runScreenshot('mobile-hero.png', 'http://localhost:4173/', '390,844', 2000);

    // 3. Login Page (1920x1080)
    await runScreenshot('existing-login.png', 'http://localhost:4173/#login', '1920,1080', 2000);

    // 4. Mobile Login (390x844)
    await runScreenshot('mobile-login.png', 'http://localhost:4173/#login', '390,844', 2000);

    console.log('All screenshots completed successfully!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
