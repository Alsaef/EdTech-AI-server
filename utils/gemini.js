const fetch = require('node-fetch');

async function generateText(prompt) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openaiKey) {
    throw new Error('No API key set for Gemini/OpenAI');
  }

  if (geminiKey) {
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-mini';
    const url = process.env.GEMINI_API_URL || `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
        maxOutputTokens: parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || '250', 10)
      }
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    if (!resp.ok) {
      const errorMessage = data.error?.message || JSON.stringify(data);
      throw new Error(`Gemini API request failed: ${errorMessage}`);
    }

    if (Array.isArray(data.candidates) && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    if (Array.isArray(data.candidates) && data.candidates[0]?.output) {
      return data.candidates[0].output.trim();
    }

    if (typeof data.output?.text === 'string') {
      return data.output.text.trim();
    }

    return JSON.stringify(data);
  }

  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  const url = 'https://api.openai.com/v1/chat/completions';
  const body = {
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 250,
    temperature: 0.7
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`
    },
    body: JSON.stringify(body)
  });

  const data = await resp.json();
  if (!resp.ok) {
    const errorMessage = data.error?.message || JSON.stringify(data);
    throw new Error(`OpenAI request failed: ${errorMessage}`);
  }

  if (data.choices && data.choices[0]?.message?.content) {
    return data.choices[0].message.content.trim();
  }

  if (data.choices && data.choices[0]?.text) {
    return data.choices[0].text.trim();
  }

  return JSON.stringify(data);
}

module.exports = { generateText };
