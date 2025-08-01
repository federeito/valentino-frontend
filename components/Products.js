import { CartContext } from "@/lib/CartContext";
import Link from "next/link";
import { useContext } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

};

export default function Products({ products }) {
    const { addProduct } = useContext(CartContext);

    return <>
        <div className="">
            <div className="mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold tracking-tight text-text">
                    Nuestros Ultimos Productos
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
                    {products?.length > 0 && products.map((product) => (
                        <div className="group relative" key={product._id}>
                            <div className="group block ocerflow-hidden border border-accent rounded-xl border-opacity-30">
                                <div className="p-1">
                                    <div className="relative h-[300px] sm:h-[300px]">
                                        <img src={product.Imagenes[0]} alt="new-img" className="absolute inset-0 h-full w-full object-contain
                                    opacity-100 group-hover:opacity-0" />
                                        <img src={product.Imagenes[1]} alt="new-img" className="absolute inset-0 h-full w-full object-contain
                                    opacity-0 group-hover:opacity-100" />
                                    </div>

                                    <div className="relative p-3 border-t">
                                        <Link href={'/products/' + product._id}>
                                            <h3 className="text-md text-gray-700 group-hover:underline group-hover:underline-offset-4 truncate">
                                                {product.Título}
                                            </h3>
                                        </Link>
                                        <div className="mt-1.5 flex items-center justify-between text-text">
                                            <p className="tracking-wide text-primary">
                                                $ {formatPrice(product.Precio)} c/u
                                            </p>

                                            {/* START: ADDED STOCK DISPLAY AND BUTTON LOGIC */}
                                            {product.stock > 0 ? (
                                                <button
                                                    onClick={() => {
                                                        addProduct(product._id);
                                                        toast.success('Producto añadido al carrito');
                                                    }}
                                                    type="button"
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-white px-4 py-2.5 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 hover:border-secondary"
                                                >
                                                    Agregar
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                        <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <p className="text-sm text-red-500 font-bold">¡Sin stock!</p>
                                                    <button
                                                        disabled
                                                        type="button"
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-500 shadow-sm cursor-not-allowed"
                                                    >
                                                        Agregar
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                            <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                            {/* END: ADDED STOCK DISPLAY AND BUTTON LOGIC */}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))}

                </div>
            </div>
        </div>
    </>
}