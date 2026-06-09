import React, { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => {},
});

export function AppThemeProvider({ children }) {
  const [theme, setThemeState] = useState('system');

  function setTheme(value) {
    setThemeState(value);
    Appearance.setColorScheme(value === 'system' ? null : value);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemePreference() {
  return useContext(ThemeContext);
}
