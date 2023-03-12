import { GlobalStyles } from '@/styles/main.styled';
import { useLocalStorage } from 'usehooks-ts';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import themeMap from '@/theme';
import { useEffect, useLayoutEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<keyof typeof themeMap>(
    Object.keys(themeMap)[0] as keyof typeof themeMap
  );

  const [themeFromLocalStorage, setThemeFromLocalStorage] = useLocalStorage<
    keyof typeof themeMap
  >('theme', Object.keys(themeMap)[0] as keyof typeof themeMap);

  useLayoutEffect(() => {
    if (themeFromLocalStorage) {
      console.log(themeFromLocalStorage);
      console.log('themeFromLocalStorage');
      setTheme(themeFromLocalStorage);
    } else {
      setThemeFromLocalStorage(theme);
      console.log('theme');
      console.log(themeFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    setThemeFromLocalStorage(theme);
  }, [setThemeFromLocalStorage, theme]);

  // useSetMetaThemeColor(themeMap[theme].colors.gray.a);

  return (
    <>
      <ThemeProvider theme={themeMap[theme]}>
        <GlobalStyles theme={theme}></GlobalStyles>
        <Component {...pageProps} theme={theme} setTheme={setTheme} />
      </ThemeProvider>
    </>
  );
}
export function useSetMetaThemeColor(content: string) {
  useEffect(() => {
    const meta = document.head.querySelector('meta[name=theme-color]');
    const body = document.body;
    // console.log(meta);
    if (meta) {
      meta.setAttribute('content', content);
    }
    if (body) {
      body.style.backgroundColor = content;
    }

    return () => {};
  }, [content]);
}
