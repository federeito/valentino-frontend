import { CartContext } from "@/lib/CartContext";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Hero({ product }) {
    const { addProduct } = useContext(CartContext);
    const [isVisible, setIsVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        
        // Cambio automático de imágenes
        const interval = setInterval(() => {
            if (product?.Imagenes?.length > 1) {
                setCurrentImageIndex((prev) => 
                    (prev + 1) % product.Imagenes.length
                );
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [product]);

    function addItemToCart() {
        addProduct(product._id);
        toast.success('¡Producto añadido al carrito!', {
            style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 'bold'
            }
        });
    }

    if (product) {
        return (
            <>
                {/* Animated background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                </div>



                <div className="relative overflow-hidden my-14 md:my-10">
                    <div className="lg:py-40 min-h-[650px] relative">
                        {/* Grid pattern overlay */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                        
                        <div className="relative mx-auto sm:static px-6 lg:px-8">
                            <div className={`max-w-xl text-start transform transition-all duration-1000 ${
                                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                            }`}>
                                {/* Animated discount badge */}
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg mb-6 shadow-lg shadow-accent/30 animate-bounce">
                                    <span className="animate-pulse">🔥</span>
                                    <span>Al 50% Off</span>
                                    <span className="animate-pulse">✨</span>
                                </div>

                                {/* Main title with gradient text */}
                                <h1 className={`text-4xl md:text-5xl max-md:mb-6 font-bold tracking-tight my-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent transform transition-all duration-1000 delay-300 ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                                }`}>
                                    {product.Título}
                                </h1>

                                {/* Description with typewriter effect */}
                                <div className={`relative transform transition-all duration-1000 delay-500 ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                                }`}>
                                    <p className="line-clamp-3 text-lg text-gray-600 leading-relaxed mb-8 relative z-10">
                                        {product.Descripción}
                                    </p>
                                    {/* Highlight bar */}
                                    <div className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
                                </div>

                                {/* Action buttons with hover effects */}
                                <div className={`flex gap-6 mt-10 items-center max-sm:justify-center max-sm:mt-6 transform transition-all duration-1000 delay-700 ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                                }`}>
                                    <button 
                                        type="button" 
                                        className="group relative overflow-hidden rounded-xl border-2 border-primary bg-gradient-to-r from-primary to-secondary px-8 py-4 text-center text-lg font-bold text-white shadow-2xl shadow-primary/25 transition-all duration-300 hover:shadow-3xl hover:shadow-primary/40 hover:scale-105 active:scale-95"
                                        onClick={addItemToCart}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                                            </svg>
                                            Añadir al Carrito
                                        </span>
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    </button>

                                    <Link 
                                        href={'/products'} 
                                        className="group relative rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm px-8 py-4 text-center text-lg font-bold text-gray-700 shadow-lg transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-white active:scale-95"
                                    >
                                        <span className="flex items-center gap-2">
                                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m0 0l4-4m-4 4l4 4" />
                                            </svg>
                                            Todos los Productos
                                        </span>
                                    </Link>
                                </div>

                                {/* Feature highlights */}
                                <div className={`flex gap-6 mt-12 text-sm text-gray-500 transform transition-all duration-1000 delay-900 ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span>Envío gratis</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                        <span>Garantía 1 año</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                        <span>Devoluciones fáciles</span>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced image gallery */}
                            <div className="hidden lg:block absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                                <div className="flex items-center space-x-6 md:space-x-8">
                                    {/* Left column */}
                                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-12">
                                        {product.Imagenes.slice(0, 2).map((imagen, index) => (
                                            <div 
                                                key={index}
                                                className={`w-72 h-80 overflow-hidden rounded-2xl border-4 border-white shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-3xl ${
                                                    currentImageIndex === index ? 'ring-4 ring-primary animate-pulse' : ''
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
                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Right column */}
                                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-12">
                                        {product.Imagenes.slice(2, 4).map((imagen, index) => (
                                            <div 
                                                key={index + 2}
                                                className={`w-72 h-80 overflow-hidden rounded-2xl border-4 border-white shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-3xl ${
                                                    currentImageIndex === (index + 2) ? 'ring-4 ring-secondary animate-pulse' : ''
                                                }`}
                                                style={{
                                                    transform: `rotate(${-2 + index * 2}deg) translate(${-index * 4}px, ${-index * 8}px)`,
                                                    animationDelay: `${(index + 2) * 0.2}s`
                                                }}
                                            >
                                                <img 
                                                    src={imagen} 
                                                    alt={`${product.Título} - Imagen ${index + 3}`} 
                                                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105" 
                                                />
                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Floating elements around images */}
                                <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-float" />
                                <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-gradient-to-br from-accent/20 to-orange-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
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
                        background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px);
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