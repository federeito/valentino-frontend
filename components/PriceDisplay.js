import { usePriceVisibility } from '@/lib/PriceVisibilityContext';
import { signIn } from 'next-auth/react';

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const PriceDisplay = ({ 
    price, 
    className = "", 
    size = "default",
    showLoginPrompt = true,
    showUnit = true
}) => {
    const { canViewPrices, isLoading, isLoggedIn } = usePriceVisibility();

    if (isLoading) {
        return (
            <div className={`animate-pulse bg-gray-200 rounded ${
                size === "large" ? "h-8 w-24" : "h-6 w-20"
            } ${className}`} />
        );
    }

    // Only show prices if user is logged in AND can view prices
    if (isLoggedIn && canViewPrices) {
        const textSize = size === "large" ? "text-2xl md:text-4xl" : 
                        size === "small" ? "text-sm" : "text-xl md:text-2xl";
        
        return (
            <div className={className}>
                <span className={`font-bold text-gray-800 ${textSize}`}>
                    ${formatPrice(price)}
                </span>
                {showUnit && (
                    <span className="text-sm text-gray-500 ml-1">c/u</span>
                )}
            </div>
        );
    }

    // If not logged in, show enhanced login prompt
    if (!isLoggedIn && showLoginPrompt) {
        return (
            <div className={`${className}`}>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-3 mb-2">
                    <div className="flex items-center gap-2 justify-center">
                        <div className="p-1 bg-blue-100 rounded-full">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-semibold text-blue-700">¡Precios Exclusivos!</div>
                            <div className="text-xs text-blue-600">Precio disponible para usuarios registrados</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default fallback - for logged in but not approved users, don't show duplicate message
    return (
        <div className={`${className}`}>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-3 mb-2">
                <div className="flex items-center gap-2 justify-center">
                    <div className="p-1 bg-amber-100 rounded-full">
                        <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-semibold text-amber-700">Acceso Restringido</div>
                        <div className="text-xs text-amber-600">Precio disponible para usuarios registrados</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CartButton = ({ 
    productId, 
    productTitle, 
    stock, 
    onAddToCart, 
    disabled = false,
    className = "" 
}) => {
    const { canViewPrices, isLoggedIn } = usePriceVisibility();

    // If not logged in, show login button
    if (!isLoggedIn) {
        return (
            <button
                onClick={() => signIn('google')}
                className={`w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-105 active:scale-95 ${className}`}
            >
                Iniciar sesión para comprar
            </button>
        );
    }

    // If logged in but not approved, show pending approval (keep this one as it's the main warning)
    if (isLoggedIn && !canViewPrices) {
        return (
            <div className="w-full">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-lg text-sm mb-2">
                    <div className="flex items-center gap-2 justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-xs">Cuenta pendiente de aprobación</span>
                    </div>
                </div>
            </div>
        );
    }

    if (stock <= 0) {
        return (
            <button
                disabled
                className={`w-full rounded-xl border-2 border-gray-200 bg-gray-100 px-6 py-3 text-center text-sm font-bold text-gray-400 cursor-not-allowed ${className}`}
            >
                <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Sin Stock
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={() => onAddToCart(productId, productTitle)}
            disabled={disabled}
            className={`w-full group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 active:scale-95 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${className}`}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
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
                    className="w-4 h-4 transition-transform group-hover/btn:rotate-12"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" />
                    <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
                </svg>
                Agregar al Carrito
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
        </button>
    );
};
