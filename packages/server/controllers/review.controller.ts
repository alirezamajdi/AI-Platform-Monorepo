import type { Request, Response } from 'express';
import { InferenceClient } from '@huggingface/inference';

const client = new InferenceClient(process.env.HF_TOKEN);

export const reviewController = {
  async summarizer(req: Request, res: Response) {
    const output = await client.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: req.body.input,
      provider: 'hf-inference',
    });
    return res.json(output);
  },
  async questionAnswering(req: Request, res: Response) {
    const answer = await client.questionAnswering({
      model: 'deepset/roberta-base-squad2',
      inputs: {
        question: req.body.input,
        context: 'My name is Clara and I live in Berkeley.',
      },
    });
    return res.json(answer);
  },
};
