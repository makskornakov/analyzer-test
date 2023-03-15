import { RubberCheckbox } from 'rubber-checkbox';
import { CheckBoxWrapper, SunOrMoonWrapper } from './ThemeToggler.styled';

import Image from 'next/image';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import themeMap from '@/theme';

function ThemeToggler({
  theme,
  setTheme,
}: {
  theme: keyof typeof themeMap;
  setTheme: (newTheme: keyof typeof themeMap) => void;
}) {
  // on window reload check if checkbox is checked and set theme to light
  // useEffect(() => {
  //   if (windowRef.current) {
  //     windowRef.current.addEventListener('load', () => {
  //       if (checkBoxRef.current) {
  //         if (checkBoxRef.current.checked) {
  //           setTheme('light');
  //         }
  //       }
  //     });
  //   }
  // }, []);

  return (
    <CheckBoxWrapper>
      <RubberCheckbox
        checked={theme === 'light'}
        onChange={(event) => {
          // if (event.currentTarget.checked) {
          //   setTheme('light');
          // } else {
          //   setTheme('dark');
          // }
          setTheme(themeSwitcher(event.currentTarget.checked));
          console.log(event.currentTarget.checked);
          // console.log(theme);
        }}
        colors={{
          innerBorderOn: themeMap.light.colors.background,
        }}
      />
      <SunOrMoonWrapper>
        <Image
          src="/icons/moon.svg"
          alt="moon"
          width={30}
          height={30}
          style={theme.includes('dark') ? { opacity: 1 } : { opacity: 0 }}
        />

        <Image
          src="/icons/sun.svg"
          alt="sun"
          width={30}
          height={30}
          style={theme.includes('dark') ? { opacity: 0 } : { opacity: 1 }}
        />
      </SunOrMoonWrapper>
    </CheckBoxWrapper>
  );
}

export default ThemeToggler;
// set return type of the function

export function themeSwitcher(
  // theme: string,
  checked: boolean
) {
  // return (checked ? 'light' : 'dark') as keyof typeof themeMap;
  // return theme === 'dark' ? 'light' : 'dark';
  return checked ? 'light' : 'dark';
}
