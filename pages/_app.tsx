import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LanguageProvider } from "@/components/LanguageContext";
import { ThemeProvider } from "@/components/ThemeContext";
import { ToastProvider } from "@/components/ToastContext";
import Toast from "@/components/Toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ToastProvider>
          <Component {...pageProps} />
          <Toast />
        </ToastProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
