import { CartContext } from "@/lib/CartContext";
import { PriceDisplay, CartButton } from "@/components/PriceDisplay";
import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import Link from "next/link";
import { useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Products({ allProducts = [], categories = [] }) {
    const { addProduct } = useContext(CartContext);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high', 'name'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const getFilteredProducts = useCallback(() => {
        let filtered = allProducts || [];

        // Debug: Log first product to see its structure
        if (allProducts && allProducts.length > 0 && selectedCategory) {
            console.log('First product structure:', allProducts[0]);
            console.log('Selected category:', selectedCategory);
        }

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.Título.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.Descripción.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por categoría
        if (selectedCategory) {
            filtered = filtered.filter(product => {
                // Use the correct field name from your Product model: 'Categoria'
                const productCategory = product.Categoria;
                
                console.log('Product category:', {
                    productId: product._id,
                    title: product.Título,
                    categoria: productCategory
                });
                
                if (!productCategory) return false;
                
                // If category is an object with _id (populated)
                if (typeof productCategory === 'object' && productCategory._id) {
                    return productCategory._id === selectedCategory;
                }
                
                // If category is just a string ID
                return productCategory === selectedCategory;
            });
            
            console.log('Filtered products count:', filtered.length);
        }

        // Ordenar
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.Precio - b.Precio);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.Precio - a.Precio);
                break;
            case 'name':
                filtered.sort((a, b) => a.Título.localeCompare(b.Título));
                break;
            default: // newest
                filtered.sort((a, b) => new Date(b._id) - new Date(a._id));
        }

        return filtered;
    }, [allProducts, searchTerm, sortBy, selectedCategory]);

    // Animación de aparición escalonada
    useEffect(() => {
        setVisibleProducts([]);
        const timer = setTimeout(() => {
            const filteredProducts = getFilteredProducts();
            filteredProducts.forEach((_, index) => {
                setTimeout(() => {
                    setVisibleProducts(prev => [...prev, index]);
                }, index * 50);
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [getFilteredProducts]);

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

    const filteredProducts = getFilteredProducts();

    return (
        <>
            {/* Background decorativo */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-32 left-20 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-br from-pink-100/30 to-orange-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-100/20 to-blue-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative min-h-screen w-full">
                <div className="max-w-7xl mx-auto p-6">
                    {/* Header con título y estadísticas */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
                            Todos Nuestros Productos
                        </h1>
                        <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6" />
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Explora nuestra completa colección de productos cuidadosamente seleccionados
                        </p>
                        
                        {/* Estadísticas */}
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{allProducts?.length || 0}</div>
                                <div className="text-sm text-gray-500">Productos Total</div>
                            </div>
                        </div>
                    </div>

                    {/* Barra de búsqueda y filtros */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Barra de búsqueda */}
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                                />
                            </div>

                            {/* Filtros */}
                            <div className="flex gap-4">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                                >
                                    <option value="">Todas las categorías</option>
                                    {Array.isArray(categories) && categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                                >
                                    <option value="newest">Más nuevos</option>
                                    <option value="price-low">Precio: Menor a mayor</option>
                                    <option value="price-high">Precio: Mayor a menor</option>
                                    <option value="name">Nombre A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Resultados de búsqueda */}
                        <div className="mt-4 text-sm text-gray-600">
                            {searchTerm && (
                                <span>Resultados para <strong>&ldquo;{searchTerm}&rdquo;</strong>:</span>
                            )}
                            <span className="font-semibold">{filteredProducts.length} producto(s) encontrado(s)</span>
                        </div>
                    </div>

                    {/* Grid de productos */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {filteredProducts.map((product, index) => {
                                const productImages = product.Imagenes?.slice(0, 6) || [];
                                const currentIndex = currentImageIndex[product._id] || 0;
                                
                                return (
                                    <div 
                                        key={product._id} 
                                        className={`group relative transform transition-all duration-500 ${
                                            visibleProducts.includes(index) 
                                                ? 'translate-y-0 opacity-100' 
                                                : 'translate-y-8 opacity-0'
                                        }`}
                                        onMouseEnter={() => setHoveredProduct(product._id)}
                                        onMouseLeave={() => {
                                            setHoveredProduct(null);
                                            setCurrentImageIndex(prev => ({ ...prev, [product._id]: 0 }));
                                        }}
                                    >
                                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 border-2 border-transparent hover:border-primary/20 transition-all duration-500 hover:scale-105 overflow-hidden">
                                            {/* Container de imagen con carousel */}
                                            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                                                {/* Current image display */}
                                                <img 
                                                    src={productImages[currentIndex] || product.Imagenes[0]} 
                                                    alt={`${product.Título} - Vista ${currentIndex + 1}`} 
                                                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 p-4" 
                                                />

                                                {/* Navigation arrows - only show when hovered and has multiple images */}
                                                {productImages.length > 1 && hoveredProduct === product._id && (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                const prevIndex = currentIndex === 0 ? productImages.length - 1 : currentIndex - 1;
                                                                setCurrentImageIndex(prev => ({ ...prev, [product._id]: prevIndex }));
                                                            }}
                                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg z-20"
                                                        >
                                                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                const nextIndex = currentIndex === productImages.length - 1 ? 0 : currentIndex + 1;
                                                                setCurrentImageIndex(prev => ({ ...prev, [product._id]: nextIndex }));
                                                            }}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg z-20"
                                                        >
                                                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}

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

                                                {/* Quick view - Eye icon preserved */}
                                                <Link href={`/products/${product._id}`}>
                                                    <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg z-10">
                                                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                </Link>

                                                {/* Image navigation dots - bottom center when hovered */}
                                                {productImages.length > 1 && hoveredProduct === product._id && (
                                                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                                                        {productImages.map((_, imgIndex) => (
                                                            <button
                                                                key={imgIndex}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    setCurrentImageIndex(prev => ({ ...prev, [product._id]: imgIndex }));
                                                                }}
                                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                                    imgIndex === currentIndex 
                                                                        ? 'bg-primary scale-125' 
                                                                        : 'bg-white/60 hover:bg-white/80'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Información del producto */}
                                            <div className="p-4">
                                                <Link href={`/products/${product._id}`}>
                                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300 truncate mb-2">
                                                        {product.Título}
                                                    </h3>
                                                </Link>

                                                {/* Product Code */}
                                                <div className="mb-3">
                                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                                        COD. {product.código || 'N/A'}
                                                    </span>
                                                </div>

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
                                                <div className="mb-4">
                                                    <PriceDisplay 
                                                        price={product.Precio} 
                                                        size="default"
                                                        showLoginPrompt={false}
                                                    />
                                                    <span className="text-sm text-gray-500 ml-1">c/u</span>
                                                </div>

                                                {/* Botones */}
                                                <CartButton
                                                    productId={product._id}
                                                    productTitle={product.Título}
                                                    stock={product.stock}
                                                    onAddToCart={handleAddToCart}
                                                />
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
                    ) : (
                        /* Estado vacío */
                        <div className="text-center py-20">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-4">No se encontraron productos</h3>
                            <p className="text-gray-500 mb-6">
                                {searchTerm 
                                    ? `No hay productos que coincidan con &ldquo;${searchTerm}&rdquo;`
                                    : "No hay productos disponibles con los filtros seleccionados"
                                }
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSortBy('newest');
                                    setSelectedCategory('');
                                }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(180deg); }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }

                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </>
    );
}

export async function getServerSideProps() {
    try {
        await mongooseconnect();
        
        const [allProducts, categories] = await Promise.all([
            Product.find({}).populate('Categoria'), // Use correct field name with capital C
            Category.find({})
        ]);
        
        console.log('Server - Products count:', allProducts.length);
        console.log('Server - Categories count:', categories.length);
        if (allProducts.length > 0) {
            console.log('Server - First product keys:', Object.keys(allProducts[0]));
            console.log('Server - First product:', allProducts[0]);
        }
        
        return {
            props: {
                allProducts: JSON.parse(JSON.stringify(allProducts)),
                categories: JSON.parse(JSON.stringify(categories))
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                allProducts: [],
                categories: []
            }
        }
    }
}