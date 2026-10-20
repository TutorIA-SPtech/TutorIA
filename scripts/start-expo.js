const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

function isPrivateIpv4(address) {
  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10
    || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
    || (parts[0] === 192 && parts[1] === 168);
}

function interfacePriority(name, address) {
  const normalized = name.toLowerCase();
  if (/(docker|wsl|virtual|vmware|virtualbox|vbox|hyper-v|bluetooth|loopback|vethernet)/.test(normalized)) return 100;
  if (address.startsWith('192.168.')) return 0;
  if (address.startsWith('10.')) return 1;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(address)) return 2;
  return 10;
}

function detectLanIpv4() {
  const candidates = [];
  for (const [name, entries] of Object.entries(os.networkInterfaces())) {
    for (const entry of entries || []) {
      const isIpv4 = entry.family === 'IPv4' || entry.family === 4;
      if (!isIpv4 || entry.internal || !isPrivateIpv4(entry.address)) continue;
      candidates.push({ name, address: entry.address, priority: interfacePriority(name, entry.address) });
    }
  }
  candidates.sort((a, b) => a.priority - b.priority);
  return candidates.find((candidate) => candidate.priority < 100)?.address;
}

function readEnvFileValue(key) {
  try {
    const envText = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf8');
    const line = envText.split(/\r?\n/).find((entry) => entry.trim().startsWith(`${key}=`));
    return line ? line.trim().slice(key.length + 1).trim().replace(/^['"]|['"]$/g, '') : '';
  } catch {
    return '';
  }
}

function isLoopbackUrl(value) {
  try {
    return ['localhost', '127.0.0.1', '::1', '[::1]'].includes(new URL(value).hostname.toLowerCase());
  } catch {
    return !value;
  }
}

const configuredUrl = (
  process.env.EXPO_PUBLIC_API_URL !== undefined
    ? process.env.EXPO_PUBLIC_API_URL
    : readEnvFileValue('EXPO_PUBLIC_API_URL')
).trim();

if (!configuredUrl || isLoopbackUrl(configuredUrl)) {
  const ip = detectLanIpv4();
  if (ip) {
    process.env.EXPO_PUBLIC_API_URL = `http://${ip}:8080`;
    console.log(`[TutorIA] API configurada automaticamente: ${process.env.EXPO_PUBLIC_API_URL}`);
  } else {
    console.error('[TutorIA] Não foi possível detectar o IP local. Defina EXPO_PUBLIC_API_URL no .env.');
    process.exit(1);
  }
} else {
  process.env.EXPO_PUBLIC_API_URL = configuredUrl.replace(/\/+$/, '');
  console.log(`[TutorIA] Usando API configurada: ${process.env.EXPO_PUBLIC_API_URL}`);
}

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(command, ['expo', 'start', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
});
child.on('error', (error) => {
  console.error('[TutorIA] Não foi possível iniciar o Expo:', error.message);
  process.exit(1);
});
child.on('exit', (code) => process.exit(code ?? 1));
