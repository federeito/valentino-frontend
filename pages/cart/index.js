import Success from "@/components/Success";
import { CartContext } from "@/lib/CartContext";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useEffect, useState, useCallback, useRef, useMemo } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Función actualizada para manejar tanto el formato anterior (strings) como el nuevo (objetos con colores)
const countOfId = (id, cartProducts, color = null) => {
    return cartProducts.filter(item => {
        if (typeof item === 'object' && item.productId) {
            let matches = item.productId === id;
            if (color && item.color) {
                matches = matches && item.color.name === color.name;
            } else if (!color && !item.color) {
                matches = true; // Producto sin color específico
            }
            return matches;
        }
        // Compatibilidad con formato anterior (solo strings)
        return item === id && !color;
    }).length;
};

export default function Cart() {
    const {
        cartProducts,
        removeProduct,
        addProduct,
        clearCart,
        setCartProducts,
        getUniqueProducts,
        getProductCount
    } = useContext(CartContext);

    const [products, setProducts] = useState([]);
    const [isGuest, setIsGuest] = useState(false);
    const [guestEmail, setGuestEmail] = useState('');
    const [guestName, setGuestName] = useState('');

    const [address, setAddress] = useState({
        street: '',
        number: '',
        floor: '',
        apartment: ''
    });
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');

    const [addressErrors, setAddressErrors] = useState({
        street: '',
        number: ''
    });

    const validateAddress = (field, value) => {
        switch (field) {
            case 'street':
                if (!value.trim()) {
                    return 'El nombre de la calle es obligatorio';
                }
                if (value.trim().length < 3) {
                    return 'El nombre de la calle debe tener al menos 3 caracteres';
                }
                if (!/^[a-zA-ZÀ-ÿ\s]{3,}$/.test(value.trim())) {
                    return 'El nombre de la calle solo debe contener letras';
                }
                return '';
            case 'number':
                if (!value.trim()) {
                    return 'El número es obligatorio';
                }
                if (!/^\d+[a-zA-Z]?$/.test(value.trim())) {
                    return 'Ingrese un número válido (puede incluir una letra al final)';
                }
                return '';
            default:
                return '';
        }
    };

    const { data: session } = useSession();

    const [isSuccess, setIsSuccess] = useState(false);
    const [isCanceled, setIsCanceled] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('mercadopago');

    // Memoizar los IDs únicos para evitar recálculos innecesarios
    const uniqueIds = useMemo(() => {
        return Array.from(new Set(
            cartProducts.map(item =>
                typeof item === 'object' && item.productId ? item.productId : item
            )
        ));
    }, [cartProducts]);

    // Memoizar los productos únicos
    const uniqueProducts = useMemo(() => {
        return getUniqueProducts ? getUniqueProducts() : [];
    }, [getUniqueProducts, cartProducts]);

    // Verificar si el carrito es válido
    const isCartValid = useMemo(() => {
        let valid = true;

        for (const cartItem of uniqueProducts) {
            const productId = cartItem.productId || cartItem;
            const product = products.find(p => p._id === productId);

            if (product) {
                const currentCount = getProductCount ?
                    getProductCount(productId, cartItem.color ? { color: cartItem.color } : {}) :
                    countOfId(productId, cartProducts, cartItem.color);

                if (currentCount > product.stock) {
                    valid = false;
                    break;
                }
            }
        }

        return valid;
    }, [products, cartProducts, uniqueProducts, getProductCount]);

    // Verificar si el formulario está completo
    const formComplete = useMemo(() => {
        const addressIsValid = address.street && 
                             address.number && 
                             !addressErrors.street && 
                             !addressErrors.number;
        return addressIsValid && city && state && zip &&
            (session || (isGuest && guestEmail && guestName));
    }, [address.street, address.number, addressErrors, city, state, zip, guestEmail, guestName, isGuest, session]);

    // Calcular el total
    const total = useMemo(() => {
        let calculatedTotal = 0;

        for (const cartItem of uniqueProducts) {
            const productId = cartItem.productId || cartItem;
            const product = products.find(p => p._id === productId);
            if (product) {
                const price = parseFloat(product.Precio || 0);
                const quantity = getProductCount ?
                    getProductCount(productId, cartItem.color ? { color: cartItem.color } : {}) :
                    countOfId(productId, cartProducts, cartItem.color);
                calculatedTotal += price * quantity;
            }
        }

        return calculatedTotal;
    }, [uniqueProducts, products, getProductCount, cartProducts]);

    // Efecto para cargar productos - solo se ejecuta cuando cambian los uniqueIds
    useEffect(() => {
        if (uniqueIds.length > 0) {
            const loadProducts = async () => {
                try {
                    const response = await axios.post('/api/cart', { ids: uniqueIds });
                    setProducts(response.data);
                } catch (error) {
                    console.error('Error fetching cart products:', error);
                    setProducts([]);
                }
            };

            loadProducts();
        } else {
            setProducts([]);
        }
    }, [uniqueIds]);

    // Efecto para manejar el estado de la URL (solo se ejecuta una vez)
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const handleUrlState = () => {
            if (window?.location.href.includes('success=1')) {
                setIsSuccess(true);
                clearCart();
                toast.success('Compra realizada con éxito', {
                    duration: 5000,
                });
            } else if (window?.location.href.includes('canceled=1')) {
                setIsCanceled(true);
                clearCart();
                toast.error('La compra fue cancelada', {
                    duration: 5000,
                });
            } else if (window?.location.href.includes('pending=1')) {
                setIsPending(true);
                toast('El pago está pendiente de aprobación');
            }
        };

        handleUrlState();
    }, []); // Solo se ejecuta una vez al montar el componente

    // Función para limpiar productos inválidos
    const handleCleanInvalidProducts = useCallback(() => {
        const validProductIds = products.map(p => p._id);
        const updatedCartProducts = cartProducts.filter(item => {
            const itemId = typeof item === 'object' && item.productId ? item.productId : item;
            return validProductIds.includes(itemId);
        });

        if (updatedCartProducts.length !== cartProducts.length) {
            setCartProducts(updatedCartProducts);
            toast.success('Productos inválidos eliminados del carrito');
        }
    }, [cartProducts, products, setCartProducts]);

    function increaseProduct(id, stockLimit, color = null) {
        const currentCount = getProductCount ?
            getProductCount(id, color ? { color } : {}) :
            countOfId(id, cartProducts, color);

        if (currentCount < stockLimit) {
            addProduct(id, color ? { color } : {});
            toast.success('Producto agregado al carrito');
        } else {
            toast.error('No hay más stock disponible de este producto.');
        }
    }

    function decreaseProduct(id, color = null) {
        removeProduct(id, color ? { color } : {});
        toast.success('Producto eliminado del carrito');
    }

    function deleteCart() {
        clearCart();
        toast.success('Carrito Vacío');
    }

    const getFormattedAddress = () => {
        let fullAddress = `${address.street} ${address.number}`;
        if (address.floor) {
            fullAddress += `, Piso ${address.floor}`;
        }
        if (address.apartment) {
            fullAddress += `, Depto ${address.apartment}`;
        }
        return fullAddress;
    };

    async function mpCheckout() {
        if (!formComplete) {
            toast.error('Por favor complete todos los campos del formulario');
            return;
        }
        if (paymentMethod !== 'mercadopago') return;

        try {
            const response = await axios.post('/api/checkout', {
                email: session ? session.user.email : guestEmail,
                name: session ? session.user.name : guestName,
                address: getFormattedAddress(), state, zip, city,
                cartProducts,
                paymentMethod,
                isGuest
            });

            if (response.data.url) {
                window.location = response.data.url;
            } else {
                toast.error('Error al procesar el pago con Mercado Pago');
            }
        } catch (error) {
            toast.error('Error al procesar el pago con Mercado Pago');
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
                address: getFormattedAddress(), state, zip, city,
                cartProducts,
                paymentMethod,
                isGuest
            });

            if (response.data.orderId) {
                toast.success('Orden creada. Revisa tu correo para los detalles de pago.', {
                    duration: 5000,
                });
                clearCart();
                window.location.href = '/cart?success=1';
            }
        } catch (error) {
            toast.error('Error al procesar la transferencia bancaria');
        }
    }

    // Componente para mostrar un producto del carrito con soporte para colores
    const CartProductItem = ({ cartItem, product }) => {
        const productId = cartItem.productId || cartItem;
        const color = cartItem.color;

        const quantity = getProductCount ?
            getProductCount(productId, color ? { color } : {}) :
            countOfId(productId, cartProducts, color);

        const isOverstocked = quantity > product.stock;
        const isAtStockLimit = quantity === product.stock;

        return (
            <div className="mt-8" key={`${product._id}-${color?.name || 'default'}`}>
                <ul className="space-y-4">
                    <li className="flex items-center gap-2 md:gap-4 justify-between flex-wrap sm:flex-nowrap">
                        <img src={product.Imagenes[0]} alt="cart image" className="h-16 w-16 object-cover rounded-lg" />
                        <div className="min-w-[200px] flex-grow">
                            <h3 className="text-sm md:text-md text-text">
                                {product.Título}
                            </h3>

                            {/* Mostrar color si existe */}
                            {color && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={{ backgroundColor: color.code }}
                                    />
                                    <span className="text-xs text-gray-600">
                                        Color: {color.name}
                                    </span>
                                </div>
                            )}

                            <dl className="mt-1 space-y-px text-sm md:text-md text-text">
                                <p>$ {formatPrice(quantity * product.Precio)}</p>
                            </dl>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <button
                                onClick={() => decreaseProduct(product._id, color)}
                                type="button"
                                className="h-10 w10 leading-10 text-gray-600 transition hover:opacity-75 border">
                                -
                            </button>

                            <input
                                type="number"
                                id="Quantity"
                                value={quantity}
                                readOnly
                                className="h-10 w16 rounded border text-primary text-lg font-bold border-gray-200 text-center [-moz-appearance:_textfield] sm:text-md [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <button
                                onClick={() => increaseProduct(product._id, product.stock, color)}
                                type="button"
                                disabled={isAtStockLimit}
                                className={`h-10 w10 leading-10 text-gray-600 transition hover:opacity-75 border ${isAtStockLimit ? 'bg-gray-300 cursor-not-allowed' : ''}`}>
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
    };

    const renderCartProducts = () => {
        // Verificar si hay productos que no se encuentran en la base de datos
        const invalidProducts = uniqueProducts.filter(cartItem => {
            const productId = cartItem.productId || cartItem;
            return !products.find(p => p._id === productId);
        });

        return (
            <>
                {invalidProducts.length > 0 && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold">Productos no válidos detectados</p>
                                <p className="text-sm">Algunos productos en tu carrito ya no están disponibles.</p>
                            </div>
                            <button
                                onClick={handleCleanInvalidProducts}
                                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                )}

                {uniqueProducts.map(cartItem => {
                    const productId = cartItem.productId || cartItem;
                    const product = products.find(p => p._id === productId);
                    if (!product) return null;

                    return <CartProductItem key={`${product._id}-${cartItem.color?.name || 'default'}`} cartItem={cartItem} product={product} />;
                })}
            </>
        );
    };

    if (isSuccess) {
        return <Success />;
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
                            className="inline-block rounded-sm border border-primary bg-primary px-12 py-3 text-md font-medium text-white hover:bg-transparent hover:text-primary focus:ring-3 focus:outline-hidden"
                        >
                            Continuar con Google
                        </button>
                        <button
                            onClick={() => setIsGuest(true)}
                            className="inline-block rounded-sm border border-gray-300 px-12 py-3 text-md font-medium text-gray-700 hover:bg-gray-50 focus:ring-3 focus:outline-hidden"
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
            <section className="flex justify-between max-md:flex-col md:space-x-4 px-2 md:px-4 pb-4 max-w-[1600px] mx-auto">
                <div className="md:w-3/5">
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
                                {renderCartProducts()}
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
                                                className="group flex items-center justify-between gap-4 rounded-lg border border-primary bg-primary px-5 py-3 transition-colors hover:bg-transparent focus:ring focus:outline-none"
                                                href="/products"
                                            >
                                                <span className="font-medium text-white transition-colors group-hover:text-primary">
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
                <div className="md:w-2/5 mt-8 md:mt-6">
                    <header className="text-start flex flex-col w-full">
                        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                            Información del Comprador
                        </h1>
                        <p className="mt-2">Complete sus datos para continuar con la compra</p>
                    </header>
                    <div className="mx-auto max-w-lg p-3 md:p-4 border shadow-md my-2 md:my-3 bg-white rounded-lg">
                        <div className="space-y-3">
                            <div className="grid grid-cols-6 gap-2 md:gap-3">
                                <div className="col-span-6">
                                    <label className="mb-1 block text-md font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        className="block w-full rounded-md p-3 border border-gray-300"
                                        value={guestEmail}
                                        onChange={e => setGuestEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div className="col-span-6">
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
                                        <div className="col-span-6">
                                            <label className="mb-1 block text-sm md:text-md font-medium text-gray-700">Dirección</label>
                                            <div className="grid grid-cols-6 gap-2">
                                                <div className="col-span-4">
                                                    <input
                                                        type="text"
                                                        className={`block p-3 border w-full rounded-md ${
                                                            addressErrors.street ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                        placeholder="Nombre de la calle"
                                                        value={address.street}
                                                        onChange={ev => {
                                                            const value = ev.target.value;
                                                            const error = validateAddress('street', value);
                                                            setAddressErrors(prev => ({...prev, street: error}));
                                                            setAddress(prev => ({...prev, street: value}));
                                                        }}
                                                        required
                                                    />
                                                    {addressErrors.street && (
                                                        <p className="text-red-500 text-xs mt-1">{addressErrors.street}</p>
                                                    )}
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="text"
                                                        className={`block p-3 border w-full rounded-md ${
                                                            addressErrors.number ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                        placeholder="Número"
                                                        value={address.number}
                                                        onChange={ev => {
                                                            const value = ev.target.value;
                                                            const error = validateAddress('number', value);
                                                            setAddressErrors(prev => ({...prev, number: error}));
                                                            setAddress(prev => ({...prev, number: value}));
                                                        }}
                                                        required
                                                    />
                                                    {addressErrors.number && (
                                                        <p className="text-red-500 text-xs mt-1">{addressErrors.number}</p>
                                                    )}
                                                </div>
                                                <div className="col-span-3">
                                                    <input
                                                        type="text"
                                                        className="block p-3 border w-full rounded-md border-gray-300"
                                                        placeholder="Piso (opcional)"
                                                        value={address.floor}
                                                        onChange={ev => setAddress(prev => ({...prev, floor: ev.target.value}))}
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <input
                                                        type="text"
                                                        className="block p-3 border w-full rounded-md border-gray-300"
                                                        placeholder="Departamento (opcional)"
                                                        value={address.apartment}
                                                        onChange={ev => setAddress(prev => ({...prev, apartment: ev.target.value}))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="example10" className="mb-1 block text-md font-medium text-gray-700">Ciudad</label>
                                            <input type="text" id="example10" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                                value={city}
                                                onChange={ev => setCity(ev.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-4 sm:col-span-2">
                                            <label htmlFor="example11" className="mb-1 block text-md font-medium text-gray-700">Región/Provincia</label>
                                            <input type="text" id="example11" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                                value={state}
                                                onChange={ev => setState(ev.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label htmlFor="example12" className="mb-1 block text-md font-medium text-gray-700">C.P.</label>
                                            <input type="text" id="example12" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                                value={zip}
                                                onChange={ev => setZip(ev.target.value)}
                                            />
                                        </div>

                                        <div className="col-span-6 mt-2">
                                            {!isCartValid && (
                                                <p className="text-red-500 font-bold mb-2">
                                                    Hay productos en el carrito con stock insuficiente. Por favor, ajusta las cantidades.
                                                </p>
                                            )}
                                            <div className="flex gap-2 flex-col sm:flex-row">
                                                <button
                                                    onClick={() => setPaymentMethod('mercadopago')}
                                                    disabled={!isCartValid || cartProducts.length === 0 || !formComplete}
                                                    className={`flex-1 rounded p-2 text-md transition border-2 h-[50px] md:h-[60px] flex items-center justify-center
                                                        ${paymentMethod === 'mercadopago' ? 'border-purple-600 bg-secondary' : 'border-gray-300 bg-gray-100'}
                                                        ${(!isCartValid || cartProducts.length === 0 || !formComplete) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                                                    `}
                                                >
                                                    <img
                                                        src="https://res.cloudinary.com/djuk4a84p/image/upload/v1755571794/MP_RGB_HANDSHAKE_color_horizontal_l0i6d8.svg"
                                                        alt="Mercado Pago"
                                                        className="h-[30px] md:h-[40px] w-auto mx-auto"
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
            <section className="flex justify-between max-md:flex-col md:space-x-4 px-2 md:px-4 pb-4 max-w-[1600px] mx-auto">
                <div className="md:w-3/5">
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
                                {renderCartProducts()}
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
                                                className="group flex items-center justify-between gap-4 rounded-lg border border-primary bg-primary px-5 py-3 transition-colors hover:bg-transparent focus:ring focus:outline-none"
                                                href="/products"
                                            >
                                                <span className="font-medium text-white transition-colors group-hover:text-primary">
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
                    <div className="md:w-2/5 mt-8 md:mt-6">
                        <header className="text-start flex flex-col w-full">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                Detalles de Envío
                            </h1>
                            <p className="mt-2">Utilizamos los Datos de su Cuenta para el Envío.</p>
                        </header>
                        <div className="mx-auto max-w-lg p-3 md:p-4 border shadow-md my-2 md:my-3 bg-white rounded-lg">
                            <div className="space-y-3">
                                <div className="grid grid-cols-6 gap-2 md:gap-3">
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
                                    <div className="col-span-6">
                                        <label className="mb-1 block text-sm md:text-md font-medium text-gray-700">Dirección</label>
                                        <div className="grid grid-cols-6 gap-2">
                                            <div className="col-span-4">
                                                <input
                                                    type="text"
                                                    className={`block p-3 border w-full rounded-md ${
                                                        addressErrors.street ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Nombre de la calle"
                                                    value={address.street}
                                                    onChange={ev => {
                                                        const value = ev.target.value;
                                                        const error = validateAddress('street', value);
                                                        setAddressErrors(prev => ({...prev, street: error}));
                                                        setAddress(prev => ({...prev, street: value}));
                                                    }}
                                                    required
                                                />
                                                {addressErrors.street && (
                                                    <p className="text-red-500 text-xs mt-1">{addressErrors.street}</p>
                                                )}
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    className={`block p-3 border w-full rounded-md ${
                                                        addressErrors.number ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Número"
                                                    value={address.number}
                                                    onChange={ev => {
                                                        const value = ev.target.value;
                                                        const error = validateAddress('number', value);
                                                        setAddressErrors(prev => ({...prev, number: error}));
                                                        setAddress(prev => ({...prev, number: value}));
                                                    }}
                                                    required
                                                />
                                                {addressErrors.number && (
                                                    <p className="text-red-500 text-xs mt-1">{addressErrors.number}</p>
                                                )}
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="text"
                                                    className="block p-3 border w-full rounded-md border-gray-300"
                                                    placeholder="Piso (opcional)"
                                                    value={address.floor}
                                                    onChange={ev => setAddress(prev => ({...prev, floor: ev.target.value}))}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="text"
                                                    className="block p-3 border w-full rounded-md border-gray-300"
                                                    placeholder="Departamento (opcional)"
                                                    value={address.apartment}
                                                    onChange={ev => setAddress(prev => ({...prev, apartment: ev.target.value}))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="example10" className="mb-1 block text-md font-medium text-gray-700">Ciudad</label>
                                        <input type="text" id="example10" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                            value={city}
                                            onChange={ev => setCity(ev.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-4 sm:col-span-2">
                                        <label htmlFor="example11" className="mb-1 block text-md font-medium text-gray-700">Región/Provincia</label>
                                        <input type="text" id="example11" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                            value={state}
                                            onChange={ev => setState(ev.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="example12" className="mb-1 block text-md font-medium text-gray-700">C.P.</label>
                                        <input type="text" id="example12" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder=""
                                            value={zip}
                                            onChange={ev => setZip(ev.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-6 mt-2">
                                        {!isCartValid && (
                                            <p className="text-red-500 font-bold mb-2">
                                                Hay productos en el carrito con stock insuficiente. Por favor, ajusta las cantidades.
                                            </p>
                                        )}
                                        <div className="flex gap-2 flex-col sm:flex-row">
                                            <button
                                                onClick={() => setPaymentMethod('mercadopago')}
                                                disabled={!isCartValid || cartProducts.length === 0 || !formComplete}
                                                className={`flex-1 rounded p-2 text-md transition border-2 h-[50px] md:h-[60px] flex items-center justify-center
                                                    ${paymentMethod === 'mercadopago' ? 'border-purple-600 bg-secondary' : 'border-gray-300 bg-gray-100'}
                                                    ${(!isCartValid || cartProducts.length === 0 || !formComplete) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                                                `}
                                            >
                                                <img
                                                    src="https://res.cloudinary.com/djuk4a84p/image/upload/v1755571794/MP_RGB_HANDSHAKE_color_horizontal_l0i6d8.svg"
                                                    alt="Mercado Pago"
                                                    className="h-[30px] md:h-[40px] w-auto mx-auto"
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
                    className="inline-block rounded-sm border border-primary bg-primary mt-6 px-12 py-3 text-md font-medium text-white hover:bg-transparent hover:text-primary focus:ring-3 focus:outline-hidden"
                >
                    Continuar con el inicio de sesión de Google
                </button>
            </div>
        </div>
    );
}