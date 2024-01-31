import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { email }
  } = req;
  res.status(200).json({ text: 'Hello' });
}
