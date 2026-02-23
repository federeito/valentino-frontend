import { CartContext } from "@/lib/CartContext";
import { PriceDisplay, CartButton } from "@/components/PriceDisplay";
import { usePriceVisibility } from "@/lib/PriceVisibilityContext";
import PromoBanner from "@/components/PromoBanner";
import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function ProductPage({ product }) {
    const { addProduct, removeProduct, cartProducts } = useContext(CartContext);
    const { canViewPrices } = usePriceVisibility();
    const [selectedImage, setSelectedImage] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    
    const countInCart = cartProducts.filter(id => id === product._id).length;
    const productImages = product.Imagenes?.slice(0, 12) || [];

    useEffect(() => {
        setIsVisible(true);
        if (product.colors && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
        }
    }, [product.colors]);

    const handleAddToCart = () => {
        if (product.colors && product.colors.length > 0) {
            if (!selectedColor) {
                toast.error('Por favor selecciona un color', {
                    style: {
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                    }
                });
                return;
            }
            if (selectedColor.available === false) {
                toast.error('El color seleccionado no está disponible', {
                    style: {
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                    }
                });
                return;
            }
        }

        for (let i = 0; i < quantity; i++) {
            if (selectedColor) {
                addProduct(product._id, { color: selectedColor });
            } else {
                addProduct(product._id);
            }
        }
        
        const colorText = selectedColor ? ` en color ${selectedColor.name}` : '';
        toast.success(`¡${quantity} ${product.Título} agregado(s) al carrito${colorText}!`, {
            style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 'bold'
            },
            duration: 3000,
        });
    };

    const handleRemoveFromCart = () => {
        removeProduct(product._id);
        toast.success('Producto removido del carrito', {
            style: {
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 'bold'
            }
        });
    };

    const ColorSelector = () => {
        if (!product.colors || product.colors.length === 0) {
            return null;
        }

        return (
            <div className="mb-6">
                <h2 className="text-lg font-normal text-gray-900 mb-4 flex items-center gap-2 tracking-wide font-['Inter',_'system-ui',_sans-serif]">
                    <span role="img" aria-label="paleta" className="text-lg">🎨</span>
                    Colores Disponibles
                </h2>
                
                <div className="flex flex-wrap gap-3 mb-4">
                    {product.colors.map((color, index) => {
                        const isAvailable = color.available !== false;
                        const isSelected = selectedColor && selectedColor.name === color.name;
                        
                        return (
                            <div 
                                key={index}
                                onClick={() => isAvailable && setSelectedColor(color)}
                                className={`relative transition-all duration-300 ${
                                    isAvailable 
                                        ? `cursor-pointer group ${
                                            isSelected
                                                ? 'scale-110' 
                                                : 'hover:scale-105'
                                        }`
                                        : 'cursor-not-allowed opacity-50'
                                }`}
                            >
                                <div className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 transition-all duration-300 ${
                                    isAvailable 
                                        ? `border-gray-200 hover:border-gray-300 hover:shadow-md ${isSelected ? 'border-red-400 shadow-lg shadow-red-200/30' : ''}`
                                        : 'border-gray-200 bg-gray-50'
                                }`}>
                                    <div className="relative">
                                        <div 
                                            className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 ${
                                                !isAvailable ? 'filter grayscale' : ''
                                            }`}
                                            style={{ backgroundColor: color.code }}
                                        />
                                        {!isAvailable && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-4 h-0.5 bg-red-500 transform rotate-45" />
                                                <div className="absolute w-4 h-0.5 bg-red-500 transform -rotate-45" />
                                            </div>
                                        )}
                                        {isSelected && isAvailable && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-light tracking-wide ${
                                            isAvailable ? 'text-gray-700' : 'text-gray-500'
                                        }`}>
                                            {color.name}
                                        </span>
                                        <span className={`text-xs font-light ${
                                            isAvailable ? 'text-green-600' : 'text-red-500'
                                        }`}>
                                            {isAvailable ? 'Disponible' : 'Agotado'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {selectedColor && (
                    <div className="bg-gradient-to-r from-pink-50/50 to-blue-50/50 rounded-xl p-4 border border-pink-100">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                                style={{ backgroundColor: selectedColor.code }}
                            />
                            <span className="text-sm font-light text-gray-700 tracking-wide">
                                Color seleccionado: <span className="text-red-600 font-normal">{selectedColor.name}</span>
                            </span>
                        </div>
                    </div>
                )}

                {/* Show unavailable colors count */}
                {product.colors.some(color => color.available === false) && (
                    <div className="mt-3 text-center">
                        <span className="text-sm text-gray-500 font-light tracking-wide">
                            {product.colors.filter(color => color.available === false).length} color(es) agotado(s)
                        </span>
                    </div>
                )}
            </div>
        );
    };

    if (product) {
        return (
            <>
                <PromoBanner />
                {/* Background decorativo - Pastel colors matching other pages */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-50/80 via-blue-50/60 to-purple-50/40" />
                    <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-200/25 to-purple-200/25 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-indigo-200/15 to-blue-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <section className="relative mt-4 md:mt-6 px-4 md:px-8 lg:px-12 pb-8 md:pb-10 lg:pb-12 xl:pb-16 font-['Inter',_'Segoe_UI',_'system-ui',_'-apple-system',_sans-serif]">
                    <div className="max-w-7xl mx-auto">
                        <nav className="flex mb-8" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <Link href="/" className="inline-flex items-center text-sm font-light text-gray-700 hover:text-primary tracking-wide">
                                        <svg className="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                        </svg>
                                        Inicio
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        <Link href="/products" className="ml-1 text-sm font-light text-gray-700 hover:text-primary tracking-wide">Productos</Link>
                                    </div>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        <span className="ml-1 text-sm font-light text-gray-500 truncate tracking-wide">{product.Título}</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                            <div className={`transform transition-all duration-1000 ${
                                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                            }`}>
                                {/* Main image display with navigation */}
                                <div className="relative aspect-square overflow-hidden rounded-2xl border-4 border-white shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 mb-6 group">
                                    <img 
                                        src={productImages[selectedImage] || product.Imagenes[0]} 
                                        alt={product.Título} 
                                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
                                    />
                                    
                                    {/* Navigation arrows for main image - always show if multiple images */}
                                    {productImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setSelectedImage(selectedImage === 0 ? productImages.length - 1 : selectedImage - 1)}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-60 hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg z-30"
                                            >
                                                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setSelectedImage(selectedImage === productImages.length - 1 ? 0 : selectedImage + 1)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-60 hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg z-30"
                                            >
                                                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Thumbnails grid - enhanced for up to 12 images */}
                                {productImages.length > 1 && (
                                    <div className={`grid gap-2 md:gap-3 ${
                                        productImages.length <= 3 ? 'grid-cols-3' :
                                        productImages.length <= 4 ? 'grid-cols-4' :
                                        productImages.length <= 6 ? 'grid-cols-6' :
                                        productImages.length <= 8 ? 'grid-cols-4' :
                                        productImages.length <= 12 ? 'grid-cols-6' : 'grid-cols-6'
                                    }`}>
                                        {productImages.map((image, index) => (
                                            <div 
                                                key={index}
                                                className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer border-3 transition-all duration-300 hover:scale-105 ${
                                                    selectedImage === index 
                                                        ? 'border-primary shadow-lg shadow-primary/30 ring-2 ring-primary/50' 
                                                        : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
                                                }`}
                                                onClick={() => setSelectedImage(index)}
                                            >
                                                <img 
                                                    src={image} 
                                                    alt={`${product.Título} - Vista ${index + 1}`} 
                                                    className="w-full h-full object-contain bg-white transition-transform duration-300 hover:scale-110" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Show message if only one image */}
                                {productImages.length === 1 && (
                                    <div className="text-center py-4">
                                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            1 imagen disponible
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className={`transform transition-all duration-1000 delay-300 ${
                                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                            }`}>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide bg-gradient-to-r from-slate-700 via-gray-800 to-slate-700 bg-clip-text text-transparent mb-6 font-['Inter',_'system-ui',_sans-serif] leading-tight">
                                    {product.Título}
                                </h1>

                                {/* Product Code */}
                                <div className="mb-4">
                                    <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1">
                                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                        <span className="text-xs font-light text-gray-600 tracking-wide">
                                            COD. <span className="text-gray-800 font-normal">{product.código || 'N/A'}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-pink-50/50 to-blue-50/50 rounded-2xl p-6 mb-8 border border-pink-100">
                                    <div className="flex items-baseline gap-4">
                                        <PriceDisplay 
                                            price={product.Precio} 
                                            size="large"
                                            className="!text-gray-800"
                                            showUnit={false}
                                        />
                                        {canViewPrices && (
                                            <span className="text-gray-600 text-lg font-light tracking-wide">por unidad</span>
                                        )}
                                    </div>
                                </div>

                                <ColorSelector />

                                <div className="mb-8">
                                    <h3 className="text-lg md:text-xl font-normal text-gray-900 mb-4 flex items-center gap-2 tracking-wide font-['Inter',_'system-ui',_sans-serif]">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Descripción
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-4 rounded-xl font-light tracking-wide">
                                        {product.Descripción}
                                    </p>
                                </div>

                                {canViewPrices ? (
                                    product.stock > 0 ? (
                                        <div className="space-y-6">
                                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
                                                <label className="block text-sm font-medium text-gray-700 mb-3 tracking-wide">
                                                    Cantidad a agregar:
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    {/* Quantity Selector */}
                                                    <div className="flex items-center gap-4">
                                                        <button 
                                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                            className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-2xl font-bold text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:scale-110 active:scale-95"
                                                        >
                                                            −
                                                        </button>
                                                        <input 
                                                            type="number" 
                                                            min="1" 
                                                            max={product.stock - countInCart} 
                                                            value={quantity}
                                                            onChange={(e) => setQuantity(Math.min(product.stock - countInCart, Math.max(1, parseInt(e.target.value) || 1)))}
                                                            className="w-20 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                                                        />
                                                        <button 
                                                            onClick={() => setQuantity(Math.min(product.stock - countInCart, quantity + 1))}
                                                            disabled={quantity >= (product.stock - countInCart)}
                                                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300 hover:scale-110 active:scale-95 ${
                                                                quantity >= (product.stock - countInCart)
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700'
                                                            }`}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Discount Information */}
                                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                                                        <div className="flex-shrink-0">
                                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 mb-0.5 tracking-wide leading-tight">
                                                                10% de descuento
                                                            </p>
                                                            <p className="text-xs text-gray-700 leading-tight tracking-wide">
                                                                pagando con Transferencia/depósito
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={handleAddToCart}
                                                    disabled={quantity > (product.stock - countInCart)}
                                                    className={`w-full group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-medium transition-all duration-300 tracking-wide ${
                                                        quantity > (product.stock - countInCart)
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-red-800 to-red-900 text-white shadow-lg shadow-red-800/30 hover:shadow-xl hover:shadow-red-800/50 hover:scale-105 active:scale-95'
                                                    }`}
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-3">
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
                                                            className="w-6 h-6 transition-transform group-hover:rotate-12"
                                                        >
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                            <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" />
                                                            <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
                                                        </svg>
                                                        {quantity === 1 ? 'Agregar al Carrito' : `Agregar ${quantity} al Carrito`}
                                                    </span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                                                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl font-light text-red-800 mb-2 tracking-wide font-['Inter',_'system-ui',_sans-serif]">
                                                    ¡Producto Agotado!
                                                </h3>
                                                <p className="text-red-600 font-light tracking-wide">
                                                    Este producto no está disponible en este momento.
                                                </p>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="space-y-4">
                                        <CartButton
                                            productId={product._id}
                                            productTitle={product.Título}
                                            stock={product.stock}
                                            onAddToCart={handleAddToCart}
                                            className="h-16 text-lg"
                                        />
                                    </div>
                                )}

                                <div className="mt-8">
                                    <div className="flex gap-3 justify-center">
                                        <a
                                            href="https://www.galeriabelgrano.com.ar/locales/Soledad/36"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 active:scale-95"
                                            aria-label="Tienda"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </a>
                                        <a
                                            href="https://www.instagram.com/soledadaccesorios"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 active:scale-95"
                                            aria-label="Instagram"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <style jsx>{`
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    
                    .animate-shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 200% 100%;
                        animation: shimmer 2s infinite;
                    }
                `}</style>
            </>
        );
    }
    
    return null;
}

export async function getServerSideProps(context) {
    await mongooseconnect();
    const { id } = context.query;
    const product = await Product.findById(id);
    return {
        props: {
            product: JSON.parse(JSON.stringify(product))
        }
    }
}