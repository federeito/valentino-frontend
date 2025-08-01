import Success from "@/components/Success";
import { CartContext } from "@/lib/CartContext";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Cart() {
    const { cartProducts, removeProduct, addProduct, clearCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');

    const { data: session } = useSession()

    const [isSuccess, setIsSuccess] = useState(false);
    const [isCanceled, setIsCanceled] = useState(false);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/cart', { ids: cartProducts }).then(response => {
                setProducts(response.data)
            })
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        if (window?.location.href.includes('success')) {
            setIsSuccess(true);
            clearCart();
            toast.success('Compra realizada con éxito');
        } else if (window?.location.href.includes('canceled')) {
            setIsCanceled(true);
            clearCart();
            toast.error('La compra fue cancelada');
        } else if (window?.location.href.includes('pending')) {
            setIsPending(true);
            toast('El pago está pendiente de aprobación');
        }
    }, [])

    function increaseProduct(id) {
        addProduct(id);
        toast.success('Producto agregado al carrito');
    }
    function decreaseProduct(id) {
        removeProduct(id);
        toast.success('Producto eliminado del carrito');
    }
    function deleteCart() {
        clearCart();
        toast.success('Carrito Vacío');
    }
    let total = 0;
    for (const productId of cartProducts) {
        const price = parseFloat(products.find(p => p._id === productId)?.Precio || 0);
        total += price;
    }

    async function mpCheckout() {
        const response = await axios.post('/api/checkout', {
            email: session.user.email, name: session.user.name, address, state, zip, city,
            cartProducts
        });

        if (response.data.url) {
            window.location = response.data.url
        } else {
            toast.error('Error al procesar el pago')
        }
    }

    if (isSuccess) {
        return <>
        <Success />
        </>
    }

    if (isCanceled) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p className="font-bold">¡Pago cancelado!</p>
                <p>El pago fue cancelado. Si tienes algún problema, por favor contáctanos.</p>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                <p className="font-bold">¡Pago pendiente!</p>
                <p>El pago está siendo procesado. Te notificaremos cuando se complete.</p>
            </div>
        );
    }

    if (session) {
        return <>
            <section className="flex justify-between max-md:flex-col md:space-x-4">
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
                                                    <dl className="mt-1 space-y-px text-md text-text">
                                                        <p>$ {cartProducts.filter(id => id === product._id).length
                                                            * product.Precio}</p>
                                                    </dl>
                                                </div>
                                                <div>
                                                    <label htmlFor="Quantity" className="sr-only"> Cantidad </label>

                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => decreaseProduct(product._id)}
                                                            type="button" className="h-10 w10 leading-10 text-gray-600
                                            transition hover:opacity-75 border">
                                                            -
                                                        </button>

                                                        <input
                                                            type="number"
                                                            id="Quantity"
                                                            value={cartProducts.filter(id => id === product._id).length}
                                                            className="h-10 w16 rounded border text-primary text-lg
                                                font-bold border-gray-200 text-center
                                                [-moz-appearance:_textfield] sm:text-md [&
                                                ::-webkit-inner-spin-button]:m-0 [&
                                                ::-webkit-inner-spin-button]:appearance-none [&
                                                ::-webkit-outer-spin-button]:m-0 [&
                                                ::-webkit-outer-spin-button]:appearance-none"
                                                        />
                                                        <button onClick={() => increaseProduct(product._id)} type="button" className="h-10 w10 leading-10 text-gray-600
                                                transition hover:opacity-75 border">
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                                <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                                    <div className="max-w-md space-y-4">
                                        <dl className="space-y-1 text-md text-text">
                                            <div className="flex justify-end text-red-500 border-b mb-3">
                                                <button onClick={deleteCart}>Borrar Carrito</button>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt>Total</dt>
                                                <dd> ${formatPrice(total)}</dd>
                                            </div>
                                        </dl>
                                        <div className="flex justify-end">
                                            <Link
                                                className="group flex items-center justify-between gap-4
                                        rounded-lg border border-primary bg-primary px-5 py-3
                                        transition-colors hover:bg-transparent focus:ring focus:outline-none"
                                                href="/products"
                                            >
                                                <span className="font-medium text-white transition-colors
                                         group-hover:text-primary">
                                                    Continuar Comprando
                                                </span>

                                                <span className="shrink-0 rounded-full border border-current bg-white p-2 text-primary">
                                                    <svg
                                                        className="size-5 shadow-sm rtl:rotate-180"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                        />
                                                    </svg>
                                                </span>
                                            </Link>

                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {!products?.length ? (
                    ''
                ) : (
                    <div className="md:1/3 mt-16 md:mt-6">
                        <header className="text-start flex flex-col w-full">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                Detalles de Envío
                            </h1>
                            <p className="mt-2">Utilizamos los Datos de su Cuenta para el Envío.</p>
                        </header>
                        <div class="mx-auto max-w-xl p-4 border shadow-xl h-[400px] my-3">
                            <div class="space-y-5">
                                <div class="grid grid-cols-12 gap-5">
                                    <div class="col-span-6">
                                        <label for="example7" class="mb-1 block text-md font-medium text-gray-700">Email</label>
                                        <input type="email" id="example7" class="block w-full rounded-md p-3 border border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="tu@correo.com"
                                            value={session.user.email}
                                        />
                                    </div>
                                    <div class="col-span-6">
                                        <label for="example8" class="mb-1 block text-md font-medium text-gray-700">Nombre Completo</label>
                                        <input type="text" id="example8" class="block w-full rounded-md p-3 border border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="tu@correo.com"
                                            value={session.user.name}
                                        />
                                    </div>
                                    <div class="col-span-12">
                                        <label for="example9" class="mb-1 block text-md font-medium text-gray-700">Dirección</label>
                                        <input type="text" id="example9" class="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="1864 Calle Principal"
                                            value={address}
                                            onChange={ev => setAddress(ev.target.value)}
                                        />
                                    </div>
                                    <div class="col-span-6">
                                        <label for="example10" class="mb-1 block text-md font-medium text-gray-700">Ciudad</label>
                                        <input type="text" id="example10" class="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                            value={city}
                                            onChange={ev => setCity(ev.target.value)}
                                        />
                                    </div>
                                    <div class="col-span-4">
                                        <label for="example11" class="mb-1 block text-md font-medium text-gray-700">Región/Provincia</label>
                                        <input type="text" id="example10" class="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                            value={state}
                                            onChange={ev => setState(ev.target.value)}
                                        />
                                    </div>
                                    <div class="col-span-2">
                                        <label for="example12" class="mb-1 block text-md font-medium text-gray-700">C. P.</label>
                                        <input type="text" id="example12" class="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                            value={zip}
                                            onChange={ev => setZip(ev.target.value)}
                                        />
                                    </div>

                                    <div class="col-span-12 text-center w-full">
                                        <button onClick={mpCheckout} className="block rounded bg-secondary px-5 py-3 text-md
                                         text-text transition hover:bg-purple-300 w-full">Proceder al Pago</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </section>

        </>
    }

    return <>
        <div className="grid h-screen px-4 bg-white place-content-center">
            <div className="text-center">
                <p className="mt-4 text-text text-2xl">
                    Debes registrarte para ver los productos del carrito.
                </p>

                <button
                    onClick={() => signIn('google')}
                    className="inline-block rounded-sm border border-primary bg-primary mt-6 px-12 py-3
                     text-md font-medium text-white hover:bg-transparent hover:text-primary focus:ring-3 focus:outline-hidden"
                    href="#"
                >
                    Continuar con el inicio de sesión de Google
                </button>
            </div>
        </div>
    </>
}