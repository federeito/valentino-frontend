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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            
            <header className={`backdrop-blur-xl border-b border-gradient-to-r from-primary/20 to-secondary/20 sticky top-0 z-40 transition-all duration-500 ${
                isScrolled ? 'bg-white shadow-lg shadow-primary/10' : 'bg-white/90'
            }`}>
                <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-8 px-4 sm:px-6 lg:px-8 text-lg">
                    {/* Logo animado */}
                    <Link className="text-primary flex items-center gap-2 group transition-all duration-300 hover:scale-105" href="/">
                        <span className="sr-only">Home</span>
                        <div className="relative">
                            <img 
                                src="https://res.cloudinary.com/djuk4a84p/image/upload/v1757197833/logo_valentino_y57cmb.png"
                                alt="Valentino Paris Logo"
                                className="h-12 w-auto transition-all duration-300 group-hover:rotate-1"
                            />
                            {/* Sparkle effect */}
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-ping opacity-75" />
                        </div>
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

                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Mobile menu button con animación */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="block rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-2.5 text-gray-600 transition-all duration-300 hover:from-primary/10 hover:to-secondary/10 hover:text-primary hover:shadow-md md:hidden group order-1 md:order-none"
                            >
                                <span className="sr-only">Toggle menu</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`size-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <div className="flex items-center gap-2 sm:gap-4">
                                {/* Carrito animado */}
                                <Link
                                    className={`group rounded-lg text-sm flex items-center font-medium transition-all duration-300 p-2 sm:p-2.5 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:shadow-md order-2 md:order-none ${
                                        cartBounce ? 'animate-bounce' : ''
                                    }`}
                                    href="/cart"
                                >
                                    <div className="relative flex items-center">
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
                                        
                                        <span className={`ml-1 font-bold transition-all duration-300 min-w-[20px] text-center px-1.5 py-0.5 rounded-full ${
                                            cartProducts.length > 0 
                                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' 
                                                : 'text-primary group-hover:text-secondary'
                                        }`}>
                                            {cartProducts.length}
                                        </span>
                                    </div>
                                </Link>

                                {session ? (
                                    <div className="flex items-center gap-2 sm:gap-2 border-l border-primary/20 pl-2 sm:pl-4 order-3 md:order-none">
                                        <div className="h-8 w-8 sm:h-10 sm:w-10 relative group">
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
                                        className="text-sm font-medium px-3 py-2 sm:px-4 sm:py-2 transition-all duration-300 border border-primary/20 rounded-lg hover:border-primary hover:bg-primary/5 hover:shadow-md order-3 md:order-none whitespace-nowrap"
                                        href="/"
                                    >
                                        Mi cuenta
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen 
                        ? 'max-h-64 opacity-100 visible'
                        : 'max-h-0 opacity-0 invisible'
                }`}>
                    <nav className="px-4 pt-2 pb-4 space-y-2 bg-white/95 backdrop-blur-xl border-t border-primary/10">
                        <Link 
                            href="/"
                            className={`block py-2 px-4 rounded-lg transition-all duration-300 ${
                                pathname === '/' 
                                    ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-bold'
                                    : 'text-gray-500 hover:bg-primary/5'
                            }`}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/products"
                            className={`block py-2 px-4 rounded-lg transition-all duration-300 ${
                                pathname === '/products'
                                    ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-bold'
                                    : 'text-gray-500 hover:bg-primary/5'
                            }`}
                        >
                            Todos los Productos
                        </Link>
                    </nav>
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