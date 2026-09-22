import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type ShortenResult = {
  code: string;
  short_url: string;
  original_url: string;
  expires_at: string;
};

export default function Shorten() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);
    try {
      const res = await fetch(`${API_BASE}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? `Request failed (${res.status})`);
      }
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    const full = `${window.location.origin}${result.short_url}`;
    await navigator.clipboard.writeText(full).catch(() => {});
    setCopied(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 min-h-screen">
      <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
        Shorten your URL
      </h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">
        Enter a full <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">https://</code> link below.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          required
          placeholder="https://example.com/very/long/link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {loading ? "Shortening…" : "Shorten"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-md border border-neutral-300 bg-neutral-100 px-4 py-3 text-sm text-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Your short link
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <a
              href={result.short_url}
              className="truncate text-lg font-bold text-black underline-offset-4 hover:underline dark:text-white"
            >
              {window.location.origin}{result.short_url}
            </a>
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <dl className="mt-4 space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
            <div className="flex gap-2">
              <dt className="font-medium">Code:</dt>
              <dd className="truncate">{result.code}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium">Original:</dt>
              <dd className="truncate">{result.original_url}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium">Expires:</dt>
              <dd>{new Date(result.expires_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
