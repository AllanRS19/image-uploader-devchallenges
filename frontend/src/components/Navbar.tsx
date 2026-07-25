import { useTheme } from "../providers/use-theme";
import { Button } from "./ui/button";

const Navbar = () => {

    const { theme, toggleTheme } = useTheme();

    const isLight = theme === 'light';

    return (
        <header className="header">
            <nav className="navbar">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo-icon.svg"
                        alt="Logo"
                        width={28}
                        height={28}
                    />
                    <h1 className="font-bold text-black dark:text-white">ImageUpload</h1>
                </div>

                <Button
                    variant="toggler"
                    size="toggler"
                    theme={theme}
                    onClick={toggleTheme}
                >
                    <img
                        src={isLight ? "/moon.svg" : "/sun.svg"}
                        alt={isLight ? "Moon" : "Sun"}
                        width={22}
                        height={22}
                    />
                </Button>
            </nav>
        </header>
    )
}

export default Navbar;