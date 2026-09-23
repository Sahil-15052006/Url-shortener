const GITHUB_URL = "https://github.com/Sahil-15052006/Url-shortener";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-neutral-500 sm:flex-row dark:text-neutral-400">
        <p>Short.ly — a minimal URL shortener.</p>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="font-medium text-black underline-offset-4 hover:underline dark:text-white">
          View on GitHub
        </a>
      </div>
    </footer>
  );
}
