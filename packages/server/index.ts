import express from 'express';
import type { Request, Response } from 'express';
import z from 'zod';
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.get('/', (req: Request, res: Response) => {
   res.send(GROQ_API_KEY);
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello worldfajdgo' });
});

let chatHistory = [];

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required!')
      .max(1000, 'Prompt is too long (max is 1000 characters)'),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);

   if (!parseResult.success) {
      res.status(400).json(parseResult.error.format());
      return;
   }

   const { prompt } = req.body;
   chatHistory.push({ role: 'user', content: prompt });

   const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_API_KEY}`,
         },
         body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: chatHistory,
         }),
      }
   );
   const data = (await response.json()) as any;
   const reply = data.choices[0].message.content;
   chatHistory.push({ role: 'assistant', content: reply });

   res.json({ message: reply });
});

app.listen(port, () => {
   console.log('server is run');
});
