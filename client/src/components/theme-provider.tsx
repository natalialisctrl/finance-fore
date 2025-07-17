import { createContext, useContext, useEffect } from "react";

type ThemeProviderContextType = {
  theme: "dark";
  isDark: true;
};

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force dark mode permanently
    const root = window.document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    // Clear any theme from localStorage
    localStorage.removeItem("theme");
  }, []);

  const value = {
    theme: "dark" as const,
    isDark: true as const,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
