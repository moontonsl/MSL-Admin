// Components/ThemeToggleButton.tsx
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggleButton = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return (
        <button
            className="theme-button cursor-pointer"
            onClick={toggleTheme}
        >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default ThemeToggleButton;
