import { useEffect, useState } from "react";

export function useTheme() {
  const [dark, setDark] = useState(() =>
    typeof window === "undefined"
      ? false
      : (localStorage.getItem("theme") ?? "light") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}
