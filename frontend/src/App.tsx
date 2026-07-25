import ImageDropzone from "./components/ImageDropzone";
import Navbar from "./components/Navbar";

const App = () => {
    return (
        <div className="w-full h-screen flex flex-col">
            <Navbar />

            <main className="main-content-wrapper">
                {/* TODO: React Drop Zone */}
                <ImageDropzone />
            </main>
        </div>
    )
}

export default App;