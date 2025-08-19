import { CartContext } from "@/lib/CartContext";
import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Products({ allProducts }) {
    const { addProduct } = useContext(CartContext);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high', 'name'
    const [searchTerm, setSearchTerm] = useState('');

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
    }, [allProducts, sortBy, searchTerm]);

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

    const getFilteredProducts = () => {
        let filtered = allProducts || [];

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.Título.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.Descripción.toLowerCase().includes(searchTerm.toLowerCase())
            );
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
                                <span>Resultados para "<strong>{searchTerm}</strong>": </span>
                            )}
                            <span className="font-semibold">{filteredProducts.length} producto(s) encontrado(s)</span>
                        </div>
                    </div>

                    {/* Grid de productos */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {filteredProducts.map((product, index) => (
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
                                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 border-2 border-transparent hover:border-primary/20 transition-all duration-500 hover:scale-105 overflow-hidden">
                                        {/* Container de imagen */}
                                        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                                            <img 
                                                src={product.Imagenes[0]} 
                                                alt={product.Título} 
                                                className="absolute inset-0 w-full h-full object-contain opacity-100 group-hover:opacity-0 transition-opacity duration-500 p-4" 
                                            />
                                            <img 
                                                src={product.Imagenes[1]} 
                                                alt={product.Título} 
                                                className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4" 
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

                                            {/* Quick view */}
                                            <Link href={`/products/${product._id}`}>
                                                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg">
                                                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </Link>
                                        </div>

                                        {/* Información del producto */}
                                        <div className="p-4">
                                            <Link href={`/products/${product._id}`}>
                                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300 truncate mb-2">
                                                    {product.Título}
                                                </h3>
                                            </Link>

                                            {/* Precio */}
                                            <div className="mb-4">
                                                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                                    ${formatPrice(product.Precio)}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-1">c/u</span>
                                            </div>

                                            {/* Botones */}
                                            {product.stock > 0 ? (
                                                <button
                                                    onClick={() => handleAddToCart(product._id, product.Título)}
                                                    className="w-full group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4 transition-transform group-hover/btn:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                                                        </svg>
                                                        Agregar al Carrito
                                                    </span>
                                                    {/* Shimmer effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-100 px-6 py-3 text-center text-sm font-bold text-gray-400 cursor-not-allowed"
                                                >
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Sin Stock
                                                    </span>
                                                </button>
                                            )}
                                        </div>

                                        {/* Glow effect on hover */}
                                        <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                                            hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'
                                        } bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 pointer-events-none`} />
                                    </div>
                                </div>
                            ))}
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
                                    ? `No hay productos que coincidan con "${searchTerm}"`
                                    : "No hay productos disponibles con los filtros seleccionados"
                                }
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSortBy('newest');
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
    await mongooseconnect();
    const allProducts = await Product.find({}, null, { sort: { _id: 1 } });
    return {
        props: {
            allProducts: JSON.parse(JSON.stringify(allProducts))
        }
    }
}