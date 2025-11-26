import React, { useEffect, useRef, useState } from "react";

/**
 * Message.jsx — Rotating non-editable wish + gallery autoplay w/ transitions
 * Main gallery images use object-contain to avoid zoom/crop.
 *
 * Drop into: src/components/Message.jsx
 * Requirements:
 *  - Tailwind CSS loaded in src/index.css
 *  - Gallery images placed under public/images/ (update GALLERY_IMAGES if needed)
 *
 * Behavior:
 *  - When modal opens, wishes rotate automatically every WISH_INTERVAL ms (non-editable).
 *  - Main gallery image auto-plays (fade transition) every IMG_INTERVAL ms.
 *  - Clicking a thumbnail selects that image and pauses autoplay briefly.
 *  - All timers are cleaned up when modal closes.
 */

export default function Message({ onNext }) {
  const GALLERY_IMAGES = [
    "/images/img1 (2).jpeg",
    "/images/img1 (3).jpeg",
    "/images/img1 (4).jpeg",
    "/images/img1 (5).jpeg",
    "/images/img1 (6).jpeg",
    "/images/img1 (7).jpeg",
  ];

  const WISHES = [
    "Abi — you fill our lives with warmth, laughter and color. Happy Birthday! 🎂💖",
    "Wishing you a day full of fun, love and unforgettable memories. Happy Birthday, Abi!",
    "May your birthday be as special and wonderful as you are. Lots of love to you today!",
    "Cheers to you, Abi — may the year ahead sparkle with joy and blessings.",
  ];

  // timing config (ms)
  const WISH_INTERVAL = 3800;
  const IMG_INTERVAL = 3000;
  const PAUSE_ON_CLICK = 6000; // pause autoplay for this long after thumbnail click

  // UI state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0); // current main image index
  const [wishIndex, setWishIndex] = useState(0);

  // animation/interaction small states (optional)
  const [giftAnim, setGiftAnim] = useState(false);
  const [flowerAnim, setFlowerAnim] = useState(false);

  // timers refs for cleanup & pause handling
  const wishTimerRef = useRef(null);
  const imgTimerRef = useRef(null);
  const pauseTimerRef = useRef(null);

  // refs for DOM nodes
  const modalRef = useRef(null);
  const bigImgRef = useRef(null);

  // injected css for fade transitions and small animations (keeps single-file)
  const injectedCSS = `
    /* fade transition without scaling (to avoid zoom) */
    .fade-img {
      transition: opacity 600ms ease;
      opacity: 0;
      transform: none;
    }
    .fade-img.show {
      opacity: 1;
    }

    .anim-gift-pop { animation: giftPop 700ms cubic-bezier(.2,.9,.2,1) both; }
    .anim-flower-float { animation: flowerFloat 900ms ease-out both; }
    .anim-photo-pulse { animation: pulseImg 900ms ease-in-out both; }

    @keyframes giftPop {
      0% { transform: scale(.94) translateY(0); opacity: 0; }
      40% { transform: scale(1.06) translateY(-8px); opacity: 1; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    @keyframes flowerFloat {
      0% { transform: translateY(8px) scale(.9); opacity: 0; }
      50% { transform: translateY(-12px) scale(1.02); opacity: 1; }
      100% { transform: translateY(0) scale(.95); opacity: 0; }
    }
    @keyframes pulseImg {
      0% { transform: scale(1); filter: saturate(1); }
      50% { transform: scale(1.03); filter: saturate(1.06); }
      100% { transform: scale(1); filter: saturate(1); }
    }

    /* responsive modal tweaks */
    @media (max-width: 640px) {
      .modal-inner { height: 92vh; overflow: auto; border-radius: 12px; }
      .modal-body-grid { grid-template-columns: 1fr !important; }
      .left-col { order: 2; }
      .right-col { order: 1; }
    }
  `;

  // open modal: start timers
  const openModal = () => {
    setOpen(true);
  };

  // close modal: clear timers, reset state
  const closeModal = () => {
    setOpen(false);
    clearTimers();
    setSelected(0);
    setWishIndex(0);
  };

  // clear all timers
  const clearTimers = () => {
    if (wishTimerRef.current) {
      clearInterval(wishTimerRef.current);
      wishTimerRef.current = null;
    }
    if (imgTimerRef.current) {
      clearInterval(imgTimerRef.current);
      imgTimerRef.current = null;
    }
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  };

  // setup/cleanup when modal opens/closes
  useEffect(() => {
    if (open) {
      // focus modal for accessibility
      setTimeout(() => modalRef.current?.focus(), 80);

      // start wish rotation
      if (!wishTimerRef.current) {
        wishTimerRef.current = setInterval(() => {
          setWishIndex((w) => (w + 1) % WISHES.length);
        }, WISH_INTERVAL);
      }

      // start image autoplay
      if (!imgTimerRef.current) {
        imgTimerRef.current = setInterval(() => {
          setSelected((s) => (s + 1) % GALLERY_IMAGES.length);
        }, IMG_INTERVAL);
      }
    } else {
      // closed: cleanup timers
      clearTimers();
    }

    // cleanup on unmount too
    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // keyboard: Esc closes modal
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // small confetti helper
  const confetti = (count = 18) => {
    const root = document.createElement("div");
    root.className = "fixed inset-0 pointer-events-none z-[9999]";
    document.body.appendChild(root);
    const colors = ["#FF7AA2", "#FFE680", "#7DD3FC", "#A7F3D0", "#FFD6E0"];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.width = `${6 + Math.random() * 10}px`;
      el.style.height = `${8 + Math.random() * 12}px`;
      el.style.borderRadius = "2px";
      el.style.background = colors[i % colors.length];
      el.style.left = `${8 + Math.random() * 84}%`;
      el.style.top = `${10 + Math.random() * 60}px`;
      el.style.opacity = "0.98";
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      el.style.transition = "transform 1.2s ease-out, opacity 1.2s linear";
      root.appendChild(el);
      setTimeout(() => {
        el.style.transform = `translateY(${180 + Math.random() * 260}px) rotate(${720 - Math.random() * 1440}deg)`;
        el.style.opacity = "0";
      }, 10);
    }
    setTimeout(() => root.remove(), 1400);
  };

  // on thumbnail click: show that image and pause autoplay for PAUSE_ON_CLICK ms
  const onThumbnailClick = (i) => {
    setSelected(i);
    // pause autoplay
    if (imgTimerRef.current) {
      clearInterval(imgTimerRef.current);
      imgTimerRef.current = null;
    }
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      // resume autoplay
      if (!imgTimerRef.current) {
        imgTimerRef.current = setInterval(() => {
          setSelected((s) => (s + 1) % GALLERY_IMAGES.length);
        }, IMG_INTERVAL);
      }
    }, PAUSE_ON_CLICK);
  };

  // little button handlers
  const handleLittleGift = () => {
    setGiftAnim(true);
    confetti(16);
    setTimeout(() => setGiftAnim(false), 700);
  };

  const handleFlower = () => {
    setFlowerAnim(true);
    setTimeout(() => setFlowerAnim(false), 900);
  };

  const handleHighlightPhoto = () => {
    // pulse animation on big image
    if (bigImgRef.current) {
      bigImgRef.current.classList.add("anim-photo-pulse");
      setTimeout(() => {
        bigImgRef.current.classList.remove("anim-photo-pulse");
      }, 900);
    }
    confetti(10);
  };

  return (
    <>
      <style>{injectedCSS}</style>

      {/* main preview / gift */}
      <div className="min-h-[65vh] flex items-center justify-center p-6">
        <div className="relative flex flex-col items-center gap-4 w-full max-w-2xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">A Special Surprise</h2>
          <p className="text-sm md:text-base text-slate-600 text-center max-w-xl">
            Click the gift to reveal the birthday wish and photos.
          </p>

          <button
            onClick={() => {
              openModal();
              confetti(20);
            }}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={open ? "Gift opened" : "Open the gift"}
            className="relative group mt-2"
          >
            <div className={`relative w-56 h-48 md:w-64 md:h-56 bg-gradient-to-b from-rose-50 to-white border border-rose-200 rounded-xl flex items-end justify-center gift-shadow`}>
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-full bg-gradient-to-b from-rose-400 to-rose-500 rounded-sm opacity-95" />
              <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 h-6 bg-gradient-to-r from-rose-400 to-rose-500 rounded-sm opacity-95" />
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-14 h-10">
                <div className="absolute left-0 top-0 w-7 h-10 rounded-l-full bg-rose-500 transform origin-left rotate-12" />
                <div className="absolute right-0 top-0 w-7 h-10 rounded-r-full bg-rose-500 transform origin-right -rotate-12" />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 w-6 h-3 bg-rose-600 rounded-sm" />
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-600">Open Gift</div>
          </button>

          <div className="mt-4 w-full flex flex-wrap items-center gap-3 justify-center md:justify-start">
            <button
              onClick={handleLittleGift}
              className={`px-3 py-2 rounded-lg bg-rose-50 border text-rose-600 font-medium ${giftAnim ? "anim-gift-pop" : ""}`}
            >
              Little gift
            </button>

            <button
              onClick={handleFlower}
              className={`px-3 py-2 rounded-lg bg-amber-50 border text-amber-700 font-medium ${flowerAnim ? "anim-flower-float" : ""}`}
            >
              Flower
            </button>

            <button
              onClick={handleHighlightPhoto}
              className="px-3 py-2 rounded-lg bg-indigo-50 border text-indigo-700 font-medium"
            >
              Highlight Photo
            </button>
          </div>
        </div>
      </div>

      {/* modal */}
      {open && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

          <div
            ref={modalRef}
            tabIndex={-1}
            className="relative z-20 w-full max-w-6xl modal-inner bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* header */}
            <div className="flex items-center justify-between gap-4 p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7" stroke="#fb7185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 12v8" stroke="#fb7185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">A wish for Abi</h3>
                  <div className="text-sm text-slate-500">Photos & surprises</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                
                <button onClick={() => confetti(14)} className="px-3 py-1 rounded-md bg-amber-50 border text-sm">Celebrate</button>
                <button onClick={closeModal} className="px-3 py-1 rounded-md bg-white border text-sm">Close</button>
              </div>
            </div>

            {/* body */}
            <div className="p-6 grid modal-body-grid" style={{ gridTemplateColumns: "320px 1fr 1fr", gap: "24px" }}>
              {/* left column: wish + thumbnails */}
              <div className="left-col space-y-4">
                <div className="bg-gradient-to-b from-rose-50 to-white p-4 rounded-lg border">
                  <label className="block text-xs text-slate-500 mb-2">Birthday wish</label>
                  <div className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
                    {WISHES[wishIndex]}
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-white">
                  <h4 className="text-sm font-semibold mb-2">Mini gallery</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {GALLERY_IMAGES.slice(0, 6).map((src, i) => (
                      <button
                        key={i}
                        onClick={() => onThumbnailClick(i)}
                        className={`w-full pb-[100%] relative rounded-md overflow-hidden border ${selected === i ? "ring-2 ring-rose-300" : ""}`}
                        aria-label={`Open photo ${i + 1}`}
                      >
                        <img src={src} alt={`Gallery ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* middle + right: large gallery area spanning two columns */}
              <div className="right-col col-span-2 space-y-4">
                <div className="rounded-xl overflow-hidden bg-gray-100 border shadow-sm">
                  {/* bigger main gallery box: responsive and larger */}
                  <div className="w-full aspect-[16/9] relative bg-black/5">
                    {GALLERY_IMAGES.map((src, i) => (
                      <img
                        key={i}
                        ref={i === selected ? bigImgRef : null}
                        src={src}
                        alt={`Selected ${i + 1}`}
                        className={`absolute inset-0 w-full h-full object-contain fade-img ${i === selected ? "show" : ""}`}
                        style={{ backgroundPosition: "center", backgroundColor: "#f8fafc" }}
                        draggable={false}
                      />
                    ))}

                    <div className="absolute bottom-3 left-3 text-white text-sm drop-shadow-lg bg-black/30 px-2 py-1 rounded-md">
                      {`Photo ${selected + 1} of ${GALLERY_IMAGES.length}`}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <button onClick={() => { confetti(14); }} className="p-3 rounded-md bg-rose-50 border text-sm font-medium">🎁 Small Surprise</button>
                  <button onClick={() => { handleFlower(); confetti(10); }} className="p-3 rounded-md bg-amber-50 border text-sm font-medium">🌸 Send Flower</button>
                  <button onClick={() => { handleHighlightPhoto(); }} className="p-3 rounded-md bg-indigo-50 border text-sm font-medium">📸 Highlight Photo</button>
                  <div className="ml-auto text-sm text-slate-500">Click thumbnails to change the photo</div>
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between gap-3 p-4 border-t bg-white/60">
              <div className="text-sm text-slate-600">Share this wish or copy the text to send</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(WISHES[wishIndex]);
                    alert("Wish copied to clipboard!");
                  }}
                  className="px-3 py-1 rounded-md bg-white border"
                >
                  Copy wish
                </button>

                <button
                  onClick={() => {
                    confetti(18);
                    if (typeof onNext === "function") onNext();
                    closeModal();
                  }}
                  className="px-4 py-2 rounded-md bg-rose-600 text-white font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>

          {/* optional flower burst visual */}
          {flowerAnim && (
            <div className="pointer-events-none fixed left-1/2 top-28 transform -translate-x-1/2 z-[1200]">
              <div className="anim-flower-float">
                <svg width="90" height="90" viewBox="0 0 100 100" className="block">
                  <g transform="translate(50,50)">
                    <circle r="6" fill="#fff7ed" />
                    <g fill="#ffd6e0">
                      <ellipse rx="10" ry="22" transform="rotate(0) translate(0,-22)" />
                      <ellipse rx="10" ry="22" transform="rotate(45) translate(0,-22)" />
                      <ellipse rx="10" ry="22" transform="rotate(90) translate(0,-22)" />
                      <ellipse rx="10" ry="22" transform="rotate(135) translate(0,-22)" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
