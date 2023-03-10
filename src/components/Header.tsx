import ThemeToggler from './ThemeToggler/ThemeToggler';
import themeMap from '@/theme';

export default function HeaderWrapper({
  theme,
  setTheme,
}: {
  theme: keyof typeof themeMap;
  setTheme: (newTheme: keyof typeof themeMap) => void;
}) {
  return (
    <header>
      <h1>Header</h1>
      <ThemeToggler theme={theme} setTheme={setTheme} />
    </header>
  );
}
