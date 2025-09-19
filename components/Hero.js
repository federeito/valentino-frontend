import { CartContext } from "@/lib/CartContext";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Hero({ product, secondProduct }) {
    const { addProduct } = useContext(CartContext);
    const [isVisible, setIsVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        
        // Cambio automático de imágenes para ambos productos
        const interval = setInterval(() => {
            const totalImages = (product?.Imagenes?.length || 0) + (secondProduct?.Imagenes?.length || 0);
            if (totalImages > 1) {
                setCurrentImageIndex((prev) => 
                    (prev + 1) % totalImages
                );
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [product, secondProduct]);

    function addItemToCart() {
        addProduct(product._id);
        toast.success('¡Producto añadido al carrito!', {
            style: {
                background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 'bold'
            }
        });
    }

    if (product) {
        return (
            <>
                {/* Animated background elements - Pastel colors */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/40 to-rose-200/40 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-lavender-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                <div className="relative overflow-hidden my-8 md:my-14 bg-gradient-to-br from-pink-50/50 to-blue-50/50">
                    <div className="lg:py-40 min-h-[500px] lg:min-h-[650px] relative">
                        {/* Grid pattern overlay */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                        
                        <div className="relative mx-auto sm:static px-4 sm:px-6 lg:px-8">
                            <div className={`sm:max-w-xl text-center sm:text-start transform transition-all duration-1000 ${
                                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                            }`}>
                                {/* Discount badge - Red for brand consistency */}
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-base sm:text-lg mb-4 sm:mb-6 shadow-lg shadow-red-500/30 animate-bounce">
                                    <span className="animate-pulse">🔥</span>
                                    <span className="hidden sm:inline">Al</span> 50% Off
                                    <span className="animate-pulse">✨</span>
                                </div>

                                {/* Título - Pastel gradient */}
                                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight my-3 bg-gradient-to-r from-slate-700 via-gray-800 to-slate-700 bg-clip-text text-transparent transform transition-all duration-1000 delay-300 ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                                }`}>
                                    {product.Título}
                                </h1>

                                {/* Descripción */}
                                <div className={`relative transform transition-all duration-1000 delay-500 ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                                }`}>
                                    <p className="line-clamp-3 text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 relative z-10 px-4 sm:px-0">
                                        {product.Descripción}
                                    </p>
                                    <div className="absolute bottom-0 left-1/2 sm:left-0 w-20 h-1 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full transform -translate-x-1/2 sm:translate-x-0" />
                                </div>

                                {/* Botones - Red primary, pastel secondary */}
                                <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 sm:mt-10 items-stretch sm:items-center transform transition-all duration-1000 delay-700 ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                                }`}>
                                    <button 
                                        type="button" 
                                        className="group relative overflow-hidden rounded-xl border-2 border-red-500 bg-gradient-to-r from-red-500 to-red-600 px-8 py-4 text-center text-lg font-bold text-white shadow-2xl shadow-red-500/25 transition-all duration-300 hover:shadow-3xl hover:shadow-red-500/40 hover:scale-105 active:scale-95"
                                        onClick={addItemToCart}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="24" 
                                                height="24" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                strokeWidth="2" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                className="w-5 h-5 transition-transform group-hover:rotate-12"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" />
                                                <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
                                            </svg>
                                            Añadir al Carrito
                                        </span>
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    </button>

                                    <Link 
                                        href={'/products'} 
                                        className="group relative rounded-xl border-2 border-blue-200 bg-white/90 backdrop-blur-sm px-8 py-4 text-center text-lg font-bold text-gray-700 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-200/30 hover:scale-105 hover:bg-blue-50/50 active:scale-95"
                                    >
                                        <span className="flex items-center gap-2">
                                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m0 0l4-4m-4 4l4 4" />
                                            </svg>
                                            Todos los Productos
                                        </span>
                                    </Link>
                                </div>

                                {/* Features - Pastel colors */}
                                <div className={`hidden sm:flex gap-6 mt-12 text-sm text-gray-500 transform transition-all duration-1000 delay-900 ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                                        <span>Envío gratis</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
                                        <span>Garantía 1 año</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
                                        <span>Devoluciones fáciles</span>
                                    </div>
                                </div>
                            </div>

                            {/* Galería de imágenes */}
                            <div className="mt-8 lg:mt-0 lg:block lg:absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                                {/* Versión móvil del carousel */}
                                <div className="block lg:hidden overflow-x-auto pb-4 -mx-4">
                                    <div className="flex gap-4 px-4">
                                        {product.Imagenes.map((imagen, index) => (
                                            <div
                                                key={`product1-${index}`}
                                                className="flex-shrink-0 w-64 h-72 relative rounded-xl overflow-hidden shadow-lg shadow-pink-200/30 border border-pink-100"
                                            >
                                                <img
                                                    src={imagen}
                                                    alt={`${product.Título} - Imagen ${index + 1}`}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-pink-200/20 to-transparent" />
                                            </div>
                                        ))}
                                        {/* Second product images */}
                                        {secondProduct?.Imagenes?.map((imagen, index) => (
                                            <div
                                                key={`product2-${index}`}
                                                className="flex-shrink-0 w-64 h-72 relative rounded-xl overflow-hidden shadow-lg shadow-blue-200/30 border border-blue-100"
                                            >
                                                <img
                                                    src={imagen}
                                                    alt={`${secondProduct.Título} - Imagen ${index + 1}`}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-blue-200/20 to-transparent" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Versión desktop de la galería */}
                                <div className="hidden lg:block">
                                    <div className="flex items-center space-x-6 md:space-x-8">
                                        {/* Left column - First product */}
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-12">
                                            {product.Imagenes.slice(0, 2).map((imagen, index) => (
                                                <div 
                                                    key={`desktop-product1-${index}`}
                                                    className={`w-72 h-80 overflow-hidden rounded-2xl border-4 border-white shadow-2xl shadow-pink-200/30 transform transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-3xl ${
                                                        currentImageIndex === index ? 'ring-4 ring-red-400 animate-pulse' : ''
                                                    }`}
                                                    style={{
                                                        transform: `rotate(${2 + index * 2}deg) translate(${index * 4}px, ${index * 8}px)`,
                                                        animationDelay: `${index * 0.2}s`
                                                    }}
                                                >
                                                    <img 
                                                        src={imagen} 
                                                        alt={`${product.Título} - Imagen ${index + 1}`} 
                                                        className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105" 
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-pink-200/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Right column - Second product */}
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-12">
                                            {secondProduct?.Imagenes?.slice(0, 2).map((imagen, index) => {
                                                const adjustedIndex = (product?.Imagenes?.length || 0) + index;
                                                return (
                                                    <div 
                                                        key={`desktop-product2-${index}`}
                                                        className={`w-72 h-80 overflow-hidden rounded-2xl border-4 border-white shadow-2xl shadow-blue-200/30 transform transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-3xl ${
                                                            currentImageIndex === adjustedIndex ? 'ring-4 ring-blue-400 animate-pulse' : ''
                                                        }`}
                                                        style={{
                                                            transform: `rotate(${-2 + index * 2}deg) translate(${-index * 4}px, ${-index * 8}px)`,
                                                            animationDelay: `${(index + 2) * 0.2}s`
                                                        }}
                                                    >
                                                        <img 
                                                            src={imagen} 
                                                            alt={`${secondProduct.Título} - Imagen ${index + 1}`} 
                                                            className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105" 
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-200/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    
                                    {/* Floating elements - Pastel colors */}
                                    <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-xl animate-float" />
                                    <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-10px) rotate(180deg); }
                    }
                    
                    .animate-float {
                        animation: float 4s ease-in-out infinite;
                    }
                    
                    .bg-grid-pattern {
                        background-image: radial-gradient(circle, #f1f5f9 1px, transparent 1px);
                        background-size: 30px 30px;
                    }
                    
                    .shadow-3xl {
                        box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
                    }
                `}</style>
            </>
        );
    }
    
    return null;
}