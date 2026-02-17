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

    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (cartProducts.length > 0) {
            setCartBounce(true);
            const timer = setTimeout(() => setCartBounce(false), 600);
            return () => clearTimeout(timer);
        }
    }, [cartProducts.length]);

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/products', label: 'Productos' },
    ];

    return (
        <>
            <div className="h-[92px]" /> {/* 28px banner + 64px header */}
            
            <header className={`fixed top-7 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled 
                    ? 'bg-white shadow-lg shadow-black/5' 
                    : 'bg-white'
            }`}>
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />
                
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="group transition-all duration-300 hover:scale-105">
                            <div className="relative px-2 py-1 bg-white rounded-lg">
                                <img 
                                    src="https://res.cloudinary.com/djuk4a84p/image/upload/v1757197833/logo_valentino_y57cmb.png"
                                    alt="Valentino Paris"
                                    className="h-10 w-auto sm:h-12 transition-all duration-300 group-hover:brightness-110"
                                />
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:block">
                            <ul className="flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link 
                                            href={link.href}
                                            className={`relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                                                pathname === link.href
                                                    ? 'text-red-600'
                                                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50/50'
                                            }`}
                                        >
                                            {link.label}
                                            {pathname === link.href && (
                                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
                                            )}
                                        </Link>
                                    </li>
                                ))}
                                
                                {/* Línea Económica - Special Link */}
                                <li>
                                    <Link 
                                        href="/products?category=Linea%20Economica"
                                        className="relative flex items-center gap-1.5 px-3 py-1.5 ml-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group"
                                    >
                                        {/* Tag Icon */}
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <span className="text-xs uppercase tracking-wide font-extrabold">
                                            Linea Economica
                                        </span>
                                        <span className="text-[10px] bg-yellow-400 text-green-900 px-1.5 py-0.5 rounded-full font-extrabold shadow-sm">
                                            AHORRO
                                        </span>
                                        
                                        {/* Elegant Tooltip/Banner on hover */}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                            <div className="bg-white/95 backdrop-blur-md px-5 py-4 rounded-xl shadow-2xl border border-gray-200/50">
                                                <div className="text-center space-y-2">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gray-300"></div>
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                                            Oferta Exclusiva
                                                        </span>
                                                        <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gray-300"></div>
                                                    </div>
                                                    <div className="text-lg font-bold text-gray-800 tracking-tight">
                                                        2×1 en Línea Económica
                                                    </div>
                                                    <div className="text-sm text-gray-600 font-medium">
                                                        A partir de <span className="text-emerald-700 font-bold">72 unidades</span>
                                                    </div>
                                                </div>
                                                {/* Subtle arrow pointing up */}
                                                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-200/50 rotate-45"></div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                            {/* Cart */}
                            <Link
                                href="/cart"
                                className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-red-50 ${
                                    cartBounce ? 'animate-bounce' : ''
                                }`}
                            >
                                <div className="relative">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth="1.5" 
                                        stroke="currentColor" 
                                        className="w-6 h-6 text-gray-600 group-hover:text-red-600 transition-colors"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    
                                    {cartProducts.length > 0 && (
                                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white shadow-lg">
                                            {cartProducts.length}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden sm:inline text-sm font-medium text-gray-600 group-hover:text-red-600 transition-colors">
                                    Carrito
                                </span>
                            </Link>

                            {/* Account */}
                            {session ? (
                                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                                    <div className="relative h-9 w-9 group">
                                        <img 
                                            src={session.user.image} 
                                            alt={session.user.name}
                                            className="h-full w-full rounded-full object-cover border-2 border-gray-200 group-hover:border-red-500 transition-all duration-300" 
                                        />
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/"
                                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:border-red-500 hover:text-red-600 hover:bg-red-50/50 transition-all duration-300"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Cuenta
                                </Link>
                            )}

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'
                }`}>
                    <div className="bg-white/95 backdrop-blur-xl px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    pathname === link.href
                                        ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-red-600'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        
                        {/* Línea Económica - Mobile */}
                        <Link
                            href="/products?category=Linea%20Economica"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="relative flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:from-green-600 hover:to-emerald-700 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-2">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="w-5 h-5" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className="text-sm font-extrabold uppercase tracking-wide">
                                    Línea Económica
                                </span>
                            </div>
                            <span className="text-xs bg-yellow-400 text-green-900 px-2 py-1 rounded-full font-extrabold shadow-sm">
                                AHORRO
                            </span>
                            
                            {/* Mobile promo badge - elegant version */}
                            <div className="absolute -top-2 -right-2 bg-white text-gray-700 px-2 py-1 rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="text-[9px] font-bold uppercase tracking-wide">
                                    2×1 · 72u+
                                </div>
                            </div>
                        </Link>
                        
                        {!session && (
                            <Link
                                href="/"
                                className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all duration-300"
                            >
                                Mi Cuenta
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}