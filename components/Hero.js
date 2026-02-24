import { CartContext } from "@/lib/CartContext";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Hero({ product, secondProduct, featuredProducts = [] }) {
    const { addProduct } = useContext(CartContext);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [progress, setProgress] = useState(0);

    // Cloudinary promotional images
    const cloudinarySlides = [
        {
            _id: 'cloudinary-1',
            images: [
                'https://res.cloudinary.com/djuk4a84p/image/upload/v1771850485/1_c2bcoc.jpg',
                'https://res.cloudinary.com/djuk4a84p/image/upload/v1771850496/2_i7caob.jpg'
            ],
            isPromo: true
        },
        {
            _id: 'cloudinary-2',
            images: [
                'https://res.cloudinary.com/djuk4a84p/image/upload/v1771892025/Captura_de_pantalla_2026-02-23_211231_v6smc7.jpg',
                'https://res.cloudinary.com/djuk4a84p/image/upload/v1771645925/foto2_ef7hxd.jpg'
            ],
            isPromo: true
        }
    ];

    // Combine products and cloudinary images
    const productSlides = featuredProducts.length > 0 ? featuredProducts : [product, secondProduct].filter(Boolean);
    const slides = [...productSlides, ...cloudinarySlides];
    const currentSlide_item = slides[currentSlide];
    const currentProduct = currentSlide_item?.isPromo ? productSlides[0] : currentSlide_item;

    useEffect(() => {
        let progressValue = 0;
        
        const progressInterval = setInterval(() => {
            progressValue += (100 / 50); // 5000ms / 100 steps
            if (progressValue >= 100) {
                progressValue = 100;
            }
            setProgress(progressValue);
        }, 100);

        const slideInterval = setInterval(() => {
            if (!isAnimating) {
                setIsAnimating(true);
                setProgress(0);
                progressValue = 0;
                setCurrentSlide((prev) => (prev + 1) % slides.length);
                setTimeout(() => setIsAnimating(false), 700);
            }
        }, 5000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(slideInterval);
        };
    }, [currentSlide, slides.length, isAnimating]);

    function goToSlide(index) {
        if (!isAnimating && index !== currentSlide) {
            setIsAnimating(true);
            setProgress(0);
            setCurrentSlide(index);
            setTimeout(() => setIsAnimating(false), 700);
        }
    }

    function addItemToCart() {
        addProduct(currentProduct._id);
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

    if (!currentProduct) return null;

    return (
        <div className="relative bg-gradient-to-br from-gray-50 via-white to-red-50/30 overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #dc2626 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />

            {/* Carousel Container */}
            <div className="relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
                    {/* Check if current slide is promotional */}
                    {currentSlide_item?.isPromo ? (
                        /* Full-width promotional image */
                        <div className="relative">
                            <div className="relative w-full h-[500px] sm:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl bg-white">
                                {slides.map((slide, index) => (
                                    slide.isPromo && (
                                        <div
                                            key={slide._id}
                                            className={`absolute inset-0 transition-all duration-700 ${
                                                index === currentSlide
                                                    ? 'opacity-100 scale-100'
                                                    : 'opacity-0 scale-105'
                                            }`}
                                        >
                                            {/* Stack vertically on mobile, side by side on larger screens */}
                                            <div className="flex flex-col sm:flex-row h-full gap-0 w-full">
                                                {slide.images.map((img, imgIndex) => (
                                                    <div key={imgIndex} className="flex-1 h-full min-w-0 min-h-0">
                                                        <img
                                                            src={img}
                                                            alt={`Promotional Image ${imgIndex + 1}`}
                                                            className="w-full h-full object-cover object-center"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                
                                {/* CTA Button Overlay */}
                                <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-0 right-0 flex justify-center px-4">
                                    <div className="text-center w-full">
                                        <Link 
                                            href="/products"
                                            className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-4 rounded-xl font-semibold text-gray-900 bg-white/95 backdrop-blur-md shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:scale-105 active:scale-95 text-xs sm:text-base border border-gray-200/50"
                                        >
                                            Explorar la Colección
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Product layout with content and image */
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                            {/* Content - Animated */}
                            <div className="space-y-6 sm:space-y-8 relative z-10">
                                {slides.map((slide, index) => {
                                    if (slide.isPromo) return null;
                                    
                                    return (
                                        <div
                                            key={slide._id}
                                            className={`transition-all duration-700 ${
                                                index === currentSlide
                                                    ? 'opacity-100 translate-x-0'
                                                    : 'opacity-0 translate-x-10 absolute inset-0 pointer-events-none'
                                            }`}
                                        >
                                            {/* Title */}
                                            <div className="space-y-3 sm:space-y-4">
                                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                                                    {slide.Título}
                                                </h1>
                                                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
                                            </div>

                                            {/* Description */}
                                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mt-6">
                                                {slide.Descripción}
                                            </p>

                                            {/* CTA Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
                                                <button 
                                                    onClick={addItemToCart}
                                                    className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                        </svg>
                                                        Añadir al Carrito
                                                    </span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </button>

                                                <Link 
                                                    href="/products"
                                                    className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-red-500 hover:text-red-600 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
                                                >
                                                    Ver Todo
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </Link>
                                            </div>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-4 sm:gap-6 pt-6 border-t border-gray-200 mt-8">
                                                {[
                                                    { icon: '🚚', text: 'Envío Gratis' },
                                                    { icon: '🔒', text: 'Pago Seguro' },
                                                ].map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                        <span className="text-base sm:text-lg">{feature.icon}</span>
                                                        <span className="font-medium">{feature.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Image - Animated */}
                            <div className="relative">
                                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                    {slides.map((slide, index) => (
                                        !slide.isPromo && (
                                            <img
                                                key={slide._id}
                                                src={slide.Imagenes?.[0]}
                                                alt={slide.Título}
                                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                                                    index === currentSlide
                                                        ? 'opacity-100 scale-100'
                                                        : 'opacity-0 scale-105'
                                                }`}
                                            />
                                        )
                                    ))}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress Indicators - Samsung Style */}
                    {slides.length > 1 && (
                        <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className="relative h-1 rounded-full overflow-hidden transition-all duration-300 group"
                                    style={{ width: index === currentSlide ? '48px' : '24px' }}
                                    aria-label={`Go to slide ${index + 1}`}
                                >
                                    <div className="absolute inset-0 bg-gray-300" />
                                    {index === currentSlide ? (
                                        <div 
                                            className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500"
                                            style={{ 
                                                width: `${progress}%`,
                                                transition: 'width 0.1s linear'
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}