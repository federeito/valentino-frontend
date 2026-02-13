import Collection from "@/components/Collection";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
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
            {/* Subtle background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-white to-red-50/20" />
            
            <div className={`min-h-screen transform transition-all duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
                {/* Hero Section */}
                <Hero product={featuredProducts[0]} secondProduct={featuredProducts[1]} />

                {/* Products Section */}
                <section className="py-12 lg:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Nuevos Productos
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Descubrí nuestra última colección, seleccionada especialmente para potenciar tu negocio
                            </p>
                            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mt-6 rounded-full" />
                        </div>
                        <Products products={newProducts} />
                    </div>
                </section>

                {/* Divider */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="border-t border-gray-200" />
                </div>

                {/* Collection Section */}
                <section className="py-12 lg:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Colección Especial
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Productos exclusivos que combinan elegancia y distinción
                            </p>
                            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mt-6 rounded-full" />
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

    const featuredId1 = '68ab98dc13094de877cadfdd';
    const featuredId2 = '68ab993013094de877cadff7';
    const collectionId = '68aba14f06a44779c3754538';

    const featuredProduct1 = await Product.findById(featuredId1);
    const featuredProduct2 = await Product.findById(featuredId2);
    const collectionProduct = await Product.findById(collectionId);
    const newProducts = await Product.find({}, null, { sort: { '_id': -1 }, limit: 5 });

    return {
        props: {
            featuredProducts: JSON.parse(JSON.stringify([featuredProduct1, featuredProduct2])),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
            collectionProduct: JSON.parse(JSON.stringify(collectionProduct)),
        }
    };
}