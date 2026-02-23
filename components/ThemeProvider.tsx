import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme
  useEffect(() => {
    try {
      // Check if we're in browser environment
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const savedTheme = localStorage.getItem("bartz_theme") as Theme;
        if (savedTheme === "light" || savedTheme === "dark") {
          setTheme(savedTheme);
        }
      }
      
      // Mark as loaded
      setIsLoading(false);
    } catch (error) {
      console.warn("Failed to load theme from localStorage:", error);
      setIsLoading(false);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isLoading) return;
    
    try {
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        
        // Remove existing theme classes
        root.classList.remove("light", "dark");
        
        // Add current theme class
        root.classList.add(theme);
        
        // Save to localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem("bartz_theme", theme);
        }
      }
    } catch (error) {
      console.warn("Failed to apply theme:", error);
    }
  }, [theme, isLoading]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  // Provide fallback if context is not available
  if (context === undefined) {
    console.warn("useTheme called outside of ThemeProvider, using fallback");
    return {
      theme: "light",
      setTheme: () => {},
      toggleTheme: () => {},
      isLoading: false,
    };
  }
  
  return context;
}

// Hook that safely gets theme without throwing error
export function useThemeSafe(): ThemeContextType | null {
  try {
    return useContext(ThemeContext) || null;
  } catch (error) {
    console.warn("Error accessing theme context:", error);
    return null;
  }
}
