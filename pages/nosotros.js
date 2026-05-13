import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Nosotros() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <>
            <Head>
                <title>Sobre Soledad Accesorios | Mayorista de Accesorios para el Pelo</title>
            </Head>

            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50/30" />
            
            <div className={`min-h-screen py-12 sm:py-16 md:py-20 transform transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12 sm:mb-16">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Sobre Nosotros
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
                    </div>

                    {/* Content Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 md:p-12 lg:p-16 border border-gray-100">
                        <div className="prose prose-lg max-w-none">
                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-8">
                                    Desde 1966, Soledad | Accesorios se dedica a la selección y comercialización mayorista de accesorios que combinan calidad, diseño y elegancia.
                                </p>

                                <p className="text-base sm:text-lg">
                                    Con más de seis décadas de trayectoria, trabajamos junto a clientes de primera línea, ofreciendo productos cuidadosamente elegidos y con especial atención a la terminación de cada pieza.
                                </p>

                                <p className="text-base sm:text-lg">
                                    Nuestras colecciones están pensadas para acompañar cada temporada, combinando tendencias actuales con la sofisticación de lo clásico.
                                </p>

                                <p className="text-base sm:text-lg">
                                    En Soledad | Accesorios, creemos que los accesorios son un elemento esencial para expresar estilo y personalidad. Por eso, ofrecemos piezas que se distinguen por su belleza, calidad y carácter atemporal.
                                </p>
                            </div>

                            {/* Decorative Element */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <p className="text-center text-gray-600 italic">
                                Soledad | Accesorios - Estilo y calidad desde 1966
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-600">
                            ¿Querés conocer más sobre nuestros productos?{' '}
                            <a href="/accesorios-para-el-pelo" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Visitá nuestro catálogo
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
