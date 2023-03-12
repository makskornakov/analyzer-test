import gradient from 'gradient-color';
import { useEffect, useMemo, useState } from 'react';

/**
 * @todo 1. Decide whether it should use https://npm.im/rainbowvis.js, or any other library, better with TS support included. 2. Publish to NPM.
 *
 * @example
 * const metaThemeColor = useSetMetaThemeColorWithTransition(['#000', '#0ff'], isCheckboxOn, 1500);
 *
 * // Usage with CRA:
 * useSetMetaThemeColor(metaThemeColor) // a custom hook that simply sets `document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]').content`, wrapped in an effect, returning a function that puts the initial theme color back where it was.
 *
 * // Usage with Next.JS:
 * import Head from 'next/head';
 * ...
 * <Head>
 *   <meta name="theme-color" content={metaThemeColor} />
 * </Head>
 */
export function useSetMetaThemeColorWithTransition(
  colors: Parameters<typeof gradient>[0],
  /** A boolean value that triggers the transition. */
  trigger: boolean,
  transitionDuration: number,
  /** Color gradient steps. Default is `transitionDuration / 30`. Constrained by a minimum of `colors.length` */
  transitionResolution = transitionDuration / 30,
) {
  const metaThemeColorAnimationInterval = transitionDuration / transitionResolution;

  const fromBackgroundToAccent = useMemo(() => {
    try {
      return gradient(colors, transitionResolution);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'The number of generated colors should >= the number of color stops'
      ) {
        return colors;
      }
      throw error;
    }
  }, [colors, transitionResolution]);
  const fromAccentToBackground = useMemo(
    () => [...fromBackgroundToAccent].reverse(),
    [fromBackgroundToAccent],
  );

  const [metaThemeColor, setMetaThemeColor] = useState<string>(colors[Number(trigger)]);

  const [isFirstRun, setIsFirstRun] = useState(true);

  useEffect(() => {
    if (isFirstRun) {
      // Prevents the transition from firing until trigger is actually changed, not just initialized.
      setIsFirstRun(false);
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    const colorGradient = trigger ? fromBackgroundToAccent : fromAccentToBackground;
    colorGradient.forEach((color, colorIndex) => {
      timeouts.push(
        setTimeout(() => {
          setMetaThemeColor(color);
        }, colorIndex * metaThemeColorAnimationInterval),
      );
    });

    return () => {
      timeouts.map(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return metaThemeColor;
}
