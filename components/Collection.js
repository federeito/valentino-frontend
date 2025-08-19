import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from './Footer';

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Collection({ product }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    if (product) {
        return <>
            <section className="relative overflow-hidden">
                {/* Animated background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="max-w-screen-2xl px-4 py-8 mx-auto sm:py-12 lg:px-8">
                    <header className={`text-center transform transition-all duration-1000 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent sm:text-3xl">
                            Nueva Colección
                        </h2>
                        <p className="max-w-lg mx-auto mt-4 text-gray-600">
                            Descubre nuestra última colección de productos exclusivos, y mejora tu estilo.
                        </p>
                    </header>

                    <div className="max-w-screen-2xl px-4 py-8 mx-auto sm:py-12 lg:px-8">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
                            <div className={`group relative p-6 backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-200 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 transform ${
                                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                            }`}>
                                <div className="max-w-md mx-auto text-center lg:text-left">
                                    <header>
                                        <h2 className="text-xl font-bold text-gray-800 sm:text-3xl group-hover:text-primary transition-colors">
                                            {product.Título}
                                        </h2>
                                        <p className="mt-4 text-gray-600">
                                            {product.Descripción}
                                        </p>
                                        <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-accent to-orange-500 text-white px-6 py-2 rounded-full font-bold">
                                            <span className="animate-pulse">💫</span>
                                            <span>$ {formatPrice(product.Precio)} c/u</span>
                                        </div>
                                    </header>

                                    <Link href={'/products'} 
                                        className="mt-8 inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-white px-8 py-3 
                                        text-md font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-white
                                        hover:shadow-lg hover:shadow-primary/30 active:scale-95">
                                        Comprar Todo
                                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            <div className={`lg:col-span-2 lg:py-8 transform transition-all duration-1000 delay-300 ${
                                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                            }`}>
                                <ul className="grid grid-cols-2 gap-4">
                                    {product.Imagenes.slice(0, 2).map((imagen, index) => (
                                        <li key={index}>
                                            <div className="relative group overflow-hidden rounded-2xl">
                                                <img 
                                                    src={imagen} 
                                                    alt={`product-${index}`} 
                                                    className="object-cover w-full aspect-square transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </>;
    }
    return null;
}