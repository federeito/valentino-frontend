import { CartContext } from "@/lib/CartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";

export default function Header() {
    const router = useRouter();
    const { pathname } = router;
    const { cartProducts } = useContext(CartContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartBounce, setCartBounce] = useState(false);

    const active = 'text-primary transition-all duration-300 hover:text-secondary font-bold relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-primary after:to-secondary after:transform after:scale-x-100 after:transition-transform after:duration-300';
    const inactive = 'text-gray-500 transition-all duration-300 hover:text-primary font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:after:w-full';

    const { data: session } = useSession();

    // Efecto para detectar scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Efecto para animar el carrito cuando se agregan items
    useEffect(() => {
        if (cartProducts.length > 0) {
            setCartBounce(true);
            const timer = setTimeout(() => setCartBounce(false), 600);
            return () => clearTimeout(timer);
        }
    }, [cartProducts.length]);

    return (
        <>
            {/* Animated background blur effect */}
            <div className="fixed top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-30 blur-3xl -z-10" />
            
            <header className={`bg-white/90 backdrop-blur-xl border-b border-gradient-to-r from-primary/20 to-secondary/20 sticky top-0 z-40 transition-all duration-500 ${
                isScrolled ? 'shadow-lg shadow-primary/10' : ''
            }`}>
                <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-8 px-4 sm:px-6 lg:px-8 text-lg">
                    {/* Logo animado */}
                    <Link className="text-primary flex items-center gap-2 group transition-all duration-300 hover:scale-105" href="/">
                        <span className="sr-only">Home</span>
                        <div className="relative">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth="1.5" 
                                stroke="currentColor" 
                                className="size-6 transition-all duration-300 group-hover:rotate-12 group-hover:text-secondary"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                            </svg>
                            {/* Sparkle effect */}
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-ping opacity-75" />
                        </div>
                        <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Valentino PARIS
                        </span>
                    </Link>

                    <div className="flex flex-1 items-center justify-end md:justify-between">
                        <nav aria-label="Global" className="hidden md:block">
                            <ul className="flex items-center gap-8 text-sm">
                                <li className="relative">
                                    <Link className={pathname === '/' ? active : inactive} href="/">
                                        Home
                                    </Link>
                                </li>
                                <li className="relative">
                                    <Link className={pathname === '/products' ? active : inactive} href="/products">
                                        Todos los Productos
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        <div className="flex items-center gap-4">
                            <div className="sm:flex sm:gap-4 items-center">
                                {session ? (
                                    <div className="sm:flex sm:gap-2 border-r border-primary/20 pr-4">
                                        <div className="h-10 w-10 relative group">
                                            <img 
                                                src={session.user.image} 
                                                alt={session.user.name}
                                                className="h-full w-full rounded-full object-cover object-center border-2 border-primary/20 transition-all duration-300 group-hover:border-secondary group-hover:shadow-lg group-hover:shadow-primary/20" 
                                            />
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        className="text-sm font-medium px-4 py-2 transition-all duration-300 border border-primary/20 rounded-lg hover:border-primary hover:bg-primary/5 hover:shadow-md"
                                        href="/"
                                    >
                                        Mi cuenta
                                    </Link>
                                )}

                                {/* Carrito animado */}
                                <Link
                                    className={`group rounded-lg text-sm flex items-center font-medium transition-all duration-300 p-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:shadow-md ${
                                        cartBounce ? 'animate-bounce' : ''
                                    }`}
                                    href="/cart"
                                >
                                    <div className="relative">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            strokeWidth="1.5" 
                                            stroke="currentColor" 
                                            className="size-5 transition-all duration-300 group-hover:text-primary"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                        {/* Glow effect cuando hay items */}
                                        {cartProducts.length > 0 && (
                                            <div className="absolute inset-0 animate-pulse">
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    strokeWidth="1.5" 
                                                    stroke="currentColor" 
                                                    className="size-5 text-secondary opacity-50"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <span className={`ml-2 font-bold transition-all duration-300 px-2 py-1 rounded-full ${
                                        cartProducts.length > 0 
                                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' 
                                            : 'text-primary group-hover:text-secondary'
                                    }`}>
                                        {cartProducts.length}
                                    </span>
                                </Link>
                            </div>

                            {/* Mobile menu button con animación */}
                            <button
                                className="block rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-2.5 text-gray-600 transition-all duration-300 hover:from-primary/10 hover:to-secondary/10 hover:text-primary hover:shadow-md md:hidden group"
                            >
                                <span className="sr-only">Toggle menu</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5 transition-transform duration-300 group-hover:rotate-90"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Gradient border bottom */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </header>

            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </>
    );
}