import "@/styles/globals.css";
import { AuthProvider } from "@/hooks/AuthContext";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
