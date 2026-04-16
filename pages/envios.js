import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function Envios() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const SectionTitle = ({ children }) => (
    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">
      {children}
    </h2>
  );

  return (
    <>
      <Head>
        <title>Envíos | Accesorios para el Pelo por Mayor en Argentina</title>
      </Head>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-white to-red-50/20" />

      <div className={`min-h-screen py-10 sm:py-16 lg:py-20 transform transition-all duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}>
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full mb-5 sm:mb-6">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              🚚 Envíos
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Todo lo que necesitás saber sobre nuestros envíos
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mt-6 rounded-full" />
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 lg:p-10 border border-gray-100">

            <section className="mb-8">
              <SectionTitle>1. Costos de envío</SectionTitle>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-2">
                Envío sin cargo dentro de CABA.
              </p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Al resto del país, el envío es gratuito en compras superiores a $600.000.
              </p>
            </section>

            <div className="border-t border-gray-200 my-6 sm:my-8" />

            <section className="mb-8">
              <SectionTitle>2. Procesamiento y despacho</SectionTitle>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-2">
                Una vez acreditado el pago, el pedido será despachado dentro de las 72 horas hábiles, a través del transporte seleccionado por el cliente.
              </p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                El envío viaja bajo responsabilidad del comprador.
              </p>
            </section>

            <div className="border-t border-gray-200 my-6 sm:my-8" />

            <section>
              <SectionTitle>3. Seguimiento del pedido</SectionTitle>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Podrás realizar el seguimiento de tu pedido, en todo momento desde tu cuenta o desde{" "}
                <a href="/account" className="text-red-600 hover:text-red-700 font-semibold underline">
                  este enlace
                </a>
                .
              </p>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}
