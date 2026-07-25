import { createContext, useContext, useEffect, useState } from "react";

type Theme = 'light' | 'dark'

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = 'theme';

const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "light";

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === "dark") return stored;

    return "light"; // spec requires light mode as default — ignore system preference
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const setTheme = (newTheme: Theme) => setThemeState(newTheme);

    const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                setTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}