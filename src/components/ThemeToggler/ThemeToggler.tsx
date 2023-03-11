import { RubberCheckbox } from '../RubberCheckbox/RubberCheckbox';
import { CheckBoxWrapper, SunOrMoonWrapper } from './ThemeToggler.styled';

import type themeMap from '../../theme';
import Image from 'next/image';

function ThemeToggler({
  theme,
  setTheme,
}: {
  theme: keyof typeof themeMap;
  setTheme: (newTheme: keyof typeof themeMap) => void;
}) {
  console.log(theme);
  return (
    <CheckBoxWrapper>
      <RubberCheckbox
        checked={theme === 'light'}
        onChange={(event) => {
          setTheme(themeSwitcher(event.currentTarget.checked));
          console.log(event.currentTarget.checked);
          console.log(theme);
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
