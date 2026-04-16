import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function Privacy() {
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
                <title>Política de Privacidad | Valentino Accesorios</title>
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            📄 Política de Privacidad
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
                                En <span className="font-semibold text-red-600">Valentino Paris</span> valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política describe qué información recopilamos, cómo la utilizamos y qué derechos tenés como usuario.
                            </p>
                        </div>

                        <section className="mb-8">
                            <SectionTitle number="1">Información que recopilamos</SectionTitle>
                            <p className="text-gray-700 mb-3 text-sm sm:text-base">Podemos recopilar:</p>
                            <BulletList items={['Nombre y apellido', 'Dirección de correo electrónico', 'Información básica de perfil (cuando iniciás sesión con Google o Facebook)', 'Datos de pedidos y compras', 'Dirección de envío y facturación', 'Información técnica (IP, navegador, dispositivo, cookies)']} />
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="2">Cómo obtenemos los datos</SectionTitle>
                            <p className="text-gray-700 mb-3 text-sm sm:text-base">Los datos se obtienen cuando:</p>
                            <BulletList items={['Creás una cuenta', 'Iniciás sesión con proveedores externos (Google o Facebook)', 'Realizás una compra', 'Completás formularios de contacto', 'Navegás por nuestro sitio']} />
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="3">Uso de la información</SectionTitle>
                            <p className="text-gray-700 mb-3 text-sm sm:text-base">Utilizamos la información para:</p>
                            <BulletList items={['Gestionar tu cuenta', 'Procesar pedidos y pagos', 'Mostrar precios y contenidos personalizados', 'Brindar soporte al cliente', 'Mejorar nuestros servicios', 'Cumplir obligaciones legales']} />
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="4">Inicio de sesión con terceros</SectionTitle>
                            <p className="text-gray-700 mb-3 text-sm sm:text-base">Podés registrarte o iniciar sesión mediante:</p>
                            <div className="flex flex-wrap gap-3 mb-4 ml-2 sm:ml-6">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-gray-700 font-medium text-sm sm:text-base">
                                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Google
                                </span>
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] rounded-lg text-white font-medium text-sm sm:text-base">
                                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    Facebook
                                </span>
                            </div>
                            <p className="text-gray-700 text-sm sm:text-base">
                                Solo accedemos a información básica del perfil (nombre, email e imagen). <span className="font-semibold">No publicamos contenido ni accedemos a información privada adicional.</span>
                            </p>
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="5">Compartición de datos</SectionTitle>
                            <p className="text-gray-700 mb-3 font-semibold text-sm sm:text-base">No vendemos ni comercializamos tus datos personales.</p>
                            <p className="text-gray-700 mb-2 text-sm sm:text-base">Podemos compartir información únicamente con:</p>
                            <BulletList items={['Proveedores de pago', 'Servicios de hosting', 'Servicios logísticos', 'Obligaciones legales']} />
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="6">Seguridad</SectionTitle>
                            <p className="text-gray-700 text-sm sm:text-base">
                                Aplicamos medidas técnicas y organizativas para proteger tus datos contra accesos no autorizados.
                            </p>
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="7">Cookies</SectionTitle>
                            <p className="text-gray-700 mb-3 text-sm sm:text-base">Utilizamos cookies para:</p>
                            <BulletList items={['Mantener sesiones activas', 'Recordar preferencias', 'Analizar tráfico del sitio']} />
                            <p className="text-gray-700 mt-3 text-sm sm:text-base">
                                Podés deshabilitarlas desde tu navegador.
                            </p>
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="8">Derechos del usuario</SectionTitle>
                            <p className="text-gray-700 mb-3 text-sm sm:text-base">Podés:</p>
                            <BulletList items={['Solicitar acceso a tus datos', 'Modificar información', 'Solicitar eliminación de tu cuenta', 'Retirar tu consentimiento']} />
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mt-4">
                                <p className="text-gray-700 text-sm sm:text-base">
                                    <span className="font-semibold">Contactanos a:</span>{' '}
                                    <a href="mailto:contacto@valentinoaccesorios.com.ar" className="text-red-600 hover:text-red-700 font-medium underline break-all">
                                        contacto@valentinoaccesorios.com.ar
                                    </a>
                                </p>
                            </div>
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section className="mb-8">
                            <SectionTitle number="9">Cambios en esta política</SectionTitle>
                            <p className="text-gray-700 text-sm sm:text-base">
                                Podemos actualizar esta política. Publicaremos cualquier cambio en esta página.
                            </p>
                        </section>

                        <div className="border-t border-gray-200 my-6 sm:my-8" />

                        <section>
                            <SectionTitle number="10">Contacto</SectionTitle>
                            <p className="text-gray-700 mb-3 text-sm sm:text-base">Si tenés consultas sobre privacidad:</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span>📧</span>
                                <a href="mailto:contacto@valentinoaccesorios.com.ar" className="text-red-600 hover:text-red-700 font-semibold underline break-all text-sm sm:text-lg">
                                    contacto@valentinoaccesorios.com.ar
                                </a>
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
