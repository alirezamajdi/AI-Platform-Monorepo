import express from 'express';
import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from './services/chat.service';
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('GROQ_API_KEY');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello worldfajdgo' });
});

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
   console.log('prompt', prompt);
   const reply = await chatService.sendMessage(prompt);
   return res.json({ message: reply });
});

app.listen(port, () => {
   console.log('server is run');
});
