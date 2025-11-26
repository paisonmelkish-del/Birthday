import React, { useEffect, useRef, useState } from "react";

/**
 * Hero.jsx — Updated version
 * - Background size reduced (30%)
 * - More flower decorations (SVG) added
 * - Slideshow box shrunk further
 * - Reduced zoom/scale animation for images
 *
 * Requirements:
 * - background: public/images/bg-birthday.jpg
 * - slideshow images referenced in IMAGES array
 * - Tailwind base/components/utilities loaded in src/index.css
 */

export default function Hero({ onNext }) {
  const IMAGES = [
    "/images/img1 (8).jpeg",
    "/images/img1 (10).jpeg",
    "/images/img1 (9).jpeg",
    "/images/img1 (1).jpeg",
    "/images/image.png",
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  // injected CSS for animations and small helpers
  const injectedCSS = `
    @keyframes petalFall {
      0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      100% { transform: translateY(120vh) rotate(360deg); opacity: 0.95; }
    }
    @keyframes floatA {
      0% { transform: translateY(0px) rotate(-3deg); }
      50% { transform: translateY(12px) rotate(4deg); }
      100% { transform: translateY(0px) rotate(-3deg); }
    }
    @keyframes floatB {
      0% { transform: translateY(-6px); }
      50% { transform: translateY(10px); }
      100% { transform: translateY(-6px); }
    }
    @keyframes bob {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
      100% { transform: translateY(0px); }
    }
    @keyframes floatFlower {
      0% { transform: translateY(0px) rotate(0deg) scale(0.985); opacity: 0.94; }
      50% { transform: translateY(-8px) rotate(6deg) scale(1.01); opacity: 1; }
      100% { transform: translateY(0px) rotate(0deg) scale(0.985); opacity: 0.94; }
    }
    @keyframes textIn {
      0% { transform: translateY(8px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    .animate-petalFall { animation-name: petalFall; animation-timing-function: linear; animation-iteration-count: infinite; }
    .animate-floatA { animation-name: floatA; animation-duration: 6s; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
    .animate-floatB { animation-name: floatB; animation-duration: 7s; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
    .animate-bob    { animation-name: bob; animation-duration: 5s; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
    .animate-flower { animation: floatFlower 5.6s ease-in-out infinite; }
    .animate-text-in { animation: textIn 700ms cubic-bezier(.2,.9,.2,1) both; }

    /* small helper so images animate nicely */
    .img-smooth { will-change: transform, opacity; }
  `;

  // slideshow auto-advance
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, 4200);
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  // keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % IMAGES.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // confetti burst (small DOM-based)
  const confettiBurst = () => {
    const root = document.createElement("div");
    root.className = "fixed inset-0 pointer-events-none z-[9999]";
    document.body.appendChild(root);
    const colors = ["#FF7AA2", "#FFE680", "#7DD3FC", "#A7F3D0", "#FFD6E0"];
    for (let i = 0; i < 36; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.width = `${6 + Math.random() * 8}px`;
      el.style.height = `${10 + Math.random() * 10}px`;
      el.style.borderRadius = "2px";
      el.style.background = colors[i % colors.length];
      el.style.left = `${8 + Math.random() * 84}%`;
      el.style.top = `${10 + Math.random() * 40}px`;
      el.style.opacity = "0.98";
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      el.style.transition = "transform 1.4s ease-out, opacity 1.4s linear";
      root.appendChild(el);
      setTimeout(() => {
        el.style.transform = `translateY(${240 + Math.random() * 320}px) rotate(${720 - Math.random() * 1440}deg)`;
        el.style.opacity = "0";
      }, 10);
    }
    setTimeout(() => root.remove(), 1900);
  };

  return (
    <>
      <style>{injectedCSS}</style>

      {/* Background image — much smaller, centered, subtle */}
 <div
        className="fixed inset-0 -z-50 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/image.png')",
          filter: "saturate(0.98) contrast(1.02)",
        }}
        aria-hidden="true"
      />

      {/* translucent overlay */}
      <div className="fixed inset-0 -z-40 bg-white/60 backdrop-blur-sm" />

      {/* main content area */}
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <section className="relative w-full max-w-4xl hero-vignette rounded-3xl overflow-hidden p-6 md:p-10 bg-white/85 shadow-2xl">
          {/* texture overlay */}
          <div className="absolute inset-0 bg-[length:14px_14px] bg-[linear-gradient(135deg,rgba(255,255,255,0.02)25%,transparent 25%,transparent 50%,rgba(255,255,255,0.02)50%,rgba(255,255,255,0.02)75%,transparent 75%,transparent)] pointer-events-none opacity-50" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* LEFT: Heading + CTA (bigger text kept) */}
            <div className="space-y-6 animate-text-in">
              <h1 className="text-4xl md:text-5xl font-extrabold text-rose-600 leading-tight">
               ꧁ᴴᵃᵖᵖʸ☆ᵇⁱʳᵗʰᵈᵃʸ꧂
               
               
                <center>Abinaya</center>
                
              </h1>

              <p className="text-lg md:text-xl text-slate-700 max-w-xl">
                Happy birthday to the one who fills my life with love and joy.
                <p> Jeremiah 29:11</p>
