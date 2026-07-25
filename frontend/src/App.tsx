import { Toaster } from "sileo";
import ImageDropzone from "./components/ImageDropzone";
import Navbar from "./components/Navbar";
import { useTheme } from "./providers/use-theme";

const App = () => {

    const { theme } = useTheme();

    return (
        <div className="w-full h-screen flex flex-col">
            <Navbar />

            <main className="main-content-wrapper">
                {/* TODO: React Drop Zone */}
                <ImageDropzone />
            </main>

            <Toaster
                position='top-center'
                theme={theme}
                options={{
                    duration: 5000,
                    styles: {
                        description: theme === "dark" ? "text-black!" : ""
                    }
                }}
            />
        </div>
    )
}

export default App;