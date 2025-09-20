import Collection from "@/components/Collection";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useEffect, useState } from "react";

export default function Home({ featuredProducts, newProducts, collectionProduct }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    // Seguimiento del mouse para efectos interactivos
    useEffect(() => {
        setIsVisible(true);
        
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            {/* Dynamic animated background - Pastel theme */}
            <div className="fixed inset-0 -z-20 overflow-hidden">
                {/* Base gradient - Soft pastels */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/80 via-blue-50/60 to-purple-50/40" />
                
                {/* Interactive orbs that follow mouse - Pastel colors */}
                <div 
                    className="absolute w-96 h-96 bg-gradient-to-br from-blue-200/25 to-purple-200/25 rounded-full blur-3xl transition-all duration-1000 ease-out"
                    style={{
                        left: `${mousePosition.x * 0.1}%`,
                        top: `${mousePosition.y * 0.1}%`,
                        transform: `translate(-50%, -50%)`
                    }}
                />
                <div 
                    className="absolute w-80 h-80 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-3xl transition-all duration-1500 ease-out"
                    style={{
                        right: `${mousePosition.x * 0.05}%`,
                        bottom: `${mousePosition.y * 0.05}%`,
                        transform: `translate(50%, 50%)`
                    }}
                />
                <div 
                    className="absolute w-64 h-64 bg-gradient-to-br from-cyan-200/15 to-teal-200/15 rounded-full blur-3xl transition-all duration-2000 ease-out"
                    style={{
                        left: `${50 + mousePosition.x * 0.02}%`,
                        top: `${30 + mousePosition.y * 0.03}%`,
                        transform: `translate(-50%, -50%)`
                    }}
                />

                {/* Static decorative elements - Soft pastels */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-violet-200/15 to-purple-200/15 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-br from-rose-200/15 to-pink-200/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-emerald-200/15 to-green-200/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Geometric pattern overlay - Softer */}
                <div className="absolute inset-0 opacity-3">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            radial-gradient(circle at 25% 25%, #cbd5e1 2px, transparent 2px),
                            radial-gradient(circle at 75% 75%, #d8b4fe 2px, transparent 2px)
                        `,
                        backgroundSize: '60px 60px'
                    }} />
                </div>

                {/* Floating particles - Pastel colors */}
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-20 animate-float-slow"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>

            {/* Main content with fade-in animation */}
            <div className={`relative z-10 transform transition-all duration-1000 font-['Inter',_'Segoe_UI',_'system-ui',_'-apple-system',_sans-serif] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
                {/* Hero Section */}
                <section className="relative">
                    <Hero product={featuredProducts[0]} secondProduct={featuredProducts[1]} />
                </section>

                {/* Elegant divider with pastel gradient */}
                <div className="relative my-16">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <div className="bg-white px-6 py-2 rounded-full shadow-lg border border-pink-100">
                            <div className="w-12 h-1 bg-gradient-to-r from-pink-300 via-rose-300 to-red-400 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <section className="relative">
                    <div className="container mx-auto px-6">
                        {/* Section header */}
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-light bg-gradient-to-r from-slate-700 via-gray-800 to-slate-700 bg-clip-text text-transparent mb-4 tracking-wide font-['Inter',_'system-ui',_sans-serif]">
                                Nuevos Productos
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light tracking-wide">
                                Descubre nuestra última colección de productos seleccionados especialmente para ti
                            </p>
                            <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-rose-300 mx-auto mt-4 rounded-full"></div>
                        </div>
                    </div>
                    
                    <Products products={newProducts} />
                </section>

                {/* Elegant divider */}
                <div className="relative my-16">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <div className="bg-white px-6 py-2 rounded-full shadow-lg border border-blue-100">
                            <div className="w-12 h-1 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Collection Section */}
                <section className="relative">
                    <div className="container mx-auto px-6">
                        {/* Section header */}
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-light bg-gradient-to-r from-slate-700 via-gray-800 to-slate-700 bg-clip-text text-transparent mb-4 tracking-wide font-['Inter',_'system-ui',_sans-serif]">
                                Colección Especial
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light tracking-wide">
                                Una selección única de productos premium que definen elegancia y estilo
                            </p>
                            <div className="w-24 h-1 bg-gradient-to-r from-purple-300 to-pink-300 mx-auto mt-4 rounded-full"></div>
                        </div>
                    </div>
                    
                    <Collection product={collectionProduct} />
                </section>

                {/* Bottom decoration - Pastel theme */}
                <div className="relative mt-20 mb-10">
                    <div className="flex justify-center">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-3 h-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px) rotate(0deg); 
                        opacity: 0.2;
                    }
                    25% { 
                        transform: translateY(-20px) translateX(10px) rotate(90deg); 
                        opacity: 0.4;
                    }
                    50% { 
                        transform: translateY(-10px) translateX(-5px) rotate(180deg); 
                        opacity: 0.2;
                    }
                    75% { 
                        transform: translateY(-30px) translateX(-10px) rotate(270deg); 
                        opacity: 0.4;
                    }
                }
                
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }

                @keyframes gradient-shift {
                    0%, 100% { 
                        background-position: 0% 50%; 
                    }
                    50% { 
                        background-position: 100% 50%; 
                    }
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient-shift 3s ease infinite;
                }

                /* Smooth scrolling */
                html {
                    scroll-behavior: smooth;
                }

                /* Custom scrollbar - Pastel theme */
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #fdf2f8;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #f9a8d4, #fda4af);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #f472b6, #fb7185);
                }
            `}</style>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseconnect();

    const featuredId1 = '68ab98dc13094de877cadfdd';
    const featuredId2 = '68ab993013094de877cadff7';
    const collectionId = '68aba14f06a44779c3754538';

    const featuredProduct1 = await Product.findById(featuredId1);
    const featuredProduct2 = await Product.findById(featuredId2);
    const collectionProduct = await Product.findById(collectionId);
    const newProducts = await Product.find({}, null, { sort: { '_id': 1 }, limit: 5 });

    return {
        props: {
            featuredProducts: JSON.parse(JSON.stringify([featuredProduct1, featuredProduct2])),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
            collectionProduct: JSON.parse(JSON.stringify(collectionProduct)),
        }
    };
}