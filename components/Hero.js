import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// ─── CONFIGURACIÓN DE SLIDES ─────────────────────────────────────────────────
const SLIDES = [
  {
    id: "slide-1",
    image: "https://res.cloudinary.com/djuk4a84p/image/upload/f_auto,q_auto:good,w_1600/v1772492898/2_wrvgzz.png",
    badge: ["✦ Colección 2026"],
    eyebrow: "",
    title: ["Colecciones", "exclusivas de", "accesorios"],
    titleAccent: "para el cabello",
    subtitle: "",
    microbadges: [],
    buttons: [
      { label: "Explorar Colección", href: "/accesorios-para-el-pelo", variant: "primary" },
    ],
  },
  {
    id: "slide-2",
    image: "https://res.cloudinary.com/djuk4a84p/image/upload/f_auto,q_auto:good,w_1600/v1772552330/3_vim6e0.png",
    badge: [],
    eyebrow: "Detalles únicos",
    title: ["Elegancia", "en cada"],
    titleAccent: "detalle",
    subtitle: "Clips, peinetas y hebillas que marcan estilo",
    microbadges: [],
    buttons: [],
  },
  {
    id: "slide-3",
    image: "https://res.cloudinary.com/djuk4a84p/image/upload/f_auto,q_auto:good,w_1600/v1772766593/3_am6fs8.png",
    badge: [],
    eyebrow: "Nueva Temporada",
    title: ["Accesorios que"],
    titleAccent: "enamoran",
    subtitle: "Diseños elegantes para realzar cada peinado",
    microbadges: [],
    buttons: [],
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
      style={{ height: "clamp(600px, 85vh, 700px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── SLIDES ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 flex flex-col lg:grid lg:grid-cols-[35%_65%] transition-opacity duration-[850ms]"
          style={{
            opacity: i === cur ? 1 : 0,
            pointerEvents: i === cur ? "auto" : "none",
          }}
        >
          {/* LEFT — dark panel */}
          <div
            className="relative flex flex-col justify-center overflow-hidden order-2 lg:order-1 flex-1 lg:flex-initial"
            style={{
              background: "linear-gradient(160deg, #f5f0eb 0%, #ede8e3 100%)",
              padding: "clamp(24px, 5vw, 48px) clamp(20px, 5vw, 40px)",
            }}
          >
            {/* Warm glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-40px", left: "-40px",
                width: "clamp(150px, 25vw, 280px)",
                height: "clamp(150px, 25vw, 280px)",
                background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />

            {/* Badge */}
            {slide.badge.length > 0 && (
              <span
                className="inline-flex items-center w-fit mb-2 lg:mb-3 px-3 py-1.5 lg:py-1 rounded-full font-medium tracking-widest uppercase"
                style={{
                  fontSize: "clamp(10px, 2.5vw, 11px)",
                  color: "#dc2626",
                  background: "rgba(220,38,38,0.10)",
                  border: "1px solid rgba(220,38,38,0.20)",
                  opacity: i === cur ? 1 : 0,
                  transition: "opacity 500ms 60ms",
                }}
              >
                {slide.badge[0]}
              </span>
            )}

            {/* Eyebrow */}
            {slide.eyebrow && (
              <p
                className="flex items-center gap-2 mb-2 lg:mb-3 font-normal tracking-[0.18em] lg:tracking-[0.22em] uppercase"
                style={{
                  fontSize: "clamp(10px, 2.2vw, 11px)",
                  color: "rgba(28,20,18,0.5)",
                  opacity: i === cur ? 1 : 0,
                  transform: i === cur ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 580ms 120ms, transform 580ms 120ms",
                }}
              >
                <span
                  className="flex-shrink-0 rounded"
                  style={{ 
                    width: "clamp(16px, 4vw, 22px)",
                    height: "1.5px", 
                    background: "linear-gradient(135deg,#dc2626,#ec4899)" 
                  }}
                />
                {slide.eyebrow}
              </p>
            )}

            {/* Headline */}
            <h2
              className="font-light leading-[1.15] mb-2 lg:mb-3"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(36px, 8vw, 56px)",
                color: "#1c1412",
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

            {/* Subtitle */}
            {slide.subtitle && (
              <p
                className="mb-4 lg:mb-5 font-light leading-[1.65]"
                style={{
                  fontSize: "clamp(13px, 2.8vw, 14px)",
                  color: "rgba(28,20,18,0.65)",
                  maxWidth: "100%",
                  opacity: i === cur ? 1 : 0,
                  transform: i === cur ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 560ms 360ms, transform 560ms 360ms",
                }}
              >
                {slide.subtitle}
              </p>
            )}

            {/* Micro badges */}
            {slide.microbadges.length > 0 && (
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
                    className="font-medium tracking-wide px-3 py-1.5 rounded-full"
                    style={{
                      fontSize: "clamp(9px, 2vw, 10px)",
                      color: "rgba(28,20,18,0.75)",
                      background: "rgba(28,20,18,0.06)",
                      border: "1px solid rgba(28,20,18,0.12)",
                    }}
                  >
                    {mb}
                  </span>
                ))}
              </div>
            )}

            {/* Buttons */}
            {slide.buttons.length > 0 && (
              <div
                className="flex flex-wrap gap-2.5 mt-3 lg:mt-4"
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
                        padding: "clamp(11px, 2.5vw, 12px) clamp(18px, 4vw, 24px)",
                        fontSize: "clamp(10px, 2.2vw, 12px)",
                        letterSpacing: "0.13em",
                        background: "linear-gradient(135deg,#dc2626,#ec4899)",
                        color: "#fff",
                        boxShadow: "0 4px 20px rgba(220,38,38,0.32)",
                      }}
                    >
                      {btn.label}
                      <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      key={k}
                      href={btn.href}
                      className="inline-flex items-center gap-2 rounded-lg font-medium tracking-wider uppercase transition-all duration-250 hover:-translate-y-0.5 active:scale-95"
                      style={{
                        padding: "clamp(11px, 2.5vw, 12px) clamp(18px, 4vw, 24px)",
                        fontSize: "clamp(10px, 2.2vw, 12px)",
                        letterSpacing: "0.13em",
                        background: "rgba(28,20,18,0.06)",
                        color: "rgba(28,20,18,0.85)",
                        border: "1.5px solid rgba(28,20,18,0.18)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {btn.label}
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* RIGHT — photo */}
          <div className="relative overflow-hidden order-1 lg:order-2 min-h-[320px] lg:min-h-0 flex-shrink-0">
            <Image
              src={slide.image}
              alt={slide.subtitle || slide.titleAccent}
              fill
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              quality={i === 2 ? 95 : 85}
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover transition-transform duration-[8000ms]"
              style={{ 
                transform: i === cur ? "scale(1.06)" : "scale(1)",
                objectPosition: "center 30%"
              }}
            />
            {/* Left vignette blending into dark panel */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to right, rgba(245,240,235,0.35) 0%, transparent 35%)",
              }}
            />
          </div>
        </div>
      ))}

      {/* ── DOT INDICATORS ── */}
      <div className="absolute bottom-4 lg:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="relative overflow-hidden rounded-full transition-all duration-300"
            style={{
              height: "clamp(3px, 1vw, 4px)",
              width: i === cur ? "clamp(36px, 8vw, 44px)" : "clamp(14px, 3vw, 16px)",
              background: i === cur ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.3)",
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
      <div className="absolute bottom-0 left-0 right-0 z-20" style={{ height: "clamp(1.5px, 0.5vw, 2px)", background: "rgba(220,38,38,0.10)" }}>
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
          className="absolute top-4 lg:top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <span className="block w-[2px] rounded bg-white/50" style={{ height: "clamp(10px, 2.5vw, 12px)" }} />
          <span className="block w-[2px] rounded bg-white/50" style={{ height: "clamp(10px, 2.5vw, 12px)" }} />
        </div>
      )}
    </section>
  );
}