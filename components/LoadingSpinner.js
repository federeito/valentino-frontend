// LoadingSpinner.js - Spinner moderno con gradientes
export function LoadingSpinner({ size = 'md', color = 'primary' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const colorClasses = {
        primary: 'border-primary border-t-secondary',
        secondary: 'border-secondary border-t-accent',
        accent: 'border-accent border-t-primary'
    };

    return (
        <div className={`${sizeClasses[size]} border-4 border-solid rounded-full animate-spin ${colorClasses[color]} border-opacity-30 border-t-opacity-100`} />
    );
}

// AnimatedButton.js - Botón con múltiples efectos
export function AnimatedButton({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'md', 
    disabled = false,
    icon: Icon,
    loading = false 
}) {
    const baseClasses = "relative overflow-hidden font-bold rounded-xl transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50";
    
    const variants = {
        primary: `bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 focus:ring-primary`,
        secondary: `bg-gradient-to-r from-secondary to-accent text-white shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/40 hover:scale-105 focus:ring-secondary`,
        outline: `border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary`,
        glass: `bg-white/20 backdrop-blur-lg border border-white/30 text-gray-800 hover:bg-white/30 focus:ring-white/50`,
        ghost: `text-primary hover:bg-primary/10 focus:ring-primary/20`
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-md',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                    <LoadingSpinner size="sm" />
                ) : Icon ? (
                    <Icon className="w-5 h-5" />
                ) : null}
                {children}
            </span>
        </button>
    );
}

// FloatingCard.js - Tarjeta con efectos de hover modernos
export function FloatingCard({ 
    children, 
    className = "", 
    hover = true,
    glow = false 
}) {
    return (
        <div className={`
            bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl 
            transition-all duration-500 
            ${hover ? 'hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/10' : ''}
            ${glow ? 'ring-1 ring-primary/20 hover:ring-primary/40' : ''}
            ${className}
        `}>
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />
            
            <div className="relative z-10 p-6">
                {children}
            </div>
        </div>
    );
}

// GradientText.js - Texto con gradiente animado
export function GradientText({ 
    children, 
    gradient = "from-primary via-secondary to-accent",
    animate = false,
    className = ""
}) {
    return (
        <span className={`
            bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-bold
            ${animate ? 'bg-size-200 animate-gradient' : ''}
            ${className}
        `}>
            {children}
        </span>
    );
}

// ParallaxSection.js - Sección con efecto parallax
export function ParallaxSection({ 
    children, 
    backgroundImage, 
    intensity = 0.5,
    className = "" 
}) {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.pageYOffset * intensity);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [intensity]);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {backgroundImage && (
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        transform: `translateY(${offset}px)`
                    }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

// AnimatedCounter.js - Contador animado
export function AnimatedCounter({ 
    end, 
    duration = 2000, 
    prefix = "", 
    suffix = "",
    className = "" 
}) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                    let start = 0;
                    const increment = end / (duration / 16);
                    
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                    
                    return () => clearInterval(timer);
                }
            },
            { threshold: 0.5 }
        );

        const element = document.getElementById(`counter-${end}`);
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, [end, duration, isVisible]);

    return (
        <span 
            id={`counter-${end}`}
            className={`font-bold text-primary ${className}`}
        >
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}

// PulseButton.js - Botón con efecto de pulso
export function PulseButton({ children, onClick, className = "" }) {
    const [pulses, setPulses] = useState([]);

    const handleClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newPulse = {
            id: Date.now(),
            x,
            y
        };
        
        setPulses(prev => [...prev, newPulse]);
        
        // Remove pulse after animation
        setTimeout(() => {
            setPulses(prev => prev.filter(pulse => pulse.id !== newPulse.id));
        }, 600);
        
        if (onClick) onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            className={`relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${className}`}
        >
            {children}
            
            {/* Pulse effects */}
            {pulses.map(pulse => (
                <span
                    key={pulse.id}
                    className="absolute bg-white rounded-full opacity-50 animate-ping"
                    style={{
                        left: pulse.x - 10,
                        top: pulse.y - 10,
                        width: 20,
                        height: 20,
                        animationDuration: '0.6s'
                    }}
                />
            ))}
        </button>
    );
}

// ProgressBar.js - Barra de progreso animada
export function ProgressBar({ 
    progress, 
    showLabel = true, 
    color = 'primary',
    height = 'md',
    animated = true 
}) {
    const heights = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
    };

    const colors = {
        primary: 'from-primary to-secondary',
        secondary: 'from-secondary to-accent',
        accent: 'from-accent to-primary'
    };

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progreso</span>
                    <span className="text-sm font-bold text-primary">{progress}%</span>
                </div>
            )}
            
            <div className={`w-full bg-gray-200 rounded-full ${heights[height]} overflow-hidden`}>
                <div
                    className={`${heights[height]} bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                >
                    {animated && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    )}
                </div>
            </div>
        </div>
    );
}

// CSS adicional para las animaciones
const additionalStyles = `
<style jsx global>{
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    @keyframes gradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
    
    .animate-shimmer {
        animation: shimmer 2s infinite;
    }
    
    .animate-gradient {
        animation: gradient 3s ease infinite;
    }
    
    .bg-size-200 {
        background-size: 200% 200%;
    }
    
    /* Glass morphism utilities */
    .glass {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .glass-dark {
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Custom shadows */
    .shadow-glow {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }
    
    .shadow-glow-lg {
        box-shadow: 0 0 40px rgba(59, 130, 246, 0.4);
    }
}</style>
`;

// Exportar también el CSS
export const EnhancedStyles = () => (
    <style jsx global>{`
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        .animate-shimmer {
            animation: shimmer 2s infinite;
        }
        
        .animate-gradient {
            animation: gradient 3s ease infinite;
        }
        
        .bg-size-200 {
            background-size: 200% 200%;
        }
        
        .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-dark {
            background: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .shadow-glow {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
        
        .shadow-glow-lg {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.4);
        }
    `}</style>
);