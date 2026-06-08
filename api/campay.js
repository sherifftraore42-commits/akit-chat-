export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'endpoint manquant' });

  const CAMPAY_TOKEN = "03f1cee7cddfed67c64eef581cddc1ad6f050db7";
  const url = `https://campay.net/${endpoint}`;

  try {
    const options = {
      method: req.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${CAMPAY_TOKEN}`
      }
    };

    if (req.method === 'POST') {
      options.body = JSON.stringify(req.body || {});
    }

    const response = await fetch(url, options);
    const text = await response.text();
    
    let data;
    try { data = JSON.parse(text); } 
    catch { data = { raw: text }; }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
