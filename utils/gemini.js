const fetch = require('node-fetch');

async function generateText(prompt, conversationHistory = []) {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY not set in environment');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = process.env.GEMINI_API_URL || `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

  const systemInstruction = `You are an expert IELTS and immigration advisor. Answer the user's question directly, with practical country guidance for IELTS band scores. Avoid praise, vague statements, and generic congratulations. If the user asks about band 7, explain which countries typically accept a band 7 for study or immigration and what kinds of applications it is suitable for.`;

  let fullPrompt = `${systemInstruction}\n\n`;
  if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
    conversationHistory.forEach((item) => {
      const role = item.role === 'assistant' ? 'Assistant' : 'User';
      fullPrompt += `${role}: ${item.content}\n`;
    });
    fullPrompt += '\n';
  }
  fullPrompt += `User: ${prompt}\nAssistant:`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: fullPrompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.5'),
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

  throw new Error('No valid response from Gemini API');
}

module.exports = { generateText };
