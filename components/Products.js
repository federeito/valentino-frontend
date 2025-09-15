import { CartContext } from "@/lib/CartContext";
import { PriceDisplay, CartButton } from "@/components/PriceDisplay";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Products({ products }) {
    const { addProduct } = useContext(CartContext);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [hoveredProduct, setHoveredProduct] = useState(null);

    // Animación de aparición escalonada
    useEffect(() => {
        const timer = setTimeout(() => {
            products?.forEach((_, index) => {
                setTimeout(() => {
                    setVisibleProducts(prev => [...prev, index]);
                }, index * 100);
            });
        }, 200);

        return () => clearTimeout(timer);
    }, [products]);

    const handleAddToCart = (productId, productTitle) => {
        addProduct(productId);
        toast.success(`¡${productTitle} añadido al carrito!`, {
            style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 'bold'
            },
            duration: 3000,
        });
    };

    return (
        <>
            {/* Background decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative">
                <div className="mx-auto px-4 py-12">
                    {/* Título animado */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
                            Nuestros Últimos Productos
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
                        <p className="text-gray-600 mt-4 text-lg">Descubre nuestra selección exclusiva</p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
                        {products?.length > 0 && products.map((product, index) => {
                            const productImages = product.Imagenes?.slice(0, 12) || [];
                            
                            return (
                                <div 
                                    key={product._id} 
                                    className={`group relative transform transition-all duration-500 ${
                                        visibleProducts.includes(index) 
                                            ? 'translate-y-0 opacity-100' 
                                            : 'translate-y-8 opacity-0'
                                    }`}
                                    onMouseEnter={() => setHoveredProduct(product._id)}
                                    onMouseLeave={() => setHoveredProduct(null)}
                                >
                                    <div className="group block overflow-hidden border-2 border-transparent bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 hover:border-primary/20">
                                        <div className="p-2">
                                            {/* Container de imagen con efectos */}
                                            <div className="relative h-[300px] sm:h-[300px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                                <img 
                                                    src={productImages[0] || product.Imagenes[0]} 
                                                    alt={product.Título} 
                                                    className="absolute inset-0 h-full w-full object-contain opacity-100 group-hover:opacity-0 transition-opacity duration-500 transform group-hover:scale-110" 
                                                />
                                                <img 
                                                    src={productImages[1] || product.Imagenes[1]} 
                                                    alt={product.Título} 
                                                    className="absolute inset-0 h-full w-full object-contain opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-110 group-hover:scale-100" 
                                                />
                                                
                                                {/* Overlay con gradiente */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                
                                                {/* Badge de stock */}
                                                {!product.stock && (
                                                    <div className="absolute top-3 left-3">
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                                                            ¡Agotado!
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                {/* Quick view button */}
                                                <Link href={'/products/' + product._id}>
                                                    <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg">
                                                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                </Link>
                                            </div>

                                            {/* Información del producto */}
                                            <div className="relative p-4 border-t border-gray-100">
                                                <Link href={'/products/' + product._id}>
                                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300 truncate mb-2">
                                                        {product.Título}
                                                    </h3>
                                                </Link>
                                                
                                                {/* Color availability indicator */}
                                                {product.colors && product.colors.length > 0 && (
                                                    <div className="mb-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-xs font-medium text-gray-600">Colores:</span>
                                                            <div className="flex gap-1">
                                                                {product.colors.slice(0, 4).map((color, colorIndex) => {
                                                                    const isAvailable = color.available !== false;
                                                                    return (
                                                                        <div key={colorIndex} className="relative">
                                                                            <div 
                                                                                className={`w-4 h-4 rounded-full border border-gray-300 ${
                                                                                    !isAvailable ? 'filter grayscale opacity-50' : ''
                                                                                }`}
                                                                                style={{ backgroundColor: color.code }}
                                                                                title={`${color.name} - ${isAvailable ? 'Disponible' : 'Agotado'}`}
                                                                            />
                                                                            {!isAvailable && (
                                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                                    <div className="w-3 h-0.5 bg-red-500 transform rotate-45" />
                                                                                    <div className="absolute w-3 h-0.5 bg-red-500 transform -rotate-45" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                                {product.colors.length > 4 && (
                                                                    <span className="text-xs text-gray-500 ml-1">
                                                                        +{product.colors.length - 4}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {product.colors.some(color => color.available === false) && (
                                                            <div className="text-xs text-amber-600 font-medium">
                                                                ⚠️ Algunos colores agotados
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Precio con control de visibilidad */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex flex-col">
                                                        <PriceDisplay 
                                                            price={product.Precio} 
                                                            size="default"
                                                            showLoginPrompt={false}
                                                        />
                                                        <span className="text-sm text-gray-500">por unidad</span>
                                                    </div>
                                                    
                                                    {/* Rating simulado */}
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Botones de acción */}
                                                <div className="space-y-2">
                                                    <CartButton
                                                        productId={product._id}
                                                        productTitle={product.Título}
                                                        stock={product.stock}
                                                        onAddToCart={handleAddToCart}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Glow effect on hover */}
                                        <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                                            hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'
                                        } bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 pointer-events-none`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mensaje cuando no hay productos */}
                    {(!products || products.length === 0) && (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay productos disponibles</h3>
                            <p className="text-gray-500">Vuelve pronto para ver nuestras novedades</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}