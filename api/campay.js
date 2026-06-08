const CAMPAY_TOKEN = "03f1cee7cddfed67c64eef581cddc1ad6f050db7";
const CAMPAY_BASE = "https://campay.net";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint } = req.query;
  if (!endpoint) {
    return res.status(400).json({ error: 'endpoint manquant' });
  }

  try {
    const url = CAMPAY_BASE + '/' + endpoint;
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${CAMPAY_TOKEN}`
      }
    };

    if (req.method === 'POST' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
