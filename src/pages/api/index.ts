// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data: Object[];
};

interface DataInfo {
  length: number;
  keys: string[];
  levels: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const rawData = req.body;

    // so we can use the data for analysis
    const data = JSON.parse(rawData) as Data;
    const array = data.data;

    const dataInfo: DataInfo = {
      length: array.length,
      keys: [],
      levels: 0,
    };

    // get the keys
    array.forEach((item) => {
      const keys = Object.keys(item);
      dataInfo.keys = [...dataInfo.keys, ...keys];
    });

    // get the levels
    const levels = array.map((item) => {
      const keys = Object.keys(item);
      return keys.length;
    });

    dataInfo.levels = Math.max(...levels);

    res.status(200).json({ dataInfo });
  } else {
    res.status(400).json({ error: 'No data' });
  }
}
