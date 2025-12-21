import type { Request, Response } from 'express';
import express from 'express';
import { chantController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

router.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

router.post('/api/chat', chantController.sendMessage);

router.post('/api/review', reviewController.questionAnswering);

export default router;
