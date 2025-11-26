import React, { useEffect, useRef, useState } from "react";

/**
 * Gallery.jsx — Masonry gallery with enter-from-all-sides transitions
 * - Keeps the same behavior as your original version
 * - useEffect dependency arrays are stable & lint-friendly
 */

export default function Gallery({ onNext }) {
  const IMAGES = [
    { src: "/images/img1 (8).jpeg", caption: "Memory 1" },
    { src: "/images/img1 (10).jpeg", caption: "Memory 2" },
    { src: "/images/img1 (9).jpeg", caption: "Memory 3" },
    { src: "/images/img1 (1).jpeg", caption: "Memory 4" },
    { src: "/images/img1 (2).jpeg", caption: "Memory 5" },
    { src: "/images/img1 (3).jpeg", caption: "Memory 6" },
    { src: "/images/img1 (4).jpeg", caption: "Memory 7" },
    { src: "/images/img1 (5).jpeg", caption: "Memory 8" },
    { src: "/images/img1 (6).jpeg", caption: "Memory 9" },
    { src: "/images/img1 (7).jpeg", caption: "Memory 10" },
  ];

  // state & refs
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  const autoplayRef = useRef(null);
  const startXRef = useRef(null);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  // --- entrance animations + IntersectionObserver (run once) ---
  useEffect(() => {
    const thumbs = document.querySelectorAll("[data-thumb-index]");
    thumbs.forEach((el) => {
      if (el.dataset.dir) return;
      const dirs = ["left", "right", "top", "bottom"];
      el.dataset.dir = dirs[Math.floor(Math.random() * dirs.length)];
      el.classList.add("thumb-hidden");
    });

    const opts = { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.08 };
    observerRef.current = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const dir = el.dataset.dir || "bottom";
        el.classList.add(`enter-from-${dir}`);
        el.classList.remove("thumb-hidden");
        obs.unobserve(el);
      });
    }, opts);

    thumbs.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
    // run once on mount
  }, []);

  // --- injected css (same as before) ---
  const injectedCSS = `
    .thumb-scale { transition: transform 260ms cubic-bezier(.2,.9,.2,1), box-shadow 260ms; will-change: transform, opacity; }
    .thumb-scale:hover { transform: translateY(-6px) scale(1.02); }

    .thumb-hidden { opacity: 0; transform: translateY(10px) scale(.995); }

    .enter-from-left { animation: enterFromLeft 560ms cubic-bezier(.2,.9,.2,1) both; }
    .enter-from-right { animation: enterFromRight 560ms cubic-bezier(.2,.9,.2,1) both; }
    .enter-from-top { animation: enterFromTop 560ms cubic-bezier(.2,.9,.2,1) both; }
    .enter-from-bottom { animation: enterFromBottom 560ms cubic-bezier(.2,.9,.2,1) both; }

    @keyframes enterFromLeft {
      0% { transform: translateX(-18px) scale(.995); opacity: 0; }
      60% { transform: translateX(6px) scale(1.01); opacity: 1; }
      100% { transform: translateX(0) scale(1); opacity: 1; }
    }
    @keyframes enterFromRight {
      0% { transform: translateX(18px) scale(.995); opacity: 0; }
      60% { transform: translateX(-6px) scale(1.01); opacity: 1; }
      100% { transform: translateX(0) scale(1); opacity: 1; }
    }
    @keyframes enterFromTop {
      0% { transform: translateY(-18px) scale(.995); opacity: 0; }
      60% { transform: translateY(6px) scale(1.01); opacity: 1; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    @keyframes enterFromBottom {
      0% { transform: translateY(18px) scale(.995); opacity: 0; }
      60% { transform: translateY(-6px) scale(1.01); opacity: 1; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }

    .masonry { column-gap: 14px; }
    @media (min-width: 900px) { .masonry { columns: 4; } }
    @media (min-width: 700px) and (max-width: 899px) { .masonry { columns: 3; } }
    @media (min-width: 520px) and (max-width: 699px) { .masonry { columns: 2; } }
    .masonry-item { display: inline-block; width: 100%; margin: 0 0 14px; border-radius: 12px; overflow: hidden; }

    .lightbox-fade { animation: lightFade 260ms ease both; }
    @keyframes lightFade { from { opacity: 0 } to { opacity: 1 } }
  `;

  // --- open/close / navigation helpers (stable) ---
  const openLightbox = (i) => {
    setIndex(i);
    setLightboxOpen(true);
    setAutoplay(false);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setAutoplay(false);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  // navigation helpers (used outside effects)
  const goNext = () => setIndex((i) => (i + 1) % IMAGES.length);
  const goPrev = () => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);

  // --- keyboard handling while lightbox is open ---
  useEffect(() => {
    if (!lightboxOpen) return;

    const handler = (e) => {
      if (e.key === "ArrowRight") {
        setIndex((i) => (i + 1) % IMAGES.length);
        setAutoplay(false);
      } else if (e.key === "ArrowLeft") {
        setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);
        setAutoplay(false);
      } else if (e.key === "Escape") {
        setLightboxOpen(false);
        setAutoplay(false);
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
          autoplayRef.current = null;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // depends only on lightboxOpen (state) and IMAGES.length (stable here)
  }, [lightboxOpen, IMAGES.length]);

  // --- swipe / mouse drag handling on the lightbox container ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e) => {
      startXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
    };
    const onEnd = (e) => {
      if (startXRef.current == null) return;
      const endX = e.changedTouches ? e.changedTouches[0].clientX : (e.clientX ?? startXRef.current);
      const diff = endX - startXRef.current;
      if (Math.abs(diff) > 40) {
        if (diff < 0) setIndex((i) => (i + 1) % IMAGES.length);
        else setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);
        setAutoplay(false);
      }
      startXRef.current = null;
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    el.addEventListener("mousedown", onStart);
    el.addEventListener("mouseup", onEnd);

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("mousedown", onStart);
      el.removeEventListener("mouseup", onEnd);
    };
    // containerRef is a stable ref; we intentionally do NOT include it in deps
    // to attach listeners to the element present at mount time.
  }, [IMAGES.length]);

  // --- autoplay effect (controlled, cleaned) ---
  useEffect(() => {
    // clear any existing
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }

    if (lightboxOpen && autoplay) {
      autoplayRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % IMAGES.length);
      }, 3000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [autoplay, lightboxOpen, IMAGES.length]);

  // --- preload neighbors when index changes while lightbox is open ---
  useEffect(() => {
    if (!lightboxOpen) return;
    const next = (index + 1) % IMAGES.length;
    const prev = (index - 1 + IMAGES.length) % IMAGES.length;
    [IMAGES[next].src, IMAGES[prev].src].forEach((s) => {
      const i = new Image();
      i.src = s;
    });
  }, [index, lightboxOpen, IMAGES.length]);

  // --- download helper ---
  const downloadCurrent = () => {
    const url = IMAGES[index].src;
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <style>{injectedCSS}</style>

      <div className="py-8 px-4 w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Gallery</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-3 py-2 rounded-lg bg-white border shadow-sm text-sm"
            >
              Scroll Top
            </button>
            <button
              onClick={() => typeof onNext === "function" && onNext()}
              className="px-3 py-2 rounded-lg bg-rose-500 text-white text-sm font-medium shadow hover:brightness-95"
            >
              Surprise →
            </button>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:hidden">
          {IMAGES.map((img, i) => (
            <button
              key={img.src}
              onClick={() => openLightbox(i)}
              data-thumb-index={i}
              className="thumb-scale group relative rounded-xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-rose-200"
              aria-label={`Open ${img.caption || "photo"} ${i + 1}`}
            >
              <img
                src={img.src}
                alt={img.caption || `Photo ${i + 1}`}
                loading="lazy"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                draggable={false}
              />
              <div className="absolute left-2 bottom-2 px-2 py-1 rounded bg-black/40 text-white text-xs">{img.caption}</div>
            </button>
          ))}
        </div>

        <div className="hidden sm:block mt-4">
          <div className="masonry">
            {IMAGES.map((img, i) => (
              <div key={img.src} className="masonry-item">
                <button
                  data-thumb-index={i}
                  onClick={() => openLightbox(i)}
                  className="w-full focus:outline-none rounded-xl overflow-hidden thumb-scale block"
                  aria-label={`Open ${img.caption || "photo"} ${i + 1}`}
                >
                  <img
                    src={img.src}
                    alt={img.caption || `Photo ${i + 1}`}
                    loading="lazy"
                    className="w-full object-cover rounded-xl"
                    style={{ display: "block", width: "100%" }}
                    draggable={false}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/85">
          <button onClick={closeLightbox} className="absolute top-6 right-6 z-[1250] bg-white/90 rounded-full p-2 shadow">
            ✕
          </button>

          <div className="absolute top-6 left-6 z-[1250] flex items-center gap-2">
            <button
              onClick={() => setAutoplay((s) => !s)}
              className="px-3 py-2 bg-white/90 rounded shadow text-sm"
              aria-pressed={autoplay}
            >
              {autoplay ? "Pause" : "Play"}
            </button>
            <button onClick={downloadCurrent} className="px-3 py-2 bg-white/90 rounded shadow text-sm">
              Download
            </button>
          </div>

          <div ref={containerRef} className="relative max-w-6xl w-full mx-4 md:mx-8">
            <div className="relative rounded-xl overflow-hidden bg-white/5">
              {IMAGES.map((img, i) => {
                const visible = i === index;
                return (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.caption || `Photo ${i + 1}`}
                    loading={visible ? "eager" : "lazy"}
                    className={`absolute inset-0 w-full h-[60vh] md:h-[72vh] object-contain mx-auto left-0 right-0 transition-opacity duration-500 ${
                      visible ? "opacity-100 lightbox-fade" : "opacity-0 pointer-events-none"
                    }`}
                    style={{ display: visible ? "block" : "none" }}
                    draggable={false}
                  />
                );
              })}

              <div className="absolute left-0 right-0 bottom-0 px-6 py-4 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between">
                <div className="text-white">
                  <div className="text-sm font-medium">{IMAGES[index].caption}</div>
                  <div className="text-xs opacity-80">{`${index + 1} / ${IMAGES.length}`}</div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);
                      setAutoplay(false);
                    }}
                    className="px-3 py-2 bg-white/80 rounded shadow text-sm"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => {
                      setIndex((i) => (i + 1) % IMAGES.length);
                      setAutoplay(false);
                    }}
                    className="px-3 py-2 bg-white/80 rounded shadow text-sm"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 overflow-x-auto py-2">
              {IMAGES.map((img, i) => (
                <button
                  key={img.src + "-thumb"}
                  onClick={() => {
                    setIndex(i);
                    setAutoplay(false);
                  }}
                  className={`rounded-lg overflow-hidden border ${i === index ? "ring-2 ring-rose-300" : ""}`}
                >
                  <img src={img.src} alt={img.caption} className="w-20 h-12 object-cover" loading="lazy" draggable={false} />
                </button>
              ))}
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 md:hidden">
              <div className="px-3 py-1 rounded-full bg-black/40 text-white text-xs">Swipe</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
