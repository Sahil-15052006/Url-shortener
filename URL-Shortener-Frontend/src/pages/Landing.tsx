import { Link } from "react-scroll";

export default function Landing() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 font-sans min-h-screen">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 inline-block rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
          Fast · Minimal · Free
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl dark:text-white">
          Shorten long URLs in seconds
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
          Paste any link, get a compact short code, and share it anywhere.
          Redirects are instant and every click is counted.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="shorten"
            smooth
            duration={500}
            offset={-64}
            className="cursor-pointer rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
          >
            Shorten a URL
          </Link>
          <a
            href="https://github.com/sahilsachdev/URL-Shortener"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          >
            GitHub repo
          </a>
        </div>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Paste", body: "Submit any https URL through a single API call." },
          { title: "Share", body: "Get a 7-character code that redirects with a 307." },
          { title: "Track", body: "Clicks and expiry are stored alongside each link." },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <h2 className="text-base font-bold text-black dark:text-white">{f.title}</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
