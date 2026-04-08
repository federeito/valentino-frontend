import { CartContext } from "@/lib/CartContext";
import { CartButton, PriceDisplay } from "@/components/PriceDisplay";
import PromoBanner from "@/components/PromoBanner";
import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import Link from "next/link";
import Head from "next/head";
import { useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Products({ allProducts = [], categories = [] }) {
    const router = useRouter();
    const { addProduct } = useContext(CartContext);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [sortBy, setSortBy] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showActions, setShowActions] = useState({}); // New state for showing actions
    const productsPerPage = 24; // Mobile: 2 columns × 12 rows = 24, Desktop: 4 columns × 6 rows = 24

    // Determine the current base path (either /products or /accesorios-para-el-pelo)
    const isAccesoriosPath = router.pathname === '/products' && router.asPath.startsWith('/accesorios-para-el-pelo');
    const basePath = isAccesoriosPath ? '/accesorios-para-el-pelo' : '/products';

    // Set category from URL query parameter
    useEffect(() => {
        if (router.query.category) {
            const categoryName = decodeURIComponent(router.query.category);
            // Find the category ID by name
            const foundCategory = categories.find(cat => 
                cat.name.toLowerCase() === categoryName.toLowerCase()
            );
            if (foundCategory) {
                setSelectedCategory(foundCategory._id);
            }
        }
    }, [router.query.category, categories]);

    const getFilteredProducts = useCallback(() => {
        let filtered = allProducts || [];

        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.Título.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.Descripción.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(product => {
                const productCategory = product.Categoria;
                if (!productCategory) return false;
                if (typeof productCategory === 'object' && productCategory._id) {
                    return productCategory._id === selectedCategory;
                }
                return productCategory === selectedCategory;
            });
        }

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
            default:
                filtered.sort((a, b) => new Date(b._id) - new Date(a._id));
        }

        return filtered;
    }, [allProducts, searchTerm, sortBy, selectedCategory]);

    useEffect(() => {
        setVisibleProducts([]);
        const timer = setTimeout(() => {
            const filteredProducts = getFilteredProducts();
            const startIndex = (currentPage - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;
            const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
            
            currentPageProducts.forEach((_, index) => {
                setTimeout(() => {
                    setVisibleProducts(prev => [...prev, index]);
                }, index * 50);
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [getFilteredProducts, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy, selectedCategory]);

    const handleAddToCart = (productId, productTitle, productColors = null) => {
        // If product has colors, add the first available color
        if (productColors && productColors.length > 0) {
            const firstAvailableColor = productColors.find(color => color.available !== false);
            if (firstAvailableColor) {
                addProduct(productId, { color: firstAvailableColor });
                toast.success(`¡${productTitle} agregado al carrito en color ${firstAvailableColor.name}!`, {
                    style: {
                        background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
                        color: 'white',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                    },
                    duration: 3000,
                });
            } else {
                toast.error('No hay colores disponibles para este producto', {
                    style: {
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                    }
                });
            }
        } else {
            // Product without colors
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
        }
    };

    const filteredProducts = getFilteredProducts();
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentPageProducts = filteredProducts.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setVisibleProducts([]);
        // Scroll to top of products section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Head>
                <title>Valentino Accesorios | Accesorios para el Pelo por Mayor</title>
                <meta name="description" content="Catálogo mayorista de accesorios para el pelo: hebillas, clips, vinchas, peinetas y más. Precios por mayor, envíos a toda Argentina. ¡Más de 300 modelos exclusivos!" />
                <link rel="canonical" href="https://www.valentinoaccesorios.com.ar/accesorios-para-el-pelo" />
            </Head>
            <PromoBanner />
            {/* Background decorativo - Pastel colors */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-32 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-200/15 to-blue-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative min-h-screen w-full bg-gradient-to-br from-pink-50/30 to-blue-50/30 font-['Inter',_'Segoe_UI',_'system-ui',_'-apple-system',_sans-serif]">
                <div className="max-w-7xl mx-auto p-4 sm:p-6">
                    {/* ── Premium Hero Banner ── */}
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-8 sm:mb-12 border border-[#ede8e3] shadow-xl shadow-[#dc2626]/5"
                        style={{ background: "linear-gradient(160deg, #faf8f5 0%, #f5f0eb 100%)" }}>

                        {/* Decorative background blobs — warm tones */}
                        <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                            style={{ background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)" }} />
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                            style={{ background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)" }} />

                        {/* Subtle dot pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.035] pointer-events-none"
                            style={{
                                backgroundImage: `radial-gradient(circle, #1c1412 1px, transparent 1px)`,
                                backgroundSize: '24px 24px'
                            }}
                        />

                        <div className="relative z-10 px-4 py-8 sm:px-10 sm:py-14 md:py-16 text-center">

                            {/* Eyebrow label */}
                            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 sm:mb-5 shadow-sm"
                                style={{
                                    background: "rgba(220,38,38,0.10)",
                                    border: "1px solid rgba(220,38,38,0.20)"
                                }}>
                                <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: "#dc2626" }} />
                                <span className="font-medium tracking-widest uppercase"
                                    style={{ color: "#dc2626", fontSize: "clamp(9px, 2.2vw, 11px)" }}>
                                    Catálogo Mayorista · Temporada 2026
                                </span>
                            </div>

                            {/* H1 */}
                            <h1
                                className="font-light leading-[1.15] mb-3 sm:mb-4"
                                style={{
                                    fontFamily: "var(--font-cormorant), Georgia, serif",
                                    fontSize: "clamp(28px, 7vw, 64px)",
                                    color: "#1c1412",
                                }}
                            >
                                Accesorios para el Pelo
                                <br />
                                <em
                                    className="not-italic"
                                    style={{
                                        fontStyle: "italic",
                                        background: "linear-gradient(135deg, #dc2626, #ec4899)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                    }}
                                >
                                    por Mayor
                                </em>
                            </h1>

                            {/* Accent rule */}
                            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
                                <div className="w-10 sm:w-20 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(220,38,38,0.35))" }} />
                                <div className="w-6 sm:w-8 h-1 rounded-full" style={{ background: "linear-gradient(135deg, #dc2626, #ec4899)" }} />
                                <div className="w-10 sm:w-20 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(220,38,38,0.35))" }} />
                            </div>

                            {/* SEO subtitle */}
                            <p className="max-w-xl mx-auto font-light tracking-wide leading-relaxed mb-5 sm:mb-7 px-2"
                                style={{ color: "rgba(28,20,18,0.65)", fontSize: "clamp(12px, 3vw, 18px)" }}>
                                Hebillas, Broches, Vinchas, Peinetas y más accesorios para el cabello.{' '}
                                <span className="font-medium" style={{ color: "#1c1412" }}>Precios mayoristas</span>{' '}
                                con envíos a toda Argentina.
                            </p>

                            {/* Category quick-filter strip — scrollable on mobile, wrap on desktop */}
                            {categories.length > 0 && (
                                <div className="relative">

                                    {/* Mobile: horizontally scrollable */}
                                    <div
                                        className="flex sm:hidden gap-2 overflow-x-auto py-1"
                                        style={{
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none',
                                            WebkitOverflowScrolling: 'touch',
                                            paddingLeft: '4px',
                                            paddingRight: '32px', // room for right fade
                                        }}
                                    >
                                        {[{ _id: '', name: 'Todos' }, ...categories].map(cat => (
                                            <button
                                                key={cat._id}
                                                onClick={() => {
                                                    setSelectedCategory(cat._id);
                                                    if (cat._id !== '') setCurrentPage(1);
                                                }}
                                                className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap"
                                                style={selectedCategory === cat._id
                                                    ? { background: "linear-gradient(135deg,#dc2626,#ec4899)", color: "#fff", border: "1px solid transparent", boxShadow: "0 4px 12px rgba(220,38,38,0.25)" }
                                                    : { background: "rgba(28,20,18,0.05)", color: "rgba(28,20,18,0.75)", border: "1px solid rgba(28,20,18,0.12)" }
                                                }
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Left + right fade edges on mobile */}
                                    <div className="sm:hidden absolute inset-y-0 left-0 w-4 pointer-events-none"
                                        style={{ background: "linear-gradient(to left, transparent, rgba(250,248,245,0.95))" }} />
                                    <div className="sm:hidden absolute inset-y-0 right-0 w-8 pointer-events-none"
                                        style={{ background: "linear-gradient(to right, transparent, rgba(250,248,245,0.95))" }} />

                                    {/* Desktop: wrap */}
                                    <div className="hidden sm:flex flex-wrap justify-center gap-2">
                                        {[{ _id: '', name: 'Todos' }, ...categories].map(cat => (
                                            <button
                                                key={cat._id}
                                                onClick={() => {
                                                    setSelectedCategory(cat._id);
                                                    if (cat._id !== '') setCurrentPage(1);
                                                }}
                                                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                                                style={selectedCategory === cat._id
                                                    ? { background: "linear-gradient(135deg,#dc2626,#ec4899)", color: "#fff", border: "1px solid transparent", boxShadow: "0 4px 12px rgba(220,38,38,0.25)" }
                                                    : { background: "rgba(28,20,18,0.05)", color: "rgba(28,20,18,0.75)", border: "1px solid rgba(28,20,18,0.12)" }
                                                }
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom shimmer strip */}
                        <div className="absolute bottom-0 left-0 right-0 h-px"
                            style={{ background: "linear-gradient(to right, transparent, rgba(220,38,38,0.3), transparent)" }} />
                    </div>
                    {/* ── end Premium Hero Banner ── */}

                    {/* Barra de búsqueda y filtros - Minimalist Compact Design */}
                    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-gray-100 p-3 sm:p-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            {/* Barra de búsqueda - Compact */}
                            <div className="relative flex-1 min-w-0">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 transition-all"
                                />
                            </div>

                            {/* Filtros - Compact horizontal layout */}
                            <div className="flex gap-2 sm:gap-3">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="flex-1 sm:w-40 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 transition-all"
                                >
                                    <option value="">Todas</option>
                                    {Array.isArray(categories) && categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex-1 sm:w-40 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 transition-all"
                                >
                                    <option value="newest">Más nuevos</option>
                                    <option value="price-low">Precio ↑</option>
                                    <option value="price-high">Precio ↓</option>
                                    <option value="name">A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Resultados - Ultra compact */}
                        {(searchTerm || selectedCategory || filteredProducts.length !== allProducts.length) && (
                            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                <span>
                                    {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                                    {totalPages > 1 && ` • Pág. ${currentPage}/${totalPages}`}
                                </span>
                                {(searchTerm || selectedCategory) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('');
                                            setCurrentPage(1);
                                        }}
                                        className="text-red-500 hover:text-red-600 font-medium transition-colors"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Grid de productos - Mobile: 2 columns, Desktop: up to 4 columns */}
                    {currentPageProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                {currentPageProducts.map((product, index) => {
                                    const productImages = product.Imagenes?.slice(0, 12) || [];
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
                                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-pink-200/20 hover:shadow-2xl hover:shadow-blue-200/30 border-2 border-transparent hover:border-blue-200 transition-all duration-500 hover:scale-105 overflow-hidden">
                                                {/* Container de imagen con carousel */}
                                                <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-blue-50">
                                                    {/* Current image display */}
                                                    <img 
                                                        src={productImages[currentIndex] || product.Imagenes[0]} 
                                                        alt={`${product.Título} - Vista ${currentIndex + 1}`} 
                                                        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 p-2 sm:p-4" 
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
                                                                className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-1 sm:p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg shadow-blue-200/30 z-20"
                                                            >
                                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-1 sm:p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg shadow-blue-200/30 z-20"
                                                            >
                                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* Overlay con gradiente pastel */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-pink-200/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                    {/* Badge de stock */}
                                                    {!product.stock && (
                                                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                                            <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                                                                ¡Agotado!
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Quick view - Eye icon preserved */}
                                                    <Link href={`/accesorios-para-el-pelo/${product._id}`}>
                                                        <button className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg shadow-blue-200/30 z-10">
                                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                    </Link>

                                                    {/* Image navigation dots - bottom center when hovered */}
                                                    {productImages.length > 1 && hoveredProduct === product._id && (
                                                        <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                                                            {productImages.map((_, imgIndex) => (
                                                                <button
                                                                    key={imgIndex}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setCurrentImageIndex(prev => ({ ...prev, [product._id]: imgIndex }));
                                                                    }}
                                                                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                                                                        imgIndex === currentIndex 
                                                                            ? 'bg-red-500 scale-125' 
                                                                            : 'bg-white/60 hover:bg-white/80'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Información del producto */}
                                                <div className="p-2 sm:p-3 md:p-4 border-t border-pink-100">
                                                <Link href={`/accesorios-para-el-pelo/${product._id}`}>
                                                        <h3 className="text-sm sm:text-base md:text-lg font-normal tracking-wide text-gray-800 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 sm:truncate mb-2 font-['Inter',_'system-ui',_sans-serif]">
                                                            {product.Título}
                                                        </h3>
                                                    </Link>

                                                    {/* Product Code */}
                                                    <div className="mb-2 sm:mb-3">
                                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                                                            COD. {product.código || 'N/A'}
                                                        </span>
                                                    </div>

                                                    {/* Color availability indicator - Simplified for mobile */}
                                                    {product.colors && product.colors.length > 0 && (
                                                        <div className="mb-2 sm:mb-3">
                                                            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                                                                <span className="text-xs font-medium text-gray-600">Colores:</span>
                                                                <div className="flex gap-0.5 sm:gap-1">
                                                                    {product.colors.slice(0, 3).map((color, colorIndex) => {
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
                                                                    {product.colors.length > 3 && (
                                                                        <span className="text-xs text-gray-500 ml-1">
                                                                            +{product.colors.length - 3}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {product.colors.some(color => color.available === false) && (
                                                                <div className="text-xs text-amber-600 font-medium">
                                                                    <span className="hidden sm:inline">⚠️ Algunos colores agotados</span>
                                                                    <span className="sm:hidden">⚠️ Colores agotados</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Precio con control de visibilidad - Use proper PriceDisplay */}
                                                    <div className="mb-3 sm:mb-4">
                                                        <PriceDisplay 
                                                            price={product.Precio} 
                                                            size="small"
                                                            className="text-gray-800 text-sm sm:text-base"
                                                            showUnit={true}
                                                        />
                                                    </div>

                                                    {/* Botones - Icon trigger with expandable actions */}
                                                    {!product.stock ? (
                                                        // Out of stock - show disabled button directly
                                                        <button
                                                            disabled
                                                            className="w-full py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base bg-gray-200 text-gray-500 cursor-not-allowed"
                                                        >
                                                            Sin Stock
                                                        </button>
                                                    ) : !showActions[product._id] ? (
                                                        // In stock - show shopping bag icon circular and compact
                                                        <button
                                                            onClick={() => {
                                                                // If product has only one color or no colors, add directly to cart
                                                                if (!product.colors || product.colors.length <= 1) {
                                                                    handleAddToCart(product._id, product.Título, product.colors);
                                                                } else {
                                                                    // If multiple colors, show action buttons
                                                                    setShowActions(prev => ({ ...prev, [product._id]: true }));
                                                                }
                                                            }}
                                                            className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gray-600 text-white rounded-full font-semibold hover:bg-black transition-all duration-300 hover:scale-110 flex items-center justify-center"
                                                        >
                                                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        // Expanded actions - only for products with multiple colors
                                                        <div className="space-y-2">
                                                            <Link href={`/accesorios-para-el-pelo/${product._id}`}>
                                                                <button className="w-full bg-pink-50 border-2 border-pink-300 text-pink-600 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-pink-100 hover:border-pink-400 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-300/30 transition-all duration-300 flex items-center justify-center gap-2">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                                                    </svg>
                                                                    Seleccionar color
                                                                </button>
                                                            </Link>
                                                            <Link href={`/accesorios-para-el-pelo/${product._id}`}>
                                                                <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2">
                                                                    Ver más detalles
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    )}

                                                </div>

                                                {/* Glow effect on hover - Pastel */}
                                                <div className={`absolute inset-0 rounded-xl sm:rounded-2xl transition-opacity duration-300 ${
                                                    hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'
                                                } bg-gradient-to-r from-pink-200/5 via-blue-200/5 to-purple-200/5 pointer-events-none`} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination Controls - Mobile responsive */}
                            {totalPages > 1 && (
                                <div className="mt-6 sm:mt-8 md:mt-12 flex justify-center">
                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                        {/* Previous button */}
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                                                currentPage === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200'
                                            }`}
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        {/* Page numbers - Show fewer on mobile */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                            // Show first page, last page, current page, and pages around current
                                            // On mobile, show even fewer pages
                                            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                                            const showPage = page === 1 || page === totalPages || 
                                                           (page >= currentPage - (isMobile ? 0 : 1) && page <= currentPage + (isMobile ? 0 : 1));
                                            
                                            if (!showPage) {
                                                // Show ellipsis
                                                if (page === currentPage - (isMobile ? 1 : 2) || page === currentPage + (isMobile ? 1 : 2)) {
                                                    return (
                                                        <span key={page} className="px-1 sm:px-2 py-1.5 sm:py-2 text-gray-400 text-xs sm:text-sm">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            }

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                                                        currentPage === page
                                                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                                                            : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}

                                        {/* Next button */}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                                                currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200'
                                            }`}
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Estado vacío */
                        <div className="text-center py-16 sm:py-20">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-pink-100 to-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-light text-gray-700 mb-2 sm:mb-4 tracking-wide font-['Inter',_'system-ui',_sans-serif]">No se encontraron productos</h3>
                            <p className="text-gray-500 mb-4 sm:mb-6 px-4 font-light tracking-wide">
                                {searchTerm 
                                    ? `No hay productos que coincidan con "${searchTerm}"`
                                    : "No hay productos disponibles con los filtros seleccionados"
                                }
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSortBy('newest');
                                    setSelectedCategory('');
                                    setCurrentPage(1);
                                }}
                                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps() {
    try {
        await mongooseconnect();
        
        const [allProducts, categories] = await Promise.all([
            Product.find({}).populate('Categoria').lean(),
            Category.find({}).lean()
        ]);
        
        // Optimize products data to reduce payload size
        const optimizedProducts = allProducts.map(product => ({
            _id: product._id.toString(),
            Título: product.Título,
            Descripción: product.Descripción,
            Precio: product.Precio,
            código: product.código,
            stock: product.stock,
            Categoria: product.Categoria ? {
                _id: product.Categoria._id.toString(),
                name: product.Categoria.name
            } : null,
            // Limit images to first 12 and only send URLs
            Imagenes: (product.Imagenes || []).slice(0, 12),
            // Only send color name, code, and availability
            colors: (product.colors || []).map(color => ({
                name: color.name,
                code: color.code,
                available: color.available !== false
            }))
        }));
        
        const optimizedCategories = categories.map(cat => ({
            _id: cat._id.toString(),
            name: cat.name
        }));
        
        return {
            props: {
                allProducts: optimizedProducts,
                categories: optimizedCategories
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