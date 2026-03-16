import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    // Verificar autenticação via JWT do Supabase
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Ler body enviado pelo frontend
    const { mimeType, imageBase64 } = await req.json();
    if (!imageBase64 || !mimeType) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const GEMINI_KEY = Deno.env.get('GEMINI_KEY');
    if (!GEMINI_KEY) {
      return new Response(JSON.stringify({ error: 'Chave não configurada no servidor' }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Analise esta foto de um prato de comida e identifique os alimentos visíveis.
Para cada alimento retorne um objeto JSON com:
- nome: nome do alimento em português
- quantidade_g: quantidade estimada em gramas (número inteiro)
- kcal: calorias estimadas (número inteiro)
- carb_g: carboidratos em gramas (número com 1 decimal)
- prot_g: proteínas em gramas (número com 1 decimal)
- gord_g: gorduras em gramas (número com 1 decimal)

Retorne APENAS um array JSON válido, sem markdown, sem explicações, no formato:
[{"nome":"...","quantidade_g":0,"kcal":0,"carb_g":0.0,"prot_g":0.0,"gord_g":0.0}]`;

    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: prompt },
            ],
          }],
          generationConfig: { maxOutputTokens: 1024, temperature: 0.2 },
        }),
      }
    );

    if (!geminiResp.ok) {
      const err = await geminiResp.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini HTTP ${geminiResp.status}`);
    }

    const data = await geminiResp.json();
    const text = (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();

    return new Response(JSON.stringify({ text }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
