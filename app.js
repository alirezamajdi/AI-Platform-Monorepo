import OpenAI from 'openai';

// const client = new OpenAI({
//    apiKey: process.env.OPENAI_API_KEY,
// });

// const response = await client.responses.create({
//   model: "o4-mini",
//   input: "Write a story about robot",
//   temperature: 0.7,
//   max_output_tokens: 50,
// });

const response = await fetch(
  'https://api.groq.com/openai/v1/chat/completions',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: 'Write a story about a robot' }],
    }),
  }
);

const data = await response.json();
console.log(data.choices[0].message);
