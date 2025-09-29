import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { ensureAnonSignIn } from "../lib/auth";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => { ensureAnonSignIn().then(() => setReady(true)).catch(() => setReady(true)); }, []);
  if (!ready) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  return <Component {...pageProps} />;
}