import express from 'express';
import type { Request, Response } from 'express';
import { chantController } from './controllers/chat.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('GROQ_API_KEY');
});

router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello worldfajdgo' });
});

router.post('/api/chat', chantController.sendMessage);

export default router;
