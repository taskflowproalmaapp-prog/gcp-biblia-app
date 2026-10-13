exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' }, body: '' };
  }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Falta GEMINI_API_KEY' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch(e) { return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido' }) }; }

  const { prompt, maxTokens = 800 } = body;
  if (!prompt) return { statusCode: 400, body: JSON.stringify({ error: 'Falta prompt' }) };

  const errors = [];
  const models = ['gemini-3.5-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-flash-latest'];

  for (const modelo of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${API_KEY}`;
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 }
        })
      });
      const data = await resp.json();
      if (data.error) {
        errors.push(modelo + ': ' + data.error.message);
        continue;
      }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) { errors.push(modelo + ': respuesta vacía'); continue; }
      return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ text }) };
    } catch(e) {
      errors.push(modelo + ': ' + e.message);
      continue;
    }
  }

  return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: errors.join(' | ') }) };
};
