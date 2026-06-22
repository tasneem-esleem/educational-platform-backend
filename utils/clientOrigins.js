
const rawValue = process.env.CLIENT_URLS || process.env.CLIENT_URL || '';

const normalize = (url) => url.trim().replace(/\/+$/, ''); // شيل أي "/" بالنهاية

const allowedOrigins = rawValue
  .split(',')
  .map(normalize)
  .filter(Boolean);

['http://localhost:3000', 'http://127.0.0.1:3000'].forEach((url) => {
  if (!allowedOrigins.includes(url)) allowedOrigins.push(url);
});

const defaultClientUrl = allowedOrigins[0] || 'http://localhost:3000';

const resolveClientOrigin = (candidate) => {
  if (!candidate) return defaultClientUrl;
  const clean = normalize(candidate);
  const match = allowedOrigins.find(
    (origin) => clean === origin || clean.startsWith(origin)
  );
  return match || defaultClientUrl;
};

module.exports = { allowedOrigins, defaultClientUrl, resolveClientOrigin };
