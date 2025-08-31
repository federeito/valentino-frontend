import { CartContext } from "@/lib/CartContext";
import { PriceDisplay, CartButton } from "@/components/PriceDisplay";
import { usePriceVisibility } from "@/lib/PriceVisibilityContext";
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

    useEffect(() => {
        setIsVisible(true);
        if (product.colors && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
        }
    }, [product.colors]);

    const handleAddToCart = () => {
        if (product.colors && product.colors.length > 0 && !selectedColor) {
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span role="img" aria-label="paleta" className="text-xl">🎨</span>
                    Colores Disponibles
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {product.colors.map((color, index) => (
                        <div 
                            key={index}
                            onClick={() => setSelectedColor(color)}
                            className={`relative cursor-pointer group transition-all duration-300 ${
                                selectedColor && selectedColor.name === color.name
                                    ? 'ring-4 ring-primary ring-offset-2' 
                                    : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-1'
                            } rounded-xl overflow-hidden`}
                        >
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center space-y-3 transition-all duration-300 group-hover:shadow-lg">
                                <div 
                                    className="w-12 h-12 rounded-full border-4 border-white shadow-lg ring-1 ring-gray-200"
                                    style={{ backgroundColor: color.code }}
                                />
                                <span className="text-sm font-medium text-gray-700 text-center leading-tight">
                                    {color.name}
                                </span>
                                {selectedColor && selectedColor.name === color.name && (
                                    <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {selectedColor && (
                    <div className="mt-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: selectedColor.code }}
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Color seleccionado: <span className="text-primary font-semibold">{selectedColor.name}</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (product) {
        return (
            <>
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-pink-100/40 to-orange-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                <section className="relative mt-20 md:mt-6 px-4 md:px-8 lg:px-12">
                    <div className="max-w-7xl mx-auto">
                        <nav className="flex mb-8" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary">
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
                                        <Link href="/products" className="ml-1 text-sm font-medium text-gray-700 hover:text-primary">Productos</Link>
                                    </div>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        <span className="ml-1 text-sm font-medium text-gray-500 truncate">{product.Título}</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                            <div className={`transform transition-all duration-1000 ${
                                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                            }`}>
                                <div className="aspect-square overflow-hidden rounded-2xl border-4 border-white shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 mb-6">
                                    <img 
                                        src={product.Imagenes[selectedImage]} 
                                        alt={product.Título} 
                                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
                                    />
                                </div>

                                <div className="grid grid-cols-4 gap-3">
                                    {product.Imagenes.slice(0, 4).map((image, index) => (
                                        <div 
                                            key={index}
                                            className={`aspect-square overflow-hidden rounded-xl cursor-pointer border-3 transition-all duration-300 hover:scale-105 ${
                                                selectedImage === index 
                                                    ? 'border-primary shadow-lg shadow-primary/30' 
                                                    : 'border-gray-200 hover:border-primary/50'
                                            }`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img 
                                                src={image} 
                                                alt={`${product.Título} - Vista ${index + 1}`} 
                                                className="w-full h-full object-contain bg-white" 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`transform transition-all duration-1000 delay-300 ${
                                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                            }`}>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent mb-6">
                                    {product.Título}
                                </h1>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="text-gray-600 text-sm ml-2">(128 reseñas)</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-8">
                                    <div className="flex items-baseline gap-4">
                                        <PriceDisplay 
                                            price={product.Precio} 
                                            size="large"
                                        />
                                        {canViewPrices && (
                                            <span className="text-gray-600 text-lg">por unidad</span>
                                        )}
                                    </div>
                                    {canViewPrices && (
                                        <p className="text-green-600 font-semibold mt-2">✨ Envío gratis en pedidos mayores a $50,000</p>
                                    )}
                                </div>

                                <ColorSelector />

                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Descripción
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-4 rounded-xl">
                                        {product.Descripción}
                                    </p>
                                </div>

                                {canViewPrices ? (
                                    product.stock > 0 ? (
                                        <div className="space-y-6">
                                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                    Cantidad a agregar:
                                                </label>
                                                <div className="flex items-center gap-4 mb-4">
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
                                                        className="w-20 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                                                    />
                                                    <button 
                                                        onClick={() => setQuantity(Math.min(product.stock - countInCart, quantity + 1))}
                                                        disabled={quantity >= (product.stock - countInCart)}
                                                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300 hover:scale-110 active:scale-95 ${
                                                            quantity >= (product.stock - countInCart)
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/80 hover:to-secondary/80'
                                                        }`}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={handleAddToCart}
                                                    disabled={quantity > (product.stock - countInCart)}
                                                    className={`w-full group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold transition-all duration-300 ${
                                                        quantity > (product.stock - countInCart)
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 hover:scale-105 active:scale-95'
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
                                                <h3 className="text-xl font-bold text-red-800 mb-2">
                                                    ¡Producto Agotado!
                                                </h3>
                                                <p className="text-red-600">
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

                                <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Beneficios
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>Envío gratuito en compras mayores a $50,000</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Garantía de 1 año</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <span>Devoluciones fáciles hasta 30 días</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                            <span>Soporte técnico 24/7</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button className="flex-1 border-2 border-gray-300 rounded-xl px-6 py-3 text-gray-700 font-semibold hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        Favoritos
                                    </button>
                                    <button className="flex-1 border-2 border-gray-300 rounded-xl px-6 py-3 text-gray-700 font-semibold hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                        </svg>
                                        Compartir
                                    </button>
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