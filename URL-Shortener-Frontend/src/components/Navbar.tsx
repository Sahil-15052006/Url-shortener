import { Link } from "react-scroll";

const GITHUB_URL = "https://github.com/sahilsachdev/URL-Shortener";

export default function Navbar({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const btn =
    "cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-black dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          to="top"
          smooth
          duration={500}
          className="cursor-pointer font-sans text-lg font-bold tracking-tight text-black dark:text-white"
        >
          Short<span className="text-neutral-500 dark:text-neutral-400">.ly</span>
        </Link>
        <nav className="flex items-center gap-1 font-sans">
          <Link to="home" smooth duration={500} offset={-64} className={btn}>
            Home
          </Link>
          <Link to="shorten" smooth duration={500} offset={-64} className={btn}>
            Shorten URL
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-2 font-sans text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-black dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            GitHub
          </a>
          <button
            onClick={onToggle}
            aria-label="Toggle theme"
            className="ml-2 rounded-md border border-neutral-300 px-3 py-1.5 font-sans text-sm font-medium text-black transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          >
            {dark ? "Light" : "Dark"}
          </button>
        </nav>
      </div>
    </header>
  );
}
