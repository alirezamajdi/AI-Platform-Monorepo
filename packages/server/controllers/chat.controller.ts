import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required!')
      .max(1000, 'Prompt is too long (max is 1000 characters)'),
});

export const chantController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = chatSchema.safeParse(req.body);

      if (!parseResult.success) {
         res.status(400).json(parseResult.error.format());
         return;
      }

      const { prompt } = req.body;
      const reply = await chatService.sendMessage(prompt);
      return res.json({ message: reply });
   },
};
