import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LanguageProvider } from "@/pages/components/LanguageContext";
import { ThemeProvider } from "@/pages/components/ThemeContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </LanguageProvider>
  );
}
