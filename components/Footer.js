import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <footer className="relative bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #dc2626 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 xl:py-16">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 transform transition-all duration-1000 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    {/* Brand Column */}
                    <div className="space-y-4 sm:space-y-5 lg:space-y-6 text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                            Valentino Paris
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
                            Accesorios para el cabello al por mayor. Novedades, tendencias y amplio stock para tu negocio.
                        </p>
                        
                        {/* Social Icons */}
                        <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start">
                            <a
                                href="https://www.galeriabelgrano.com.ar/locales/Soledad/36"
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 active:scale-95"
                                aria-label="Website"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com/soledadaccesorios"
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 active:scale-95"
                                aria-label="Instagram"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Empresa Column */}
                    <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
                        <h3 className="text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wider">
                            Empresa
                        </h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <Link 
                                    href="/about"
                                    className="text-gray-600 hover:text-red-600 text-xs sm:text-sm transition-colors duration-300 inline-flex items-center group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                        Sobre Nosotros
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/contact"
                                    className="text-gray-600 hover:text-red-600 text-xs sm:text-sm transition-colors duration-300 inline-flex items-center group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                        Contacto
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Servicios Column */}
                    <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
                        <h3 className="text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wider">
                            Servicios
                        </h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <Link 
                                    href="/products"
                                    className="text-gray-600 hover:text-red-600 text-xs sm:text-sm transition-colors duration-300 inline-flex items-center group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                        Productos
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/shipping"
                                    className="text-gray-600 hover:text-red-600 text-xs sm:text-sm transition-colors duration-300 inline-flex items-center group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                        Envíos
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
                        <h3 className="text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wider">
                            Legal
                        </h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <Link 
                                    href="/privacy"
                                    className="text-gray-600 hover:text-red-600 text-xs sm:text-sm transition-colors duration-300 inline-flex items-center group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                        Privacidad
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/terms"
                                    className="text-gray-600 hover:text-red-600 text-xs sm:text-sm transition-colors duration-300 inline-flex items-center group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                        Términos
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Compra Segura Column */}
                    <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
                        <h3 className="text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wider">
                            Compra 100% Segura
                        </h3>
                        <div className="space-y-2">
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                Nuestro sitio tiene toda la seguridad para tu compra
                            </p>
                            <div className="flex gap-4 items-center justify-center sm:justify-start pt-2">
                                <img 
                                    src="https://letsencrypt.org/images/le-logo-standard.png" 
                                    alt="Let's Encrypt" 
                                    className="h-14 sm:h-16 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
                                />
                                <a 
                                    href="https://res.cloudinary.com/djuk4a84p/image/upload/v1771525227/F960_dgp5a6.jpg" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                                >
                                    <img 
                                        src="https://www.afip.gob.ar/images/f960/DATAWEB.jpg" 
                                        alt="Data Fiscal"
                                        className="h-14 sm:h-16 w-auto"
                                        border="0"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                    <p className="text-center text-xs sm:text-sm text-gray-600 px-4">
                        © 2026 Valentino | Paris – Todos los derechos reservados
                    </p>
                </div>
            </div>
        </footer>
    );
}
