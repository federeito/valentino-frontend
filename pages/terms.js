import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function Terms() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const SectionTitle = ({ number, children }) => (
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 flex items-start gap-2">
            <span className="text-red-500 shrink-0">{number}.</span>
            <span>{children}</span>
        </h2>
    );

    const BulletList = ({ items }) => (
        <ul className="space-y-2 ml-4 sm:ml-6">
            {items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-500 mt-1 shrink-0">•</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );

    return (
        <>
            <Head>
                <title>Términos y Condiciones | Valentino Accesorios</title>
            </Head>
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-white to-red-50/20" />
            
            <div className={`min-h-screen py-10 sm:py-16 lg:py-20 transform transition-all duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-10 sm:mb-12">
                        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full mb-5 sm:mb-6">
                            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            📄 Términos y Condiciones
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600">
                            Última actualización: 01/02/2026
                        </p>
                        <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mt-6 rounded-full" />
                    </div>

                    {/* Content Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 lg:p-10 border border-gray-100">
                        {/* Introduction */}
                        <div className="mb-8">
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                El uso del sitio web <span className="font-semibold text-red-600">Valentino Paris</span> implica la aceptación de los siguientes términos y condiciones.
                            </p>
                        </div>

                        <section className="mb-8">
                            <SectionTitle number="1">Uso del sitio</SectionTitle>
                            <p className="text-gray-700 text-sm sm:text-base">
                                El usuario se compromete a utilizar el sitio de manera legal y adecuada, sin realizar actividades que puedan dañar la plataforma o a terceros.
                            </p>
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="2">Registro de cuenta</SectionTitle>
                            <p className="text-gray-700 mb-3 text-sm sm:text-base">
                                Para acceder a ciertos contenidos (como precios mayoristas), es necesario:
                            </p>
                            <BulletList items={['Crear una cuenta', 'Iniciar sesión con Google o Facebook']} />
                            <p className="text-gray-700 font-semibold mt-3 text-sm sm:text-base">
                                El usuario es responsable de mantener la confidencialidad de sus credenciales.
                            </p>
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="3">Precios y disponibilidad</SectionTitle>
                            <BulletList items={[
                                'Los precios pueden modificarse sin previo aviso',
                                'Algunos precios pueden estar disponibles solo para usuarios registrados',
                                'La disponibilidad de productos puede variar'
                            ]} />
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="4">Compras</SectionTitle>
                            <p className="text-gray-700 mb-3 text-sm sm:text-base">Al realizar una compra, el usuario acepta:</p>
                            <BulletList items={[
                                'Proporcionar información veraz',
                                'Abonar el importe correspondiente',
                                'Respetar las condiciones de envío y devolución'
                            ]} />
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="5">Propiedad intelectual</SectionTitle>
                            <p className="text-gray-700 text-sm sm:text-base">
                                Todo el contenido del sitio (imágenes, textos, logos, diseños) es propiedad de{' '}
                                <span className="font-semibold text-red-600">Valentino Paris</span> y no puede ser utilizado sin autorización.
                            </p>
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="6">Responsabilidad</SectionTitle>
                            <p className="text-gray-700 mb-3 text-sm sm:text-base">No nos responsabilizamos por:</p>
                            <BulletList items={[
                                'Interrupciones del servicio',
                                'Errores técnicos',
                                'Daños derivados del uso del sitio'
                            ]} />
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="7">Cancelaciones y devoluciones</SectionTitle>
                            <p className="text-gray-700 text-sm sm:text-base">
                                Las políticas de cambios, cancelaciones o devoluciones se informarán en cada compra o sección correspondiente.
                            </p>
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="8">Modificaciones</SectionTitle>
                            <p className="text-gray-700 text-sm sm:text-base">
                                Nos reservamos el derecho de modificar estos términos en cualquier momento.
                            </p>
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="9">Legislación aplicable</SectionTitle>
                            <p className="text-gray-700 text-sm sm:text-base">
                                Estos términos se rigen por las leyes de <span className="font-semibold">Argentina</span>.
                            </p>
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section>
                            <SectionTitle number="10">Contacto</SectionTitle>
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span>📧</span>
                                    <a href="mailto:contacto@valentinoaccesorios.com.ar" className="text-red-600 hover:text-red-700 font-semibold underline break-all text-sm sm:text-lg">
                                        contacto@valentinoaccesorios.com.ar
                                    </a>
                                </div>
                            </div>
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
