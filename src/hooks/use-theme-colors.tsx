
import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function useThemeColors() {
  const { theme, setTheme } = useTheme();

  // Update the background color to a gray shade in dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--background', '240 10% 3.9%');
      document.documentElement.style.setProperty('--foreground', '0 0% 98%');
    } else {
      // Use default values for light mode
      document.documentElement.style.removeProperty('--background');
      document.documentElement.style.removeProperty('--foreground');
    }
  }, [theme]);

  return { theme, setTheme };
}
