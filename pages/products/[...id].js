import { CartContext } from "@/lib/CartContext";
import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useContext } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

};

export default function ProductPage({ product }) {
    const { addProduct } = useContext(CartContext);
    if (product) {
        return <>
            <section className="mt-20 md:mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:aspect-h-2 lg:aspect-w-2 lg:rounded-lg overflow-hidden px-4 md:px-2">
                        <img src={product.Imagenes[0]} alt="product-image" className="w-full h-full md:h-[90vh] object-cover object-center
                         border border-primary rounder-lg" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid lg:grid-cols-1 lg:gap-y-4 px-2 gap-2 md:gap-0 md:px-2">
                        {product.Imagenes.slice(1, 3).map((image, index) => (
                            <div className="lg:aspect-h-2 lg:aspect-w-3 lg:rounded-lg lg:overflow-hidden" key={index}>
                                <img src={image} alt="product-image" className="w-full h-full md:h-[44vh] object-cover object-center
                                border border-secondary rounder-lg p-4" />
                            </div>
                        ))}
                    </div>
                    <div className="p-4 lg:p-8 border">
                        <h1 className="text-3xl font-semibold text-text">
                            {product.Título}
                        </h1>
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">
                                Descripción
                            </h2>
                            <p className="mt-2 text-gray-700">
                                {product.Descripción}
                            </p>
                        </div>

                        {/* product details */}
                        {/*<div className="mt-6">
                        <h2 className="text-xl font-semibold">
                                Detalles
                            </h2>
                            <p className="mt-2 text-gray-700">
                                {product.Detalles}
                            </p>
                        </div> */}

                        <div className="mt-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Precio
                            </h2>

                            <p className="mt-2 text-primary font-semibold text-lg">
                                $ {formatPrice(product.Precio)} c/u
                            </p>
                        </div>
                        <div class="text-center w-full mt-6">
                            <button onClick={() => {
                                addProduct(product._id); toast.success("Producto agregado al carrito")
                            }} className="block rounded bg-secondary px-5 py-3 text-md text-text
                             transition hover:bg-purple-300 w-full">Agregar al Carrito</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    }
}

export async function getServerSideProps(context) {
    await mongooseconnect();
    const { id } = context.query;
    const product = await Product.findById(id);
    return {
        props: {
            Product: JSON.parse(JSON.stringify(product))
        }
    }
}