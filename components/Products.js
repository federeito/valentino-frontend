import { CartContext } from "@/lib/CartContext";
import { PriceDisplay } from "@/components/PriceDisplay";
import Link from "next/link";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

export default function Products({ products }) {
    const { addProduct } = useContext(CartContext);
    const [hoveredProduct, setHoveredProduct] = useState(null);

    const handleAddToCart = (productId, productTitle) => {
        addProduct(productId);
        toast.success(`¡${productTitle} añadido al carrito!`, {
            style: {
                background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 'bold'
            },
            duration: 3000,
        });
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {products?.length > 0 && products.map((product, index) => (
                <Link 
                    href={`/products/${product._id}`} 
                    key={product._id}
                    className="group"
                >
                    <div 
                        className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl border-2 border-transparent hover:border-red-200 transition-all duration-500 hover:scale-105 overflow-hidden"
                        onMouseEnter={() => setHoveredProduct(product._id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                    >
                        {/* Image Container */}
                        <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-blue-50">
                            <img 
                                src={product.Imagenes[0]} 
                                alt={product.Título} 
                                className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 p-2 sm:p-4" 
                            />
                            
                            {/* Stock Badge */}
                            {!product.stock && (
                                <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                    <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                                        ¡Agotado!
                                    </span>
                                </div>
                            )}

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-pink-200/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Product Information */}
                        <div className="p-2 sm:p-3 md:p-4 border-t border-pink-100">
                            <h3 className="text-sm sm:text-base md:text-lg font-normal tracking-wide text-gray-800 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 mb-2">
                                {product.Título}
                            </h3>

                            {/* Color availability indicator */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-2 sm:mb-3">
                                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                        <span className="text-xs font-medium text-gray-600">Colores:</span>
                                        <div className="flex gap-0.5 sm:gap-1">
                                            {product.colors.slice(0, 4).map((color, colorIndex) => {
                                                const isAvailable = color.available !== false;
                                                return (
                                                    <div key={colorIndex} className="relative">
                                                        <div 
                                                            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300 ${
                                                                !isAvailable ? 'filter grayscale opacity-50' : ''
                                                            }`}
                                                            style={{ backgroundColor: color.code }}
                                                            title={`${color.name} - ${isAvailable ? 'Disponible' : 'Agotado'}`}
                                                        />
                                                        {!isAvailable && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-2 sm:w-3 h-0.5 bg-red-500 transform rotate-45" />
                                                                <div className="absolute w-2 sm:w-3 h-0.5 bg-red-500 transform -rotate-45" />
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

                            {/* Price Display - No Cart Button */}
                            <div className="mt-3">
                                <PriceDisplay 
                                    price={product.Precio} 
                                    size="small"
                                    className="text-gray-800"
                                    showUnit={true}
                                    showLoginPrompt={false}
                                />
                            </div>
                        </div>

                        {/* Glow effect on hover */}
                        <div className={`absolute inset-0 rounded-xl sm:rounded-2xl transition-opacity duration-300 ${
                            hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'
                        } bg-gradient-to-r from-pink-200/5 via-blue-200/5 to-purple-200/5 pointer-events-none`} />
                    </div>
                </Link>
            ))}
        </div>
    );
}