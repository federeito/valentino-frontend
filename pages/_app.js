import Header from "@/components/Header";
import { CartContextProvider } from "@/lib/CartContext";
import { PriceVisibilityProvider } from "@/lib/PriceVisibilityContext";
import "@/styles/globals.css";
import { Poppins, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const poppinsFont = Poppins({ subsets: ["latin"], weight: '400' });
const cormorantFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return <>
    <Head>
      <link rel="icon" href="https://res.cloudinary.com/djuk4a84p/image/upload/v1778690764/faviconsole_mnkhpp.png" />
      <meta name="description" content="Accesorios para el pelo con amplio stock. Catálogo mayorista online para comercios y revendedores. Envíos a todo el país." />
    </Head>
    <SessionProvider session={session}>
      <PriceVisibilityProvider>
        <CartContextProvider>
          <main className={`${poppinsFont.className} ${cormorantFont.variable} min-h-screen max-w-screen-2xl mx-auto px-4 bg-background text-accent`}>
            <Header />
            <Component {...pageProps} />
            <Toaster
              position="top-center"
              reverseOrder={false}
            />
          </main>
        </CartContextProvider>
      </PriceVisibilityProvider>
    </SessionProvider>
    <SpeedInsights />
    <Analytics />
  </>
}
