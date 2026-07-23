import http from 'http';
import https from 'https';

const TEST_URLS = {
  "Tendulkar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "Dhoni": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  "Ponting": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  "Warne": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  "Akram": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  "Lara": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80"
};

async function testUrl(name, url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      console.log(`URL Test [${name}]: HTTP status = ${res.statusCode}`);
      resolve(res.statusCode === 200);
    }).on('error', (err) => {
      console.log(`URL Test [${name}]: ERROR = ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  for (const [name, url] of Object.entries(TEST_URLS)) {
    await testUrl(name, url);
  }
}

run();
