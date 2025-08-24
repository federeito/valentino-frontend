import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({children}) {
    const ls = typeof window !== 'undefined' ? window.localStorage : null;
    const [cartProducts, setCartProducts] = useState([]);

    // Cargar productos del localStorage al inicializar
    useEffect(() => {
        if(ls && ls.getItem('cart')) {
            try {
                const savedCart = JSON.parse(ls.getItem('cart'));
                setCartProducts(savedCart || []);
            } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
                // Si hay error, limpia el localStorage corrupto
                ls.removeItem('cart');
                setCartProducts([]);
            }
        }
    }, []);

    // Guardar productos en localStorage cuando cambie el carrito
    useEffect(() => {
        if (ls) {
            if (cartProducts.length > 0) {
                ls.setItem('cart', JSON.stringify(cartProducts));
            } else {
                // CRÍTICO: Limpia localStorage cuando el carrito está vacío
                ls.removeItem('cart');
            }
        }
    }, [cartProducts]);

    function addProduct(productId) {
        setCartProducts(prev => [...prev, productId]);
    }

    function removeProduct(productId) {
        setCartProducts(prev => {
            const position = prev.indexOf(productId);
            if (position !== -1) {
                return prev.filter((value, index) => index !== position);
            }
            return prev;
        });
    }

    function clearCart() {
        if (ls) {
            ls.removeItem('cart');
        }
        setCartProducts([]);
    }

    return (
        <CartContext.Provider value={{cartProducts, setCartProducts, addProduct, removeProduct, clearCart}}>
            {children}
        </CartContext.Provider>
    );
}