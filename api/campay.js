export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint } = req.query;
  const CAMPAY_URL = 'https://demo.campay.net/api';

  try {
    // Étape 1 : obtenir le token
    const tokenRes = await fetch(`${CAMPAY_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username:  "GYOBdPs75TL9rivaLaF1gUXfZqRiIKM6AZk3pi8_A5sAszE5Mth24ms-1BgYUTcNKSF0woai8Y3SU2BEXXYqRw",
        password: "bbAC00RJb3DlK9t_LN_WlI8IRvvyb_Lc6ZcBUfUgFJqheFXLHjnbbsT6Bc7WiuvOJcTiB2PGFCD4rbeNF9syRQ",
      })
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.token;

    // Étape 2 : appeler l'endpoint demandé
    const response = await fetch(`${CAMPAY_URL}/${endpoint}/`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
