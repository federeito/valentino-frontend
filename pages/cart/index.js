import { CartContext } from "@/lib/CartContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Cart() {
    const {cartProducts, removeProduct, addProduct, clearCart} =useContext(CartContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post ('/api/cart', {ids: cartProducts}).then(response => {
                setProducts(response.data)
            })
        } else {
            setProducts([]);
        }
    }, [cartProducts])

    return <>
        <section className="flex justify-between max-md:flex-col space-x-4">
        <div className="md:w-2/3 px-4">
        <div className="mt-16 md:mt-6">
            <header className="text-center flex justify-between w-full">
                <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                    Tú Carrito
                </h1>
            </header>
        {!products?.length ? (
            <p className="my-6 text-center">Tu Carrito Está Vacío.</p>
        ) : (
            <>
            {products?.length > 0 && products.map(product => (
                <div className="mt-8" key={product._id}>
                   <ul className="space-y-4">
                    <li className="flex items-center gap-4 justify-between">
                        <img src={product.Imagenes[0]} alt="cart image" className="h-16 w16 object-cover" />
                        <div>
                            <h3 className="text-md text-text max-w-md">
                                {product.Título}
                            </h3>
                            
                        </div>
                    </li>
                    </ul>
                </div>
            ))}
            </>
        )}
        </div>
        </div>
        <div className="md:1/3 mt-16 md:mt-6">
        <p>checkout</p>
        </div>
        </section>

    </>
}