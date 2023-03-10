import Head from 'next/head';
// import Image from 'next/image'
import { Button } from '@/styles/main.styled';

export default function Home() {
  return (
    <>
      <Head>
        <title>Data analyzer</title>
        <meta
          name="description"
          content="Test application to analyze data sets"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Home page</h1>
        <p>Test application to analyze data sets</p>
        <Button>CLICK</Button>
      </main>
    </>
  );
}
