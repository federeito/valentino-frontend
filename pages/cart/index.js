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

const countOfId = (id, cartProducts) => {
    return cartProducts.filter(item => item === id).length;
};

export default function Cart() {
    const { cartProducts, removeProduct, addProduct, clearCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [isGuest, setIsGuest] = useState(false);
    const [guestEmail, setGuestEmail] = useState('');
    const [guestName, setGuestName] = useState('');

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [formComplete, setFormComplete] = useState(false);

    const { data: session } = useSession()

    const [isSuccess, setIsSuccess] = useState(false);
    const [isCanceled, setIsCanceled] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isCartValid, setIsCartValid] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('mercadopago'); // Estado para el método de pago

    useEffect(() => {
        // CORRECCIÓN: cartProducts son strings directamente, no objetos
        const uniqueIds = Array.from(new Set(cartProducts));

        if (uniqueIds.length > 0) {
            axios.post('/api/cart', { ids: uniqueIds }).then(response => {
                const validProducts = response.data;
                setProducts(validProducts);

                // Limpia productos que ya no existen en la base de datos
                const validProductIds = validProducts.map(p => p._id);
                const invalidIds = uniqueIds.filter(id => !validProductIds.includes(id));

                // Remueve productos inválidos del carrito
                if (invalidIds.length > 0) {
                    console.log('Removiendo productos inválidos del carrito:', invalidIds);
                    let updatedCartProducts = [...cartProducts];

                    invalidIds.forEach(invalidId => {
                        // Filtra todas las instancias del ID inválido
                        updatedCartProducts = updatedCartProducts.filter(id => id !== invalidId);
                    });

                    // Actualiza el carrito con productos válidos únicamente
                    if (updatedCartProducts.length !== cartProducts.length) {
                        setCartProducts(updatedCartProducts);
                    }
                }
            }).catch(error => {
                console.error('Error fetching cart products:', error);
                // En caso de error de red, mantén los productos pero marca como error
                setProducts([]);
            });
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        if (window?.location.href.includes('success=1')) {
            setIsSuccess(true);
            clearCart();
            toast.success('Compra realizada con éxito'), {
                duration: 5000,
            }
        } else if (window?.location.href.includes('canceled=1')) {
            setIsCanceled(true);
            clearCart();
            toast.error('La compra fue cancelada'), {
                duration: 5000,
            }
        } else if (window?.location.href.includes('pending=1')) {
            setIsPending(true);
            toast('El pago está pendiente de aprobación');
        }
    }, [])

    useEffect(() => {
        let valid = true;
        for (const product of products) {
            const currentCount = countOfId(product._id, cartProducts);
            if (currentCount > product.stock) {
                valid = false;
                break;
            }
        }
        setIsCartValid(valid);
    }, [products, cartProducts]);

    useEffect(() => {
        const isComplete = address && city && state && zip &&
            (session || (isGuest && guestEmail && guestName));
        setFormComplete(isComplete);
    }, [address, city, state, zip, guestEmail, guestName, isGuest, session]);

    function increaseProduct(id, stockLimit) {
        const currentCount = countOfId(id, cartProducts);
        if (currentCount < stockLimit) {
            addProduct(id);
            toast.success('Producto agregado al carrito');
        } else {
            toast.error('No hay más stock disponible de este producto.');
        }
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
    const uniqueProductIds = [...new Set(cartProducts)];
    for (const productId of uniqueProductIds) {
        const product = products.find(p => p._id === productId);
        if (product) {
            const price = parseFloat(product.Precio || 0);
            const quantity = countOfId(productId, cartProducts);
            total += price * quantity;
        }
    }

    async function mpCheckout() {
        if (!formComplete) {
            toast.error('Por favor complete todos los campos del formulario');
            return;
        }
        if (paymentMethod !== 'mercadopago') return;

        const response = await axios.post('/api/checkout', {
            email: session ? session.user.email : guestEmail,
            name: session ? session.user.name : guestName,
            address, state, zip, city,
            cartProducts,
            paymentMethod,
            isGuest
        });

        if (response.data.url) {
            window.location = response.data.url
        } else {
            toast.error('Error al procesar el pago con Mercado Pago')
        }
    }

    async function transferCheckout() {
        if (!formComplete) {
            toast.error('Por favor complete todos los campos del formulario');
            return;
        }
        if (paymentMethod !== 'transfer') return;

        try {
            const response = await axios.post('/api/checkout', {
                email: session ? session.user.email : guestEmail,
                name: session ? session.user.name : guestName,
                address, state, zip, city,
                cartProducts,
                paymentMethod,
                isGuest
            });

            if (response.data.orderId) {
                toast.success('Orden creada. Revisa tu correo para los detalles de pago.'), {
                    duration: 5000,
                }
                clearCart();
                window.location.href = '/cart?success=1';
            }
        } catch (error) {
            toast.error('Error al procesar la transferencia bancaria')
        }
    }

    if (isSuccess) {
        return <Success />
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

    if (!session && !isGuest) {
        return (
            <div className="grid h-screen px-4 bg-white place-content-center">
                <div className="text-center">
                    <p className="mt-4 text-text text-2xl">
                        Elige cómo deseas continuar
                    </p>
                    <div className="flex flex-col gap-4 mt-6">
                        <button
                            onClick={() => signIn('google')}
                            className="inline-block rounded-sm border border-primary bg-primary px-12 py-3
                            text-md font-medium text-white hover:bg-transparent hover:text-primary focus:ring-3 focus:outline-hidden"
                        >
                            Continuar con Google
                        </button>
                        <button
                            onClick={() => setIsGuest(true)}
                            className="inline-block rounded-sm border border-gray-300 px-12 py-3
                            text-md font-medium text-gray-700 hover:bg-gray-50 focus:ring-3 focus:outline-hidden"
                        >
                            Continuar como invitado
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!session && isGuest) {
        const guestInfoComplete = guestEmail && guestName;

        return (
            <section className="flex justify-between max-md:flex-col md:space-x-4 px-4 md:px-6 pb-8">
                <div className="md:w-2/3">
                    <div className="mt-8 md:mt-6">
                        <header className="text-left flex justify-between w-full">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                Tú Carrito
                            </h1>
                        </header>
                        {!products?.length ? (
                            <p className="my-6 text-center">Tu Carrito Está Vacío.</p>
                        ) : (
                            <>
                                {uniqueProductIds.map(productId => {
                                    const product = products.find(p => p._id === productId);
                                    if (!product) return null;

                                    const quantity = countOfId(product._id, cartProducts);
                                    const isOverstocked = quantity > product.stock;
                                    const isAtStockLimit = quantity === product.stock;

                                    return (
                                        <div className="mt-8" key={product._id}>
                                            <ul className="space-y-4">
                                                <li className="flex items-center gap-2 md:gap-4 justify-between flex-wrap sm:flex-nowrap">
                                                    <img src={product.Imagenes[0]} alt="cart image" className="h-16 w-16 object-cover rounded-lg" />
                                                    <div className="min-w-[200px] flex-grow">
                                                        <h3 className="text-sm md:text-md text-text">
                                                            {product.Título}
                                                        </h3>
                                                        <dl className="mt-1 space-y-px text-sm md:text-md text-text">
                                                            <p>$ {formatPrice(quantity * product.Precio)}</p>
                                                        </dl>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                                        <button onClick={() => decreaseProduct(product._id)}
                                                            type="button" className="h-10 w10 leading-10 text-gray-600
                                                            transition hover:opacity-75 border">
                                                            -
                                                        </button>

                                                        <input
                                                            type="number"
                                                            id="Quantity"
                                                            value={quantity}
                                                            readOnly
                                                            className="h-10 w16 rounded border text-primary text-lg
                                                            font-bold border-gray-200 text-center
                                                            [-moz-appearance:_textfield] sm:text-md [&
                                                            ::-webkit-inner-spin-button]:m-0 [&
                                                            ::-webkit-inner-spin-button]:appearance-none [&
                                                            ::-webkit-outer-spin-button]:m-0 [&
                                                            ::-webkit-outer-spin-button]:appearance-none"
                                                        />
                                                        <button
                                                            onClick={() => increaseProduct(product._id, product.stock)}
                                                            type="button"
                                                            disabled={isAtStockLimit}
                                                            className={`h-10 w10 leading-10 text-gray-600 transition hover:opacity-75 border
                                                            ${isAtStockLimit ? 'bg-gray-300 cursor-not-allowed' : ''}`}>
                                                            +
                                                        </button>
                                                    </div>
                                                    {isOverstocked && (
                                                        <p className="text-xs text-red-500 font-bold mt-1">
                                                            ¡Excede el stock disponible!
                                                        </p>
                                                    )}
                                                    {!isOverstocked && isAtStockLimit && (
                                                        <p className="text-xs text-orange-500 font-bold mt-1">
                                                            Límite de stock alcanzado.
                                                        </p>
                                                    )}
                                                </li>
                                            </ul>
                                        </div>
                                    );
                                })}
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
                <div className="md:w-1/3 mt-8 md:mt-6">
                    <header className="text-start flex flex-col w-full">
                        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                            Información del Comprador
                        </h1>
                        <p className="mt-2">Complete sus datos para continuar con la compra</p>
                    </header>
                    <div className="mx-auto max-w-xl p-4 border shadow-xl my-3 bg-white">
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-3 md:gap-5">
                                <div className="col-span-12">
                                    <label className="mb-1 block text-md font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        className="block w-full rounded-md p-3 border border-gray-300"
                                        value={guestEmail}
                                        onChange={e => setGuestEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div className="col-span-12">
                                    <label className="mb-1 block text-md font-medium text-gray-700">Nombre Completo</label>
                                    <input
                                        type="text"
                                        className="block w-full rounded-md p-3 border border-gray-300"
                                        value={guestName}
                                        onChange={e => setGuestName(e.target.value)}
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                                {guestInfoComplete && (
                                    <>
                                        <div className="col-span-12">
                                            <label htmlFor="example9" className="mb-1 block text-md font-medium text-gray-700">Dirección</label>
                                            <input type="text" id="example9" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="1864 Calle Principal"
                                                value={address}
                                                onChange={ev => setAddress(ev.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-12 sm:col-span-6">
                                            <label htmlFor="example10" className="mb-1 block text-md font-medium text-gray-700">Ciudad</label>
                                            <input type="text" id="example10" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                                value={city}
                                                onChange={ev => setCity(ev.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-12 sm:col-span-4">
                                            <label htmlFor="example11" className="mb-1 block text-md font-medium text-gray-700">Región/Provincia</label>
                                            <input type="text" id="example11" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                                value={state}
                                                onChange={ev => setState(ev.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-12 sm:col-span-2">
                                            <label htmlFor="example12" className="mb-1 block text-md font-medium text-gray-700">C.P.</label>
                                            <input type="text" id="example12" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                                value={zip}
                                                onChange={ev => setZip(ev.target.value)}
                                            />
                                        </div>

                                        <div className="col-span-12 text-center w-full mt-4">
                                            {!isCartValid && (
                                                <p className="text-red-500 font-bold mb-2">
                                                    Hay productos en el carrito con stock insuficiente. Por favor, ajusta las cantidades.
                                                </p>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setPaymentMethod('mercadopago')}
                                                    disabled={!isCartValid || cartProducts.length === 0 || !formComplete}
                                                    className={`flex-1 rounded p-2 text-md transition border-2 min-h-[60px] flex items-center justify-center
                                                        ${paymentMethod === 'mercadopago' ? 'border-purple-600 bg-secondary' : 'border-gray-300 bg-gray-100'}
                                                        ${(!isCartValid || cartProducts.length === 0 || !formComplete) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                                                    `}
                                                >
                                                    <img
                                                        src="https://res.cloudinary.com/djuk4a84p/image/upload/v1755571794/MP_RGB_HANDSHAKE_color_horizontal_l0i6d8.svg"
                                                        alt="Mercado Pago"
                                                        className="h-[40px] md:h-[120px] w-auto mx-auto"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => setPaymentMethod('transfer')}
                                                    disabled={!isCartValid || cartProducts.length === 0 || !formComplete}
                                                    className={`flex-1 rounded p-2 text-md transition border-2 font-bold
                                                        ${paymentMethod === 'transfer' ? 'border-purple-600 bg-secondary' : 'border-gray-300 bg-gray-100'}
                                                        ${(!isCartValid || cartProducts.length === 0 || !formComplete) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                                                    `}
                                                >
                                                    Transferencia Bancaria
                                                </button>
                                            </div>
                                            <button
                                                onClick={paymentMethod === 'mercadopago' ? mpCheckout : transferCheckout}
                                                disabled={!isCartValid || cartProducts.length === 0 || !formComplete}
                                                className={`mt-4 block rounded px-5 py-3 w-full transition font-bold
                                                ${(!isCartValid || cartProducts.length === 0 || !formComplete) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-purple-300'}`}
                                            >
                                                {!formComplete ? 'Complete todos los campos para continuar' :
                                                    paymentMethod === 'mercadopago' ?
                                                        'Proceder al Pago con Mercado Pago' :
                                                        'Confirmar Pedido (Pagar con Transferencia)'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (session) {
        return (
            <section className="flex justify-between max-md:flex-col md:space-x-4 px-4 md:px-6 pb-8">
                <div className="md:w-2/3">
                    <div className="mt-8 md:mt-6">
                        <header className="text-left flex justify-between w-full">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                Tú Carrito
                            </h1>
                        </header>
                        {!products?.length ? (
                            <p className="my-6 text-center">Tu Carrito Está Vacío.</p>
                        ) : (
                            <>
                                {uniqueProductIds.map(productId => {
                                    const product = products.find(p => p._id === productId);
                                    if (!product) return null;

                                    const quantity = countOfId(product._id, cartProducts);
                                    const isOverstocked = quantity > product.stock;
                                    const isAtStockLimit = quantity === product.stock;

                                    return (
                                        <div className="mt-8" key={product._id}>
                                            <ul className="space-y-4">
                                                <li className="flex items-center gap-2 md:gap-4 justify-between flex-wrap sm:flex-nowrap">
                                                    <img src={product.Imagenes[0]} alt="cart image" className="h-16 w-16 object-cover rounded-lg" />
                                                    <div className="min-w-[200px] flex-grow">
                                                        <h3 className="text-sm md:text-md text-text">
                                                            {product.Título}
                                                        </h3>
                                                        <dl className="mt-1 space-y-px text-sm md:text-md text-text">
                                                            <p>$ {formatPrice(quantity * product.Precio)}</p>
                                                        </dl>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                                        <button onClick={() => decreaseProduct(product._id)}
                                                            type="button" className="h-10 w10 leading-10 text-gray-600
                                                            transition hover:opacity-75 border">
                                                            -
                                                        </button>

                                                        <input
                                                            type="number"
                                                            id="Quantity"
                                                            value={quantity}
                                                            readOnly
                                                            className="h-10 w16 rounded border text-primary text-lg
                                                            font-bold border-gray-200 text-center
                                                            [-moz-appearance:_textfield] sm:text-md [&
                                                            ::-webkit-inner-spin-button]:m-0 [&
                                                            ::-webkit-inner-spin-button]:appearance-none [&
                                                            ::-webkit-outer-spin-button]:m-0 [&
                                                            ::-webkit-outer-spin-button]:appearance-none"
                                                        />
                                                        <button
                                                            onClick={() => increaseProduct(product._id, product.stock)}
                                                            type="button"
                                                            disabled={isAtStockLimit}
                                                            className={`h-10 w10 leading-10 text-gray-600 transition hover:opacity-75 border
                                                            ${isAtStockLimit ? 'bg-gray-300 cursor-not-allowed' : ''}`}>
                                                            +
                                                        </button>
                                                    </div>
                                                    {isOverstocked && (
                                                        <p className="text-xs text-red-500 font-bold mt-1">
                                                            ¡Excede el stock disponible!
                                                        </p>
                                                    )}
                                                    {!isOverstocked && isAtStockLimit && (
                                                        <p className="text-xs text-orange-500 font-bold mt-1">
                                                            Límite de stock alcanzado.
                                                        </p>
                                                    )}
                                                </li>
                                            </ul>
                                        </div>
                                    );
                                })}
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
                    <div className="md:w-1/3 mt-8 md:mt-6">
                        <header className="text-start flex flex-col w-full">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                Detalles de Envío
                            </h1>
                            <p className="mt-2">Utilizamos los Datos de su Cuenta para el Envío.</p>
                        </header>
                        <div className="mx-auto max-w-xl p-4 border shadow-xl my-3 bg-white">
                            <div className="space-y-4">
                                <div className="grid grid-cols-12 gap-3 md:gap-5">
                                    <div className="col-span-6">
                                        <label htmlFor="example7" className="mb-1 block text-md font-medium text-gray-700">Email</label>
                                        <input type="email" id="example7" className="block w-full rounded-md p-3 border border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="tu@correo.com"
                                            value={session.user.email}
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <label htmlFor="example8" className="mb-1 block text-md font-medium text-gray-700">Nombre Completo</label>
                                        <input type="text" id="example8" className="block w-full rounded-md p-3 border border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="tu@correo.com"
                                            value={session.user.name}
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label htmlFor="example9" className="mb-1 block text-md font-medium text-gray-700">Dirección</label>
                                        <input type="text" id="example9" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="1864 Calle Principal"
                                            value={address}
                                            onChange={ev => setAddress(ev.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <label htmlFor="example10" className="mb-1 block text-md font-medium text-gray-700">Ciudad</label>
                                        <input type="text" id="example10" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                            value={city}
                                            onChange={ev => setCity(ev.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-4">
                                        <label htmlFor="example11" className="mb-1 block text-md font-medium text-gray-700">Región/Provincia</label>
                                        <input type="text" id="example11" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                            value={state}
                                            onChange={ev => setState(ev.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-2">
                                        <label htmlFor="example12" className="mb-1 block text-md font-medium text-gray-700">C.P.</label>
                                        <input type="text" id="example12" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                            value={zip}
                                            onChange={ev => setZip(ev.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-12 text-center w-full mt-4">
                                        {!isCartValid && (
                                            <p className="text-red-500 font-bold mb-2">
                                                Hay productos en el carrito con stock insuficiente. Por favor, ajusta las cantidades.
                                            </p>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setPaymentMethod('mercadopago')}
                                                disabled={!isCartValid || cartProducts.length === 0 || !formComplete}
                                                className={`flex-1 rounded p-2 text-md transition border-2 min-h-[60px] flex items-center justify-center
                                                    ${paymentMethod === 'mercadopago' ? 'border-purple-600 bg-secondary' : 'border-gray-300 bg-gray-100'}
                                                    ${(!isCartValid || cartProducts.length === 0 || !formComplete) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                                                `}
                                            >
                                                <img
                                                    src="https://res.cloudinary.com/djuk4a84p/image/upload/v1755571794/MP_RGB_HANDSHAKE_color_horizontal_l0i6d8.svg"
                                                    alt="Mercado Pago"
                                                    className="h-[40px] md:h-[120px] w-auto mx-auto"
                                                />
                                            </button>
                                            <button
                                                onClick={() => setPaymentMethod('transfer')}
                                                disabled={!isCartValid || cartProducts.length === 0 || !formComplete}
                                                className={`flex-1 rounded p-2 text-md transition border-2 font-bold
                                                    ${paymentMethod === 'transfer' ? 'border-purple-600 bg-secondary' : 'border-gray-300 bg-gray-100'}
                                                    ${(!isCartValid || cartProducts.length === 0 || !formComplete) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                                                `}
                                            >
                                                Transferencia Bancaria
                                            </button>
                                        </div>
                                        <button
                                            onClick={paymentMethod === 'mercadopago' ? mpCheckout : transferCheckout}
                                            disabled={!isCartValid || cartProducts.length === 0 || !formComplete}
                                            className={`mt-4 block rounded px-5 py-3 w-full transition font-bold
                                            ${(!isCartValid || cartProducts.length === 0 || !formComplete) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-purple-300'}`}
                                        >
                                            {!formComplete ? 'Complete todos los campos para continuar' :
                                                paymentMethod === 'mercadopago' ?
                                                    'Proceder al Pago con Mercado Pago' :
                                                    'Confirmar Pedido (Pagar con Transferencia)'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        );
    }

    return (
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
                ></button>
                Continuar con el inicio de sesión de Google
            </div>
        </div>
    );
}