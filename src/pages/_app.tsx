import { GlobalStyles } from '@/styles/main.styled';
import { useLocalStorage } from 'usehooks-ts';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import themeMap from '@/theme';
import { useEffect, useState } from 'react';
import { MetaThemeColorWithTransition } from '@/components/MetaThemeColorWithTransition';

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<keyof typeof themeMap>(
    Object.keys(themeMap)[0] as keyof typeof themeMap,
  );

  const [themeFromLocalStorage, setThemeFromLocalStorage] = useLocalStorage<keyof typeof themeMap>(
    'theme',
    Object.keys(themeMap)[0] as keyof typeof themeMap,
  );

  useEffect(() => {
    if (themeFromLocalStorage) {
      console.log('themeFromLocalStorage');
      setTheme(themeFromLocalStorage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setThemeFromLocalStorage(theme);
  }, [setThemeFromLocalStorage, theme]);

  return (
    <>
      <ThemeProvider theme={themeMap[theme]}>
        <GlobalStyles theme={theme}></GlobalStyles>
        <Component {...pageProps} theme={theme} setTheme={setTheme} />
      </ThemeProvider>
      <MetaThemeColorWithTransition
        colors={[themeMap.light.colors.background, themeMap.dark.colors.background]}
        trigger={themeFromLocalStorage === 'dark'}
        transitionDuration={400 / 2}
      />
    </>
  );
}
