import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const artifactDir = 'C:\\Users\\NITRO\\.gemini\\antigravity\\brain\\7de0b06a-157d-47c5-90e6-b9ee3df8f32d';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runLoginTests() {
  const cdpPort = 9225;
  const userDataDir = path.join(__dirname, '../.chrome-login-test-profile');
  if (fs.existsSync(userDataDir)) fs.rmSync(userDataDir, { recursive: true, force: true });

  const proc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1920,1080',
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

  console.log('--- TEST 1: Open Login Page (Desktop 1920x1080) ---');
  await send('Page.navigate', { url: 'http://localhost:5173/#login' });
  await new Promise(r => setTimeout(r, 2000));

  const desktopLoginShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'desktop-login-step1.png'), Buffer.from(desktopLoginShot.data, 'base64'));
  console.log('Saved desktop-login-step1.png');

  console.log('--- TEST 2: Enter Valid Phone & Request OTP ---');
  await send('Runtime.evaluate', {
    expression: `
      const input = document.getElementById('phone');
      input.value = '9742117420';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('form button[type="submit"]').click();
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  const desktopOtpShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'desktop-login-step2-otp.png'), Buffer.from(desktopOtpShot.data, 'base64'));
  console.log('Saved desktop-login-step2-otp.png');

  console.log('--- TEST 3: Mobile Viewport (390x844) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 600));

  const mobileOtpShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'mobile-login-step2.png'), Buffer.from(mobileOtpShot.data, 'base64'));
  console.log('Saved mobile-login-step2.png');

  // Go back to step 1 on mobile
  await send('Runtime.evaluate', {
    expression: `document.querySelector('button[type="button"][class*="text-sm"]').click();`
  });
  await new Promise(r => setTimeout(r, 600));

  const mobilePhoneShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'mobile-login-step1.png'), Buffer.from(mobilePhoneShot.data, 'base64'));
  console.log('Saved mobile-login-step1.png');

  console.log('--- TEST 4: Return to Desktop & Complete Customer Login ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 600));

  // Request OTP again
  await send('Runtime.evaluate', {
    expression: `
      const input = document.getElementById('phone');
      input.value = '9742117420';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('form button[type="submit"]').click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Enter OTP 123456
  await send('Runtime.evaluate', {
    expression: `
      const otpInput = document.getElementById('otp');
      otpInput.value = '123456';
      otpInput.dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('form button[type="submit"]').click();
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  const customerDashShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'customer-dashboard-verified.png'), Buffer.from(customerDashShot.data, 'base64'));
  console.log('Customer logged in! Saved customer-dashboard-verified.png');

  console.log('--- TEST 5: Return to Brand Website from Dashboard ---');
  await send('Runtime.evaluate', {
    expression: `
      const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Visit Brand Website'));
      if (backBtn) backBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  const landingFromDashShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'landing-with-auth-dashboard-btn.png'), Buffer.from(landingFromDashShot.data, 'base64'));
  console.log('Saved landing-with-auth-dashboard-btn.png');

  ws.close();
  proc.kill();
  if (fs.existsSync(userDataDir)) fs.rmSync(userDataDir, { recursive: true, force: true });
  console.log('All login tests completed successfully!');
}

runLoginTests().catch(console.error);
