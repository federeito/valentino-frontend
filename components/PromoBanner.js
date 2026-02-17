import { useState, useEffect } from 'react';

export default function PromoBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const promos = [
        { text: "Compra mínima $300.000", icon: "💰" },
        { text: "10% OFF pagando con transferencia", icon: "💳" },
        { text: "Envío gratis en CABA y desde $600.000 al resto del país", icon: "🚚" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % promos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 text-white overflow-hidden shadow-sm">
            <div className="relative h-7 flex items-center justify-center">
                {promos.map((promo, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-700 transform ${
                            index === currentIndex
                                ? 'translate-y-0 opacity-100'
                                : index < currentIndex
                                ? '-translate-y-full opacity-0'
                                : 'translate-y-full opacity-0'
                        }`}
                    >
                        <span className="text-sm">{promo.icon}</span>
                        <p className="text-[11px] sm:text-xs font-medium tracking-wide text-center px-4">
                            {promo.text}
                        </p>
                    </div>
                ))}
                
                {/* Dots indicator */}
                <div className="absolute right-3 flex gap-1">
                    {promos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-1 h-1 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'bg-white w-3'
                                    : 'bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`Go to promo ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
