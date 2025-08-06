import { CartContext } from "@/lib/CartContext";
import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Link from "next/link";
import { useContext } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Products({ allProducts }) {
    const { addProduct } = useContext(CartContext);
    return <>
        <div className="flex justify-center min-h-screen w-full p-4">
            <div className="grid grid-cols-2 gap-x-3 md:gap-x-6 gap-y-10 sm:grid-cols-2
            lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 xl:gap-x-8 px-2">
                {allProducts?.length > 0 && allProducts.map((product) => (
                    <div key={product._id}>
                        <div className="group block overflow-hidden border border-accent
                         rounded-xl border-opacity-10">
                            <div className="relative md:h-[300px] h-[200px]">
                                <img src={product.Imagenes[0]} alt='product image' className="absolute
                            inset-0 h-full w-full object-contain opacity-100
                            group-hover:opacity-0" />
                                <img src={product.Imagenes[1]} alt='product image' className="absolute
                            inset-0 h-full w-full object-contain opacity-0
                             group-hover:opacity-100" />
                            </div>

                            <div className="relative p-3 border-t">
                                <Link href={"/products/" + product._id}>
                                    <h3 className="text-md text-text group-hover:underline truncate">
                                        {product.Título}
                                    </h3>
                                </Link>

                                <div className="mt-1.5 flex flex-col items-center justify-between text-text">
                                    <p className="tracking-wide text-primary text-sm md:text-md">
                                        $ {formatPrice(product.Precio)} c/u
                                    </p>

                                    {/* START: ADDED STOCK DISPLAY AND BUTTON LOGIC */}
                                    {product.stock > 0 ? (
                                        <>
                                            <div className="col-span-12 text-center w-full">
                                                <button
                                                    onClick={() => {
                                                        addProduct(product._id);
                                                        toast.success("Producto agregado al carrito");
                                                    }}
                                                    className="block rounded bg-secondary px-5 py-3 text-md text-text transition hover:bg-purple-300 w-full"
                                                >
                                                    Agregar al Carrito
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm text-red-500 font-bold">¡Sin stock!</p>
                                            <div className="col-span-12 text-center w-full">
                                                <button
                                                    disabled
                                                    className="block rounded bg-gray-300 text-gray-500 px-5 py-3 text-md cursor-not-allowed w-full"
                                                >
                                                    Agregar al Carrito
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {/* END: ADDED STOCK DISPLAY AND BUTTON LOGIC */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
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