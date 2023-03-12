import Head from 'next/head';
// import Image from 'next/image'
import themeMap from '@/theme';
import HomeWrapper from '@/components/Home';

export default function Home({
  theme,
  setTheme,
}: {
  theme: keyof typeof themeMap;
  setTheme: (newTheme: keyof typeof themeMap) => void;
}) {
  return (
    <>
      <Head>
        <title>Data analyzer</title>
        <meta
          name="description"
          content="Test application to analyze data sets"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HomeWrapper theme={theme} setTheme={setTheme} />
      </main>
    </>
  );
}
