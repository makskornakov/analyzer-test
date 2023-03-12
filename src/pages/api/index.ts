// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data: Object[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const rawData = req.body;

    // so we can use the data for analysis
    const data = JSON.parse(rawData) as Data;
    const array = data.data;

    if (array.length > 0) {
      res.status(200).json({ data: array.length });
    } else {
      res.status(400).json({ error: 'No data' });
    }
  } else {
    res.status(400).json({ error: 'No data' });
  }
}
