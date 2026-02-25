import Success from "@/components/Success";
import { CartContext } from "@/lib/CartContext";
import { usePriceVisibility } from "@/lib/PriceVisibilityContext";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useEffect, useState, useCallback, useRef, useMemo } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Minimum purchase amount constant
const MINIMUM_PURCHASE = 300000;

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
    const { canViewPrices, isLoading: pricePermissionLoading } = usePriceVisibility();
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

    // Calculate discount and final total for bank transfer
    const discount = useMemo(() => {
        return paymentMethod === 'transfer' ? total * 0.10 : 0;
    }, [total, paymentMethod]);

    const finalTotal = useMemo(() => {
        return total - discount;
    }, [total, discount]);

    // Check if subtotal (before discount) meets minimum purchase requirement
    const meetsMinimumPurchase = useMemo(() => {
        return total >= MINIMUM_PURCHASE;
    }, [total]);

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
        if (!meetsMinimumPurchase) {
            toast.error(`El monto mínimo de compra es de $${formatPrice(MINIMUM_PURCHASE)}`);
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
        if (!meetsMinimumPurchase) {
            toast.error(`El monto mínimo de compra es de $${formatPrice(MINIMUM_PURCHASE)}`);
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
                    <li className="flex items-start gap-3 md:gap-4 justify-between flex-wrap">
                        <img src={product.Imagenes[0]} alt="cart image" className="h-16 w-16 object-cover rounded-lg flex-shrink-0" />
                        <div className="min-w-[150px] flex-grow">
                            <h3 className="text-sm md:text-md text-text font-medium">
                                {product.Título}
                            </h3>

                            {/* Product Code */}
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-600">
                                    COD: <span className="font-medium">{product.código || 'N/A'}</span>
                                </span>
                            </div>

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
                                <p className="font-semibold">$ {formatPrice(quantity * product.Precio)}</p>
                            </dl>

                            {/* Quantity controls for mobile - below product info */}
                            <div className="flex items-center gap-2 mt-3 sm:hidden">
                                <button
                                    onClick={() => decreaseProduct(product._id, color)}
                                    type="button"
                                    className="h-9 w-9 flex items-center justify-center text-gray-600 transition hover:opacity-75 border border-gray-300 rounded">
                                    -
                                </button>

                                <input
                                    type="number"
                                    id="Quantity"
                                    value={quantity}
                                    readOnly
                                    className="h-9 w-14 rounded border text-primary text-base font-bold border-gray-300 text-center [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <button
                                    onClick={() => increaseProduct(product._id, product.stock, color)}
                                    type="button"
                                    disabled={isAtStockLimit}
                                    className={`h-9 w-9 flex items-center justify-center text-gray-600 transition hover:opacity-75 border border-gray-300 rounded ${isAtStockLimit ? 'bg-gray-300 cursor-not-allowed' : ''}`}>
                                    +
                                </button>
                            </div>

                            {/* Status messages */}
                            {isOverstocked && (
                                <p className="text-xs text-red-500 font-bold mt-2">
                                    ¡Excede el stock disponible!
                                </p>
                            )}
                            {!isOverstocked && isAtStockLimit && (
                                <p className="text-xs text-orange-500 font-bold mt-2">
                                    Límite de stock alcanzado.
                                </p>
                            )}
                        </div>

                        {/* Quantity controls for desktop - on the right */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => decreaseProduct(product._id, color)}
                                type="button"
                                className="h-10 w-10 flex items-center justify-center text-gray-600 transition hover:opacity-75 border border-gray-300 rounded">
                                -
                            </button>

                            <input
                                type="number"
                                id="Quantity"
                                value={quantity}
                                readOnly
                                className="h-10 w-16 rounded border text-primary text-lg font-bold border-gray-300 text-center [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <button
                                onClick={() => increaseProduct(product._id, product.stock, color)}
                                type="button"
                                disabled={isAtStockLimit}
                                className={`h-10 w-10 flex items-center justify-center text-gray-600 transition hover:opacity-75 border border-gray-300 rounded ${isAtStockLimit ? 'bg-gray-300 cursor-not-allowed' : ''}`}>
                                +
                            </button>
                        </div>
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

    // Show loading state while checking permissions
    if (pricePermissionLoading) {
        return (
            <div className="grid h-screen px-4 bg-white place-content-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando permisos...</p>
                </div>
            </div>
        );
    }

    // Restrict cart access if user can't view prices
    if (!canViewPrices) {
        return (
            <div className="grid h-screen px-4 bg-white place-content-center">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Acceso para clientes registrados
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {!session ? 
                            'Debes iniciar sesión para acceder al carrito de compras.' :
                            'Tu cuenta está pendiente de aprobación. Una vez aprobada, podrás ver precios y realizar compras.'
                        }
                    </p>
                    {!session && (
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => signIn('google')}
                                className="inline-flex items-center justify-center gap-3 rounded-sm border-2 border-gray-300 bg-white px-8 py-3 text-md font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Iniciar Sesión con Google
                            </button>
                            <button
                                onClick={() => signIn('facebook')}
                                className="inline-flex items-center justify-center gap-3 rounded-sm border-2 border-[#1877F2] bg-[#1877F2] px-8 py-3 text-md font-medium text-white hover:bg-[#166FE5]"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Iniciar Sesión con Facebook
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

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
                            className="inline-flex items-center justify-center gap-3 rounded-sm border-2 border-gray-300 bg-white px-12 py-3 text-md font-medium text-gray-700 hover:bg-gray-50 focus:ring-3 focus:outline-hidden"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continuar con Google
                        </button>
                        <button
                            onClick={() => signIn('facebook')}
                            className="inline-flex items-center justify-center gap-3 rounded-sm border-2 border-[#1877F2] bg-[#1877F2] px-12 py-3 text-md font-medium text-white hover:bg-[#166FE5] focus:ring-3 focus:outline-hidden"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Continuar con Facebook
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
            <section className="flex justify-between max-md:flex-col md:space-x-4 px-2 md:px-4 pb-4 pt-20 max-w-[1600px] mx-auto">
                <div className="md:w-3/5">
                    <div className="mt-6 md:mt-8">
                        <header className="text-left flex justify-between w-full mb-4">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                Tu Carrito
                            </h1>
                        </header>
                        {!products?.length ? (
                            <p className="my-6 text-center">Tu Carrito Está Vacío.</p>
                        ) : (
                            <>
                                {renderCartProducts()}
                                <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
                                    <div className="w-full max-w-md space-y-4">
                                        <dl className="space-y-2 text-sm md:text-md text-text">
                                            <div className="flex justify-end text-red-500 border-b pb-2 mb-3">
                                                <button onClick={deleteCart} className="text-sm hover:underline">Borrar Carrito</button>
                                            </div>
                                            <div className="flex justify-between text-base md:text-lg font-semibold">
                                                <dt>Subtotal</dt>
                                                <dd>$ {formatPrice(total)}</dd>
                                            </div>
                                            {paymentMethod === 'transfer' && (
                                                <>
                                                    <div className="flex justify-between text-sm md:text-base text-green-600">
                                                        <dt>Descuento (10% por transferencia)</dt>
                                                        <dd>-$ {formatPrice(discount)}</dd>
                                                    </div>
                                                    <div className="flex justify-between text-lg md:text-xl font-bold border-t pt-2">
                                                        <dt>Total a Pagar</dt>
                                                        <dd>$ {formatPrice(finalTotal)}</dd>
                                                    </div>
                                                </>
                                            )}
                                            {paymentMethod !== 'transfer' && (
                                                <div className="flex justify-between text-base md:text-lg font-semibold">
                                                    <dt>Total</dt>
                                                    <dd>$ {formatPrice(total)}</dd>
                                                </div>
                                            )}
                                        </dl>
                                        <div className="flex justify-end">
                                            <Link
                                                className="group flex items-center justify-between gap-3 rounded-lg border border-primary bg-primary px-4 py-2.5 md:px-5 md:py-3 transition-colors hover:bg-transparent focus:ring focus:outline-none w-full sm:w-auto"
                                                href="/products"
                                            >
                                                <span className="font-medium text-sm md:text-base text-white transition-colors group-hover:text-primary">
                                                    Continuar Comprando
                                                </span>
                                                <span className="shrink-0 rounded-full border border-current bg-white p-1.5 md:p-2 text-primary">
                                                    <svg
                                                        className="w-4 h-4 md:w-5 md:h-5 rtl:rotate-180"
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
                <div className="md:w-2/5 mt-6 md:mt-8">
                    <div className="mx-auto max-w-lg">
                        <header className="text-left flex flex-col w-full mb-3">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                Información del Comprador
                            </h1>
                            <p className="mt-2 text-sm md:text-base text-gray-600">Complete sus datos para continuar con la compra</p>
                        </header>
                        <div className="p-4 md:p-5 border shadow-md my-2 md:my-3 bg-white rounded-lg">
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
                                                    <p className="text-xs md:text-sm text-red-500 font-bold mb-2">
                                                        Hay productos en el carrito con stock insuficiente. Por favor, ajusta las cantidades.
                                                    </p>
                                                )}
                                                {!meetsMinimumPurchase && cartProducts.length > 0 && (
                                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3 rounded">
                                                        <p className="text-xs md:text-sm text-yellow-800">
                                                            <span className="font-semibold">Compra mínima:</span> ${formatPrice(MINIMUM_PURCHASE)}. 
                                                            <span className="block sm:inline sm:ml-1 mt-1 sm:mt-0">Te faltan ${formatPrice(MINIMUM_PURCHASE - total)} para alcanzar el mínimo.</span>
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex gap-2 flex-col sm:flex-row">
                                                    <button
                                                        onClick={() => setPaymentMethod('mercadopago')}
                                                        disabled={!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase}
                                                        className={`flex-1 rounded p-2 text-xs md:text-sm transition border-2 h-[60px] md:h-[70px] flex items-center justify-center
                                                            ${paymentMethod === 'mercadopago' ? 'border-purple-600 bg-secondary' : 'border-gray-300 bg-gray-100'}
                                                            ${(!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                                                        `}
                                                    >
                                                        <img
                                                            src="https://res.cloudinary.com/djuk4a84p/image/upload/v1755571794/MP_RGB_HANDSHAKE_color_horizontal_l0i6d8.svg"
                                                            alt="Mercado Pago"
                                                            className="h-[35px] md:h-[45px] w-auto mx-auto"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() => setPaymentMethod('transfer')}
                                                        disabled={!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase}
                                                        className={`flex-1 rounded p-2 text-xs md:text-sm transition border-2 font-bold
                                                            ${paymentMethod === 'transfer' ? 'border-purple-600 bg-secondary' : 'border-gray-300 bg-gray-100'}
                                                            ${(!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                                                        `}
                                                    >
                                                        Transferencia Bancaria
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={paymentMethod === 'mercadopago' ? mpCheckout : transferCheckout}
                                                    disabled={!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase}
                                                    className={`mt-4 block rounded px-4 py-3 md:px-5 md:py-3 w-full transition font-bold text-sm md:text-base
                                                    ${(!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                                                >
                                                    Realizar pedido
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (session) {
        return (
            <section className="flex justify-between max-md:flex-col md:space-x-4 px-2 md:px-4 pb-4 pt-20 max-w-[1600px] mx-auto">
                <div className="md:w-3/5">
                    <div className="mt-6 md:mt-8">
                        <header className="text-left flex justify-between w-full mb-4">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                Tu Carrito
                            </h1>
                        </header>
                        {!products?.length ? (
                            <p className="my-6 text-center">Tu Carrito Está Vacío.</p>
                        ) : (
                            <>
                                {renderCartProducts()}
                                <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
                                    <div className="w-full max-w-md space-y-4">
                                        <dl className="space-y-2 text-sm md:text-md text-text">
                                            <div className="flex justify-end text-red-500 border-b pb-2 mb-3">
                                                <button onClick={deleteCart} className="text-sm hover:underline">Borrar Carrito</button>
                                            </div>
                                            <div className="flex justify-between text-base md:text-lg font-semibold">
                                                <dt>Subtotal</dt>
                                                <dd>$ {formatPrice(total)}</dd>
                                            </div>
                                            {paymentMethod === 'transfer' && (
                                                <>
                                                    <div className="flex justify-between text-sm md:text-base text-green-600">
                                                        <dt>Descuento (10% por transferencia)</dt>
                                                        <dd>-$ {formatPrice(discount)}</dd>
                                                    </div>
                                                    <div className="flex justify-between text-lg md:text-xl font-bold border-t pt-2">
                                                        <dt>Total a Pagar</dt>
                                                        <dd>$ {formatPrice(finalTotal)}</dd>
                                                    </div>
                                                </>
                                            )}
                                            {paymentMethod !== 'transfer' && (
                                                <div className="flex justify-between text-base md:text-lg font-semibold">
                                                    <dt>Total</dt>
                                                    <dd>$ {formatPrice(total)}</dd>
                                                </div>
                                            )}
                                        </dl>
                                        <div className="flex justify-end">
                                            <Link
                                                className="group flex items-center justify-between gap-3 rounded-lg border border-primary bg-primary px-4 py-2.5 md:px-5 md:py-3 transition-colors hover:bg-transparent focus:ring focus:outline-none w-full sm:w-auto"
                                                href="/products"
                                            >
                                                <span className="font-medium text-sm md:text-base text-white transition-colors group-hover:text-primary">
                                                    Continuar Comprando
                                                </span>
                                                <span className="shrink-0 rounded-full border border-current bg-white p-1.5 md:p-2 text-primary">
                                                    <svg
                                                        className="w-4 h-4 md:w-5 md:h-5 rtl:rotate-180"
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
                    <div className="md:w-2/5 mt-6 md:mt-8">
                        <div className="mx-auto max-w-lg">
                            <header className="text-left flex flex-col w-full mb-3">
                                <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                    Detalles de Envío
                                </h1>
                                <p className="mt-2 text-sm md:text-base text-gray-600">Utilizamos los Datos de su Cuenta para el Envío.</p>
                            </header>
                            <div className="p-4 md:p-5 border shadow-md my-2 md:my-3 bg-white rounded-lg">
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
                                                <p className="text-xs md:text-sm text-red-500 font-bold mb-2">
                                                    Hay productos en el carrito con stock insuficiente. Por favor, ajusta las cantidades.
                                                </p>
                                            )}
                                            {!meetsMinimumPurchase && cartProducts.length > 0 && (
                                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3 rounded">
                                                    <p className="text-xs md:text-sm text-yellow-800">
                                                        <span className="font-semibold">Compra mínima:</span> ${formatPrice(MINIMUM_PURCHASE)}. 
                                                        <span className="block sm:inline sm:ml-1 mt-1 sm:mt-0">Te faltan ${formatPrice(MINIMUM_PURCHASE - total)} para alcanzar el mínimo.</span>
                                                    </p>
                                                </div>
                                            )}
                                            <div className="flex gap-2 flex-col sm:flex-row">
                                                <button
                                                    onClick={() => setPaymentMethod('mercadopago')}
                                                    disabled={!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase}
                                                    className={`flex-1 rounded p-2 text-xs md:text-sm transition border-2 h-[60px] md:h-[70px] flex items-center justify-center
                                                        ${paymentMethod === 'mercadopago' ? 'border-purple-600 bg-secondary' : 'border-gray-300 bg-gray-100'}
                                                        ${(!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                                                    `}
                                                >
                                                    <img
                                                        src="https://res.cloudinary.com/djuk4a84p/image/upload/v1755571794/MP_RGB_HANDSHAKE_color_horizontal_l0i6d8.svg"
                                                        alt="Mercado Pago"
                                                        className="h-[35px] md:h-[45px] w-auto mx-auto"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => setPaymentMethod('transfer')}
                                                    disabled={!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase}
                                                    className={`flex-1 rounded p-2 text-xs md:text-sm transition border-2 font-bold
                                                        ${paymentMethod === 'transfer' ? 'border-purple-600 bg-secondary' : 'border-gray-300 bg-gray-100'}
                                                        ${(!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                                                    `}
                                                >
                                                    Transferencia Bancaria
                                                </button>
                                            </div>
                                            <button
                                                onClick={paymentMethod === 'mercadopago' ? mpCheckout : transferCheckout}
                                                disabled={!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase}
                                                className={`mt-4 block rounded px-4 py-3 md:px-5 md:py-3 w-full transition font-bold text-sm md:text-base
                                                ${(!isCartValid || cartProducts.length === 0 || !formComplete || !meetsMinimumPurchase) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                                            >
                                                Realizar pedido
                                            </button>
                                        </div>
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
                <div className="flex flex-col gap-4 mt-6 max-w-sm mx-auto">
                    <button
                        onClick={() => signIn('google')}
                        className="inline-flex items-center justify-center gap-3 rounded-sm border-2 border-gray-300 bg-white px-8 py-3 text-md font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continuar con Google
                    </button>
                    <button
                        onClick={() => signIn('facebook')}
                        className="inline-flex items-center justify-center gap-3 rounded-sm border-2 border-[#1877F2] bg-[#1877F2] px-8 py-3 text-md font-medium text-white hover:bg-[#166FE5]"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Continuar con Facebook
                    </button>
                </div>
            </div>
        </div>
    );
}