<p>“For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.”</p>
              </p>

              <div className="flex gap-4 mt-4 flex-wrap">
                <button
                  onClick={() => onNext && onNext()}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-500 text-white text-lg font-semibold shadow-lg hover:scale-[1.03] active:scale-[0.98] transition"
                >
                  Open message
                </button>

                <button
                  onClick={confettiBurst}
                  className="px-6 py-3 rounded-2xl bg-white border text-lg font-semibold shadow-sm hover:bg-gray-50 transition"
                >
                  Celebrate
                </button>
              </div>
            </div>

            {/* RIGHT: Shrunk slideshow box (smaller than before) */}
            <div
              className="mx-auto w-full max-w-xs md:max-w-sm"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg border bg-white/80">
                {/* smaller size: aspect 4/3, smaller max width */}
                <div className="w-full aspect-[4/3] relative bg-gray-100">
                  {IMAGES.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Memory ${i + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 img-smooth ${i === index ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"}`}
                      draggable={false}
                      loading="lazy"
                    />
                  ))}
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-black/40 text-white rounded-md">
                  {index + 1}/{IMAGES.length}
                </div>
              </div>

              {/* smaller arrow controls */}
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length)}
                  className="p-2 bg-white rounded-lg shadow border"
                >
                  ◀
                </button>
                <div className="flex items-center gap-2">
                  {IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`w-3 h-3 rounded-full transition ${i === index ? "bg-rose-500 scale-125 shadow-md" : "bg-white/60"}`}
                      aria-label={`Show photo ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setIndex((i) => (i + 1) % IMAGES.length)}
                  className="p-2 bg-white rounded-lg shadow border"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          {/* Add many flower SVG decorations around, gentle animations */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <svg className="absolute left-4 top-6 w-14 h-14 opacity-95 animate-flower" viewBox="0 0 100 100" aria-hidden>
              <g transform="translate(50,50)">
                <circle r="5" fill="#fff3f6" />
                <g fill="#ffd6e0">
                  <ellipse rx="8" ry="18" transform="rotate(0) translate(0,-18)" />
                  <ellipse rx="8" ry="18" transform="rotate(45) translate(0,-18)" />
                  <ellipse rx="8" ry="18" transform="rotate(90) translate(0,-18)" />
                  <ellipse rx="8" ry="18" transform="rotate(135) translate(0,-18)" />
                </g>
              </g>
            </svg>

            <svg className="absolute left-28 top-12 w-12 h-12 opacity-90 animate-flower" viewBox="0 0 100 100" aria-hidden>
              <g transform="translate(50,50)">
                <circle r="4" fill="#fff7ed" />
                <g fill="#ffd6e0">
                  <ellipse rx="7" ry="16" transform="rotate(0) translate(0,-16)" />
                  <ellipse rx="7" ry="16" transform="rotate(72) translate(0,-16)" />
                  <ellipse rx="7" ry="16" transform="rotate(144) translate(0,-16)" />
                </g>
              </g>
            </svg>

            <svg className="absolute right-8 top-10 w-16 h-16 opacity-90 animate-flower" viewBox="0 0 100 100" aria-hidden>
              <g transform="translate(50,50)">
                <circle r="5" fill="#ffffff" />
                <g fill="#d6e8ff">
                  <ellipse rx="8" ry="18" transform="rotate(0) translate(0,-18)" />
                  <ellipse rx="8" ry="18" transform="rotate(60) translate(0,-18)" />
                  <ellipse rx="8" ry="18" transform="rotate(120) translate(0,-18)" />
                </g>
              </g>
            </svg>

            <svg className="absolute right-20 bottom-20 w-12 h-12 opacity-90 animate-flower" viewBox="0 0 100 100" aria-hidden>
              <g transform="translate(50,50)">
                <circle r="4" fill="#fff7ed" />
                <g fill="#c7f0d8">
                  <ellipse rx="7" ry="16" transform="rotate(0) translate(0,-16)" />
                  <ellipse rx="7" ry="16" transform="rotate(72) translate(0,-16)" />
                  <ellipse rx="7" ry="16" transform="rotate(144) translate(0,-16)" />
                </g>
              </g>
            </svg>

            <svg className="absolute left-10 bottom-24 w-10 h-10 opacity-90 animate-flower" viewBox="0 0 100 100" aria-hidden>
              <g transform="translate(50,50)">
                <circle r="3" fill="#fff3f6" />
                <g fill="#ffd6e0">
                  <ellipse rx="6" ry="14" transform="rotate(0) translate(0,-14)" />
                  <ellipse rx="6" ry="14" transform="rotate(60) translate(0,-14)" />
                </g>
              </g>
            </svg>
          </div>

          {/* Petals (randomized) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const left = 3 + Math.random() * 90;
            const delay = (Math.random() * 3).toFixed(2);
            const duration = (6 + Math.random() * 6).toFixed(2);
            const size = 7 + Math.random() * 6;
            return (
              <span
                key={`petal-${i}`}
                className="pointer-events-none absolute rounded-full bg-pink-200/80 blur-sm opacity-80 animate-petalFall"
                style={{
                  left: `${left}%`,
                  top: `${-8 - Math.random() * 18}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            );
          })}
        </section>
      </div>
    </>
  );
}
