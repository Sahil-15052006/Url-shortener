import Landing from "./pages/Landing";
import Shorten from "./pages/Shorten";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useTheme } from "./hooks/useTheme";
import { Element } from "react-scroll";

export default function App() {
  const { dark, toggle } = useTheme();

  return (
    <div id="top" className="flex min-h-screen flex-col bg-white font-sans text-black dark:bg-black dark:text-white">
      <Navbar dark={dark} onToggle={toggle} />
      <main className="flex-1 bg-neutral-50 dark:bg-neutral-950">
        <Element name="home">
          <Landing />
        </Element>
        <Element name="shorten">
          <Shorten />
        </Element>
      </main>
      <Footer />
    </div>
  );
}
