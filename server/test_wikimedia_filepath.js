import https from 'https';

const url = "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Sachin_Tendulkar_at_MRF_Pace_Foundation_July_2014.jpg&width=400";

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  console.log(`HTTP status = ${res.statusCode}`);
  console.log(`Content-Type = ${res.headers['content-type']}`);
  console.log(`Location = ${res.headers.location}`);
});
