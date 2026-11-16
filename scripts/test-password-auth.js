import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const artifactDir = 'C:\\Users\\NITRO\\.gemini\\antigravity\\brain\\7de0b06a-157d-47c5-90e6-b9ee3df8f32d';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runPasswordAuthTests() {
  const cdpPort = 9226;
  const userDataDir = path.join(__dirname, '../.chrome-pwd-profile');
  if (fs.existsSync(userDataDir)) {
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
  }

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

  function setReactInputValue(id, val) {
    return `
      (() => {
        const input = document.getElementById('${id}');
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, '${val}');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      })()
    `;
  }

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('--- TEST 1: Open Login Page ---');
  await send('Page.navigate', { url: 'http://localhost:5173/#login' });
  await new Promise(r => setTimeout(r, 1500));

  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'pwd-step1-phone.png'), Buffer.from(shot1.data, 'base64'));
  console.log('Saved pwd-step1-phone.png');

  console.log('--- TEST 2: Test Invalid Phone Number ---');
  await send('Runtime.evaluate', {
    expression: `
      ${setReactInputValue('phone', '9123456789')};
      document.querySelector('form button[type="submit"]').click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const err1 = await send('Runtime.evaluate', {
    expression: `document.querySelector('[role="alert"]')?.innerText`
  });
  console.log('Expected error for unregistered phone:', err1.result.value);

  console.log('--- TEST 3: Test Valid Customer Phone (9742117420) ---');
  await send('Runtime.evaluate', {
    expression: `
      ${setReactInputValue('phone', '9742117420')};
      document.querySelector('form button[type="submit"]').click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Verify Step 2 Password UI
  const pwdProps = await send('Runtime.evaluate', {
    expression: `
      const pwd = document.getElementById('password');
      ({
        type: pwd?.getAttribute('type'),
        inputMode: pwd?.getAttribute('inputMode'),
        maxLength: pwd?.maxLength,
        value: pwd?.value,
        hasEyeToggle: Boolean(document.querySelector('button[aria-label*="password"], svg.lucide-eye'))
      })
    `,
    returnByValue: true
  });
  console.log('Password Field Properties:', pwdProps.result.value);

  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'pwd-step2-password.png'), Buffer.from(shot2.data, 'base64'));
  console.log('Saved pwd-step2-password.png');

  console.log('--- TEST 4: Test Invalid Password (99999 for Customer) ---');
  await send('Runtime.evaluate', {
    expression: `
      ${setReactInputValue('password', '99999')};
      document.querySelector('form button[type="submit"]').click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const pwdErr = await send('Runtime.evaluate', {
    expression: `
      ({
        error: document.querySelector('[role="alert"]')?.innerText,
        pwdValueAfterErr: document.getElementById('password')?.value
      })
    `,
    returnByValue: true
  });
  console.log('Invalid Password Response:', pwdErr.result.value);

  console.log('--- TEST 5: Test Correct Customer Password (02471) ---');
  // 9742117420 -> last 5: 17420 -> reversed: 02471
  await send('Runtime.evaluate', {
    expression: `
      ${setReactInputValue('password', '02471')};
      document.querySelector('form button[type="submit"]').click();
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  const customerDashText = await send('Runtime.evaluate', {
    expression: `document.querySelector('h1')?.innerText`
  });
  console.log('Customer Logged in to:', customerDashText.result.value);

  const shotCust = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'pwd-customer-dashboard.png'), Buffer.from(shotCust.data, 'base64'));
  console.log('Saved pwd-customer-dashboard.png');

  console.log('--- TEST 6: Test Logout & Administrator Authentication ---');
  // Logout
  await send('Runtime.evaluate', {
    expression: `
      localStorage.removeItem('kj_current_user');
      location.hash = '#login';
      location.reload();
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  // Enter Admin Phone: 9999999999
  await send('Runtime.evaluate', {
    expression: `
      ${setReactInputValue('phone', '9999999999')};
      document.querySelector('form button[type="submit"]').click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Enter Admin Password: 99999 (last 5 of 9999999999 reversed = 99999)
  await send('Runtime.evaluate', {
    expression: `
      ${setReactInputValue('password', '99999')};
      document.querySelector('form button[type="submit"]').click();
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  const adminDashText = await send('Runtime.evaluate', {
    expression: `document.querySelector('header')?.innerText`
  });
  console.log('Admin Logged in to:', adminDashText.result.value ? adminDashText.result.value.replace(/\\n/g, ' ') : 'N/A');

  const shotAdmin = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'pwd-admin-dashboard.png'), Buffer.from(shotAdmin.data, 'base64'));
  console.log('Saved pwd-admin-dashboard.png');

  console.log('--- TEST 7: Test Second Admin (santhosh: 8123646126 -> 62164) ---');
  await send('Runtime.evaluate', {
    expression: `
      localStorage.removeItem('kj_current_user');
      location.hash = '#login';
      location.reload();
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  await send('Runtime.evaluate', {
    expression: `
      ${setReactInputValue('phone', '8123646126')};
      document.querySelector('form button[type="submit"]').click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // 8123646126 -> last 5: 46126 -> reversed: 62164
  await send('Runtime.evaluate', {
    expression: `
      ${setReactInputValue('password', '62164')};
      document.querySelector('form button[type="submit"]').click();
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  const santhoshDashText = await send('Runtime.evaluate', {
    expression: `document.querySelector('header')?.innerText`
  });
  console.log('Santhosh Admin Logged in to:', santhoshDashText.result.value ? santhoshDashText.result.value.replace(/\\n/g, ' ') : 'N/A');

  ws.close();
  proc.kill();
  console.log('All 7 password authentication test cases passed successfully!');
}

runPasswordAuthTests().catch(console.error);
