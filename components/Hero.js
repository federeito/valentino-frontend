import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// ─── CONFIGURACIÓN DE SLIDES ─────────────────────────────────────────────────
const SLIDES = [
  {
    id: "slide-1",
    // Subí 2.png a Cloudinary y pegá la URL acá:
    image: "https://res.cloudinary.com/djuk4a84p/image/upload/f_auto,q_auto:good,w_1600/v1772492898/2_wrvgzz.png",
    badge: "✦ Colección 2025",
    eyebrow: "",
    title: ["Colecciones", "exclusivas de", "accesorios"],
    titleAccent: "para el cabello",
    subtitle: "Colecciones exclusivas de accesorios para el cabello",
    microbadges: [""],
    buttons: [
      { label: "Explorar Colección", href: "/products", variant: "primary" },
      { label: "Contactar", href: "/contact", variant: "ghost" },
    ],
  },
  {
    id: "slide-2",
    image: "https://res.cloudinary.com/djuk4a84p/image/upload/f_auto,q_auto:good,w_1600/v1772552330/3_vim6e0.png",
    badge: "✦ Nuevos Ingresos",
    eyebrow: "Temporada 2025",
    title: ["Elegancia", "en cada"],
    titleAccent: "detalle",
    subtitle: "Accesorios seleccionados para potenciar tu negocio con estilo.",
    microbadges: ["✔ Envíos a todo el país", "✔ Compra 100% online"],
    buttons: [
      { label: "Explorar Colección", href: "/products", variant: "primary" },
    ],
  },
  {
    id: "slide-3",
    image: "https://res.cloudinary.com/djuk4a84p/image/upload/f_auto,q_auto:good,w_1600/v1771850496/2_i7caob.jpg",
    badge: "✦ Precios Mayoristas",
    eyebrow: "Nueva Temporada",
    title: ["Brillos que"],
    titleAccent: "enamoran",
    subtitle: "Comprá en cantidad y obtené los mejores precios del mercado.",
    microbadges: ["✔ Envíos a todo el país", "✔ Compra 100% online"],
    buttons: [
      { label: "Explorar Colección", href: "/products", variant: "primary" },
      { label: "Ver Precios", href: "/products", variant: "ghost" },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const DURATION = 6000;

function useCarousel(total) {
  const [cur, setCur] = useState(0);
  const [prog, setProg] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (idx) => {
      setCur((idx + total) % total);
      setProg(0);
    },
    [total]
  );

  const next = useCallback(() => goTo(cur + 1), [cur, goTo]);
  const prev = useCallback(() => goTo(cur - 1), [cur, goTo]);

  useEffect(() => {
    if (paused) return;
    const step = 100 / (DURATION / 80);
    const pt = setInterval(() => setProg((p) => Math.min(p + step, 100)), 80);
    const st = setTimeout(next, DURATION);
    return () => { clearInterval(pt); clearTimeout(st); };
  }, [cur, paused, next]);

  return { cur, prog, paused, setPaused, goTo, next, prev };
}

export default function Hero() {
  const total = SLIDES.length;
  const { cur, prog, paused, setPaused, goTo, next, prev } = useCarousel(total);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(500px, 80vh, 650px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── SLIDES ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 grid grid-cols-1 lg:grid-cols-[46%_54%] transition-opacity duration-[850ms]"
          style={{
            opacity: i === cur ? 1 : 0,
            pointerEvents: i === cur ? "auto" : "none",
          }}
        >
          {/* LEFT — dark panel */}
          <div
            className="relative flex flex-col justify-center overflow-hidden order-2 lg:order-1"
            style={{
              background: "linear-gradient(160deg, #1c1412 0%, #231816 100%)",
              padding: "clamp(24px, 4vw, 64px) clamp(20px, 5vw, 48px)",
            }}
          >
            {/* Warm glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-60px", left: "-60px",
                width: "clamp(180px, 30vw, 280px)",
                height: "clamp(180px, 30vw, 280px)",
                background: "radial-gradient(circle, rgba(220,38,38,0.10) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
            {/* Right border accent - hidden on mobile */}
            <div
              className="absolute right-0 hidden lg:block"
              style={{
                top: "15%", bottom: "15%", width: "1px",
                background: "linear-gradient(to bottom, transparent, rgba(220,38,38,0.45), transparent)",
              }}
            />

            {/* Badge */}
            <span
              className="inline-flex items-center w-fit mb-2 lg:mb-3 px-2.5 lg:px-3 py-1 rounded-full text-[9px] lg:text-[10px] font-medium tracking-widest uppercase"
              style={{
                color: "#dc2626",
                background: "rgba(220,38,38,0.12)",
                border: "1px solid rgba(220,38,38,0.28)",
                opacity: i === cur ? 1 : 0,
                transition: "opacity 500ms 60ms",
              }}
            >
              {slide.badge}
            </span>

            {/* Eyebrow */}
            <p
              className="flex items-center gap-2 mb-2 lg:mb-3 text-[10px] lg:text-[11px] font-normal tracking-[0.18em] lg:tracking-[0.22em] uppercase"
              style={{
                color: "rgba(245,240,235,0.5)",
                opacity: i === cur ? 1 : 0,
                transform: i === cur ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 580ms 120ms, transform 580ms 120ms",
              }}
            >
              <span
                className="flex-shrink-0 rounded w-[18px] lg:w-[22px]"
                style={{ height: "1.5px", background: "linear-gradient(135deg,#dc2626,#ec4899)" }}
              />
              {slide.eyebrow}
            </p>

            {/* Headline */}
            <h2
              className="font-light leading-[1.12] mb-2 lg:mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(32px, 6vw, 56px)",
                color: "#f5f0eb",
                opacity: i === cur ? 1 : 0,
                transform: i === cur ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 680ms 200ms, transform 680ms 200ms",
              }}
            >
              {slide.title.map((line, j) => (
                <span key={j} className="block">{line}</span>
              ))}
              <em
                className="not-italic block"
                style={{
                  fontStyle: "italic",
                  background: "linear-gradient(135deg,#dc2626,#ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {slide.titleAccent}
              </em>
            </h2>

            {/* Rule */}
            <div
              className="rounded mb-3 lg:mb-4"
              style={{
                height: "2px",
                background: "linear-gradient(135deg,#dc2626,#ec4899)",
                opacity: i === cur ? 1 : 0,
                width: i === cur ? "clamp(42px, 10vw, 52px)" : "30px",
                transition: "opacity 500ms 310ms, width 500ms 310ms",
              }}
            />

            {/* Subtitle */}
            <p
              className="mb-4 lg:mb-5 font-light leading-[1.6] lg:leading-[1.75]"
              style={{
                fontSize: "clamp(13px, 1.2vw, 14px)",
                color: "rgba(245,240,235,0.55)",
                maxWidth: "100%",
                opacity: i === cur ? 1 : 0,
                transform: i === cur ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 560ms 360ms, transform 560ms 360ms",
              }}
            >
              {slide.subtitle}
            </p>

            {/* Micro badges */}
            <div
              className="flex flex-wrap gap-1.5 lg:gap-2 mb-5 lg:mb-6"
              style={{
                opacity: i === cur ? 1 : 0,
                transform: i === cur ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 560ms 420ms, transform 560ms 420ms",
              }}
            >
              {slide.microbadges.map((mb, k) => (
                <span
                  key={k}
                  className="text-[9px] lg:text-[10px] font-medium tracking-wide px-2.5 lg:px-3 py-1 rounded-full"
                  style={{
                    color: "rgba(245,240,235,0.75)",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {mb}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div
              className="flex flex-wrap gap-2"
              style={{
                opacity: i === cur ? 1 : 0,
                transform: i === cur ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 560ms 480ms, transform 560ms 480ms",
              }}
            >
              {slide.buttons.map((btn, k) =>
                btn.variant === "primary" ? (
                  <Link
                    key={k}
                    href={btn.href}
                    className="group inline-flex items-center gap-2 rounded-lg font-medium tracking-wider uppercase transition-all duration-250 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95"
                    style={{
                      padding: "clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 22px)",
                      fontSize: "clamp(9px, 1vw, 12px)",
                      letterSpacing: "0.13em",
                      background: "linear-gradient(135deg,#dc2626,#ec4899)",
                      color: "#fff",
                      boxShadow: "0 4px 20px rgba(220,38,38,0.32)",
                    }}
                  >
                    {btn.label}
                    <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    key={k}
                    href={btn.href}
                    className="inline-flex items-center gap-2 rounded-lg font-medium tracking-wider uppercase transition-all duration-250 hover:-translate-y-0.5 active:scale-95"
                    style={{
                      padding: "clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 22px)",
                      fontSize: "clamp(9px, 1vw, 12px)",
                      letterSpacing: "0.13em",
                      background: "rgba(255,255,255,0.07)",
                      color: "rgba(245,240,235,0.85)",
                      border: "1.5px solid rgba(245,240,235,0.18)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {btn.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* RIGHT — photo */}
          <div className="relative overflow-hidden order-1 lg:order-2 h-[280px] lg:h-auto">
            <Image
              src={slide.image}
              alt={slide.subtitle}
              fill
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              quality={85}
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover object-center transition-transform duration-[8000ms]"
              style={{ transform: i === cur ? "scale(1.06)" : "scale(1)" }}
            />
            {/* Left vignette blending into dark panel */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to right, rgba(28,20,18,0.25) 0%, transparent 35%)",
              }}
            />
          </div>
        </div>
      ))}

      {/* ── ARROW BUTTONS ── */}
      {[
        { id: "prev", action: prev, d: "M15 19l-7-7 7-7", side: { left: "8px lg:left-[14px]" } },
        { id: "next", action: next, d: "M9 5l7 7-7 7",   side: { right: "8px lg:right-[14px]" } },
      ].map((arrow) => (
        <button
          key={arrow.id}
          onClick={arrow.action}
          aria-label={arrow.id}
          className={`absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all duration-220 hover:scale-110 active:scale-95 w-8 h-8 lg:w-9 lg:h-9 ${arrow.side}`}
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1.5px solid rgba(255,255,255,0.18)",
            color: "#fff",
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 14px rgba(0,0,0,0.15)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(220,38,38,0.25)";
            e.currentTarget.style.borderColor = "rgba(220,38,38,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.10)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
          }}
        >
          <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={arrow.d} />
          </svg>
        </button>
      ))}

      {/* ── SLIDE COUNTER ── */}
      <div
        className="absolute top-3 right-3 lg:top-4 lg:right-4 z-20 text-[9px] lg:text-[10px] tracking-[0.15em] rounded-full px-2.5 lg:px-3 py-1"
        style={{
          color: "rgba(255,255,255,0.5)",
          background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
          {String(cur + 1).padStart(2, "0")}
        </span>{" "}
        / {String(total).padStart(2, "0")}
      </div>

      {/* ── DOT INDICATORS ── */}
      <div className="absolute bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 lg:gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="relative overflow-hidden rounded-full transition-all duration-300"
            style={{
              height: "3px lg:h-[3.5px]",
              width: i === cur ? "clamp(32px, 8vw, 42px)" : "clamp(12px, 3vw, 14px)",
              background: i === cur ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.25)",
              border: "none",
              padding: 0,
            }}
          >
            {i === cur && (
              <span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${prog}%`,
                  background: "linear-gradient(135deg,#dc2626,#ec4899)",
                  transition: "width 80ms linear",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] lg:h-[2px] z-20" style={{ background: "rgba(220,38,38,0.10)" }}>
        <div
          className="h-full rounded"
          style={{
            width: `${prog}%`,
            background: "linear-gradient(135deg,#dc2626,#ec4899)",
            transition: "width 80ms linear",
          }}
        />
      </div>

      {/* ── PAUSE INDICATOR ── */}
      {paused && (
        <div
          className="absolute top-3 lg:top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2.5 lg:px-3 py-1 rounded-full"
          style={{
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <span className="block w-[2px] h-2.5 lg:h-3 rounded bg-white/50" />
          <span className="block w-[2px] h-2.5 lg:h-3 rounded bg-white/50" />
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&display=swap');
      `}</style>
    </section>
  );
}