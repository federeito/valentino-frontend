import { createContext, useEffect, useState, useRef } from "react";

export const CartContext = createContext({});

export function CartContextProvider({children}) {
    const [cartProducts, setCartProducts] = useState([]);
    const isInitialMount = useRef(true);

    // Cargar productos del localStorage al inicializar
    useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const savedCart = window.localStorage.getItem('cart');
            if (savedCart) {
                try {
                    const parsedCart = JSON.parse(savedCart);
                    setCartProducts(parsedCart || []);
                } catch (error) {
                    console.error('Error parsing cart from localStorage:', error);
                    // Si hay error, limpia el localStorage corrupto
                    window.localStorage.removeItem('cart');
                    setCartProducts([]);
                }
            }
        }
        isInitialMount.current = false;
    }, []); // Sin dependencias - solo se ejecuta una vez al montar

    // Guardar productos en localStorage cuando cambie el carrito
    useEffect(() => {
        // No guardar en el primer render/mount para evitar sobreescribir
        if (isInitialMount.current) {
            return;
        }

        if (typeof window !== 'undefined' && window.localStorage) {
            if (cartProducts.length > 0) {
                window.localStorage.setItem('cart', JSON.stringify(cartProducts));
            } else {
                // CRÍTICO: Limpia localStorage cuando el carrito está vacío
                window.localStorage.removeItem('cart');
            }
        }
    }, [cartProducts]); // Solo depende de cartProducts

    function addProduct(productId, properties = {}) {
        setCartProducts(prev => {
            const productItem = {
                productId,
                ...properties
            };
            return [...prev, productItem];
        });
    }

    function removeProduct(productId, properties = {}) {
        setCartProducts(prev => {
            const productIndex = prev.findIndex(item => {
                // Si es un objeto con propiedades, comparar también las propiedades
                if (typeof item === 'object' && item.productId) {
                    let matches = item.productId === productId;
                    
                    // Si hay propiedades específicas (como color), también compararlas
                    if (properties.color && item.color) {
                        matches = matches && item.color.name === properties.color.name;
                    }
                    
                    return matches;
                }
                // Compatibilidad con el formato anterior (solo ID)
                return item === productId;
            });
            
            if (productIndex !== -1) {
                return prev.filter((_, index) => index !== productIndex);
            }
            return prev;
        });
    }

    function clearCart() {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem('cart');
        }
        setCartProducts([]);
    }

    // Función auxiliar para contar productos en el carrito
    function getProductCount(productId, properties = {}) {
        return cartProducts.filter(item => {
            if (typeof item === 'object' && item.productId) {
                let matches = item.productId === productId;
                
                if (properties.color && item.color) {
                    matches = matches && item.color.name === properties.color.name;
                }
                
                return matches;
            }
            return item === productId;
        }).length;
    }

    // Función para obtener todos los productos únicos con sus variantes
    function getUniqueProducts() {
        const uniqueProducts = [];
        const seen = new Set();

        cartProducts.forEach(item => {
            let key;
            if (typeof item === 'object' && item.productId) {
                key = item.productId + (item.color ? `-${item.color.name}` : '');
                if (!seen.has(key)) {
                    uniqueProducts.push(item);
                    seen.add(key);
                }
            } else {
                key = item;
                if (!seen.has(key)) {
                    uniqueProducts.push({ productId: item });
                    seen.add(key);
                }
            }
        });

        return uniqueProducts;
    }

    return (
        <CartContext.Provider value={{
            cartProducts, 
            setCartProducts, 
            addProduct, 
            removeProduct, 
            clearCart,
            getProductCount,
            getUniqueProducts
        }}>
            {children}
        </CartContext.Provider>
    );
}