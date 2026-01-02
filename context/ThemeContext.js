// context/ThemeContext.js

import React, { createContext, useState, useEffect } from "react";
import { Appearance } from "react-native";

export const ThemeContext = createContext();

const lightTheme = {
  background: "#ffffff",
  bgless: "#f8f9fa",
  text: "#000000",
};

const darkTheme = {
  background: "#121212",
  bgless: "#2a2929",
  text: "#ffffff",
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const changeTheme = () => {
    setTheme((p) => (p == "dark" ? "light" : "dark"));
  };

  const themeStyles = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeStyles, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
