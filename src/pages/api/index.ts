// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data<T extends object = object> = {
  data: T[];
};

interface DataInfo {
  length: number;
  keys: string[];
  levels: number;
  cleanJson: Data;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const rawData = req.body;

    // so we can use the data for analysis
    const data = JSON.parse(rawData) as Data;
    const array = data.data;

    // clean the data
    const cleanJson = getUsableData(cleanJSON(data));
    const dataInfo: DataInfo = {
      length: array.length,
      keys: getUniqueKeysFromArrayOfObjects(cleanJson.data as object[]),
      levels: 0,
      // @ts-expect-error
      cleanJson,
    };

    //#region get the levels
    //* this is not working, and is not needed. Remove in the next commit.
    const levels = array.map((item) => {
      const keys = Object.keys(item);
      return keys.length;
    });

    dataInfo.levels = Math.max(...levels);
    //#endregion

    res.status(200).json({ dataInfo });
  } else {
    res.status(400).json({ error: 'No data' });
  }
}

function cleanJSON(json: Data): Data {
  const array = json.data;

  const uselessFields = ['id', 'thumbnail', 'images', 'description'];
  array.forEach((item) => {
    const obj = item;
    Object.keys(obj).forEach((key) => {
      uselessFields.forEach((uselessField) => {
        if (key === uselessField && uselessField in obj) {
          // @ts-expect-error
          delete obj[key];
        }
      });
    });
  });

  return {
    data: array,
  };
}

function addLevelRandomKey(json: Data): Data {
  const array = json.data;
  array.forEach((item) => {
    const obj = item;
    // @ts-expect-error
    obj['testObj'] = {
      test: Math.round(Math.random() * 100),
    };
    // @ts-expect-error
    obj['testObj2'] = {
      testObj: {
        test: Math.round(Math.random() * 100),
      },
    };
  });

  return {
    data: array,
  };
}

function flattenNestedObject<T extends object>(obj: T, prefix = ''): T {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}.` : '';
    // @ts-expect-error
    if (typeof obj[k] === 'object') {
      // @ts-expect-error
      Object.assign(acc, flattenNestedObject(obj[k], pre + k));
    } else {
      // @ts-expect-error
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {}) as T;
}

function getUniqueKeysFromArrayOfObjects(arrayOfObjects: object[]) {
  const uniqueKeys = new Set(arrayOfObjects.map((item) => Object.keys(item)).flat());
  const arrUniqueKeys = Array.from(uniqueKeys);
  return arrUniqueKeys;
}

function getUsableData(data: Data) {
  // delete all keys that are non numeric
  const array = data.data;
  array.forEach((item) => {
    const obj = item;
    Object.keys(obj).forEach((key) => {
      // @ts-expect-error
      if (isNaN(Number(obj[key]))) {
        // @ts-expect-error
        delete obj[key];
      }
    });
  });

  addLevelRandomKey({ data: array });
  // @ts-expect-error
  return { data: array.map(flattenNestedObject) };
}
