import Collection from "@/components/Collection";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import PromoBanner from "@/components/PromoBanner";
import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useEffect, useState } from "react";

export default function Home({ featuredProducts, newProducts, collectionProduct }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <>
            <PromoBanner />
            {/* Subtle background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-white to-red-50/20" />
            
            <div className={`min-h-screen transform transition-all duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
                {/* Hero Section */}
                <Hero featuredProducts={featuredProducts} />

                {/* Products Section */}
                <section className="py-8 sm:py-10 lg:py-16">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
                                Nuevos Productos
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            Descubrí nuestra última colección, seleccionada especialmente para potenciar tu negocio
                            </p>
                            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mt-4 sm:mt-6 rounded-full" />
                        </div>
                        <Products products={newProducts} />
                    </div>
                </section>

                {/* Divider */}
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="border-t border-gray-200" />
                </div>

                {/* Collection Section */}
                <section className="py-8 sm:py-10 lg:py-16">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
                                Colección Especial
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            Productos exclusivos que combinan elegancia y distinción
                            </p>
                            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mt-4 sm:mt-6 rounded-full" />
                        </div>
                        <Collection product={collectionProduct} />
                    </div>
                </section>
            </div>

            <style jsx>{`
                html {
                    scroll-behavior: smooth;
                }
            `}</style>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseconnect();

    const featuredId1 = '68ab998313094de877cae019';
    const featuredId2 = '68ab993013094de877cadff7';
    const featuredId3 = '68aba14f06a44779c3754538'; // Add third featured product
    const collectionId = '68aba14f06a44779c3754538';

    const featuredProduct1 = await Product.findById(featuredId1);
    const featuredProduct2 = await Product.findById(featuredId2);
    const featuredProduct3 = await Product.findById(featuredId3);
    const collectionProduct = await Product.findById(collectionId);
    const newProducts = await Product.find({}, null, { sort: { '_id': -1 }, limit: 5 });

    return {
        props: {
            featuredProducts: JSON.parse(JSON.stringify([featuredProduct1, featuredProduct2, featuredProduct3].filter(Boolean))),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
            collectionProduct: JSON.parse(JSON.stringify(collectionProduct)),
        }
    };
}