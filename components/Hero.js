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
        
        const interval = setInterval(() => {
            const totalImages = (product?.Imagenes?.length || 0) + (secondProduct?.Imagenes?.length || 0);
            if (totalImages > 1) {
                setCurrentImageIndex((prev) => (prev + 1) % totalImages);
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [product, secondProduct]);

    function addItemToCart() {
        addProduct(product._id);
        toast.success('¡Producto añadido al carrito!', {
            style: {
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                color: 'white',
                borderRadius: '12px',
                padding: '16px',
                fontWeight: '600'
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#dc2626',
            },
        });
    }

    if (product) {
        return (
            <div className="relative bg-gradient-to-br from-gray-50 via-white to-red-50/30 overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #dc2626 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
                
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Content */}
                        <div className={`space-y-8 transform transition-all duration-1000 ${
                            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                        }`}>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-red-500/25">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                50% de Descuento
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>

                            {/* Title */}
                            <div className="space-y-4">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                                    {product.Título}
                                </h1>
                                <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
                            </div>

                            {/* Description */}
                            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                                {product.Descripción}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button 
                                    onClick={addItemToCart}
                                    className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Añadir al Carrito
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>

                                <Link 
                                    href="/products"
                                    className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-red-500 hover:text-red-600 transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Ver Todo
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-200">
                                {[
                                    { icon: '🚚', text: 'Envío Gratis' },
                                    { icon: '🔒', text: 'Pago Seguro' },
                                    { icon: '↩️', text: 'Devolución Fácil' }
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="text-lg">{feature.icon}</span>
                                        <span className="font-medium">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Images Gallery */}
                        <div className={`relative transform transition-all duration-1000 delay-300 ${
                            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                        }`}>
                            {/* Mobile Carousel */}
                            <div className="lg:hidden">
                                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src={product.Imagenes[currentImageIndex % product.Imagenes.length]}
                                        alt={product.Título}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                                
                                {/* Thumbnails */}
                                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                    {product.Imagenes.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentImageIndex(i)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                currentImageIndex === i ? 'border-red-500 scale-110' : 'border-gray-200'
                                            }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop Grid */}
                            <div className="hidden lg:grid grid-cols-2 gap-4">
                                {product.Imagenes.slice(0, 2).map((img, i) => (
                                    <div
                                        key={`p1-${i}`}
                                        className={`relative aspect-square rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:scale-105 ${
                                            currentImageIndex === i ? 'ring-4 ring-red-500' : ''
                                        }`}
                                    >
                                        <img src={img} alt={product.Título} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                                {secondProduct?.Imagenes?.slice(0, 2).map((img, i) => {
                                    const idx = product.Imagenes.length + i;
                                    return (
                                        <div
                                            key={`p2-${i}`}
                                            className={`relative aspect-square rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:scale-105 ${
                                                currentImageIndex === idx ? 'ring-4 ring-red-500' : ''
                                            }`}
                                        >
                                            <img src={img} alt={secondProduct.Título} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-xl hidden lg:block">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">50%</div>
                                    <div className="text-xs text-gray-600">OFF</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return null;
}