import { CartContext } from "@/lib/CartContext";
import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useContext } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function ProductPage({ product }) {
    const { addProduct, removeProduct, cartProducts } = useContext(CartContext);
    
    const countInCart = cartProducts.filter(id => id === product._id).length;

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
                                <img src={image} alt="product-image" className="w-full h-full object-cover object-center border border-primary rounder-lg" />
                            </div>
                        ))}
                    </div>

                    <div className="px-4 pt-8 md:pt-0 sm:px-0 lg:col-span-1">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                            {product.Título}
                        </h1>

                        <div className="mt-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Descripción
                            </h2>
                            <p className="mt-2 text-gray-700">
                                {product.Descripción}
                            </p>
                        </div>
                        
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Precio
                            </h2>
                            <p className="mt-2 text-primary font-semibold text-lg">
                                $ {formatPrice(product.Precio)} c/u
                            </p>
                        </div>
                        
                        {product.stock > 0 ? (
                            <div className="mt-6">
                                <div className="flex items-center justify-between text-center w-full">
                                    <button 
                                        onClick={() => removeProduct(product._id)}
                                        disabled={countInCart === 0}
                                        className={`rounded-full px-5 py-3 text-2xl text-text transition w-1/4
                                            ${countInCart === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-secondary hover:bg-purple-300'}`}
                                    >
                                        -
                                    </button>
                                    <span className="text-2xl font-bold text-gray-800 w-1/2">{countInCart}</span>
                                    <button 
                                        onClick={() => {
                                            addProduct(product._id); 
                                            toast.success("Producto agregado");
                                        }}
                                        disabled={countInCart >= product.stock}
                                        className={`rounded-full px-5 py-3 text-2xl text-text transition w-1/4
                                            ${countInCart >= product.stock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-secondary hover:bg-purple-300'}`}
                                    >
                                        +
                                    </button>
                                </div>
                                {countInCart >= product.stock && (
                                    <p className="text-red-500 font-bold mt-2 text-center">¡Límite de stock alcanzado!</p>
                                )}
                            </div>
                        ) : (
                            <>
                                <p className="text-red-500 font-bold mt-4 text-center">
                                    ¡Producto sin stock!
                                </p>
                                <div className="text-center w-full mt-6">
                                    <button 
                                        disabled 
                                        className="block rounded bg-gray-300 text-gray-500 px-5 py-3 text-md cursor-not-allowed w-full"
                                    >
                                        Agregar al Carrito
                                    </button>
                                </div>
                            </>
                        )}
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
            product: JSON.parse(JSON.stringify(product))
        }
    }
}