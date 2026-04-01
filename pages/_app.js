import Header from "@/components/Header";
import { CartContextProvider } from "@/lib/CartContext";
import { PriceVisibilityProvider } from "@/lib/PriceVisibilityContext";
import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppinsFont = Poppins({ subsets: ["latin"], weight: '400' });

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return <>
    <Head>
      <link rel="icon" href="https://res.cloudinary.com/djuk4a84p/image/upload/v1772474170/favicon_n1ymv4.png" />
      <meta name="description" content="Accesorios para el cabello con amplio stock. Catálogo mayorista online para comercios y revendedores. Envíos a todo el país." />
    </Head>
    <SessionProvider session={session}>
      <PriceVisibilityProvider>
        <CartContextProvider>
          <main className={`${poppinsFont.className} min-h-screen max-w-screen-2xl mx-auto px-4 bg-background text-accent`}>
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
  </>
}
