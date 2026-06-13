require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Jest shared secret is base64-encoded in the Developer Console
const SECRET = Buffer.from(process.env.JEST_SHARED_SECRET || '', 'base64');
const GAME_ID = process.env.JEST_GAME_ID || '';

// Maps SKU → gem amount granted. Keep in sync with GEM_PACKS in payments.js.
const SKU_GEMS = {
  gems_100:  100,
  gems_500:  550,
  gems_1200: 1400,
  gems_2500: 3000,
};

app.post('/api/verify-purchase', (req, res) => {
  const { purchaseSigned } = req.body;
  if (!purchaseSigned) return res.status(400).json({ valid: false, error: 'missing purchaseSigned' });

  let payload;
  try {
    payload = jwt.verify(purchaseSigned, SECRET, { algorithms: ['HS256'] });
  } catch (e) {
    console.error('JWT verification failed:', e.message);
    return res.status(400).json({ valid: false, error: 'invalid signature' });
  }

  // Confirm the token is for this game
  if (GAME_ID && payload.aud !== GAME_ID) {
    return res.status(400).json({ valid: false, error: 'wrong game' });
  }

  // Reject tokens older than 5 minutes
  if (Date.now() / 1000 - payload.iat > 300) {
    return res.status(400).json({ valid: false, error: 'token expired' });
  }

  const sku = payload.productSku;
  const gemAmount = SKU_GEMS[sku];

  if (!gemAmount) {
    return res.status(400).json({ valid: false, error: 'unknown sku' });
  }

  res.json({ valid: true, sku, playerId: payload.sub, gemAmount });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Opps server running on port ${PORT}`));
