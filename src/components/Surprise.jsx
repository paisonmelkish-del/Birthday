import React, { useEffect, useRef, useState } from "react";

export default function Surprise() {
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);
  const fullMessage =
    "Hey loosu, Once more happiest birthday ever paithiyam.... Nga Nga nu koopda start panunadhula irundhu ipo eruma adhu idhu nu soldra alavuku close agitom enaku therila eniya unaku endha alavuku pudikum nu ana enaku seriously romba pudichiruku. As a friend ah ne oru good well wisher, edhaium judge panunadhu ila enta more and more enoda loswet la ne eniya judge panama en kooda irundha inimel friends ae venam apdinu irukurapa you gave me hope and giving me a good bond this shows your good quality. Romba boomer podama mudichikuren. Sure ah ne oru periya successful person ah oru successful lawyer ah orelse judge ah kandipa aguva apdinu nan namburen. This birthday will definitely be the great because you made lot of friends in this year and pasangata ivlo pesi unaku pinadi oru gang ae vachiruka. This gonna be a great support for you. And nan unaku epdi irundhurukenu theriyadhu but anyways I believe this small present will give you a small smile in your face. Once again a very Happiest Birthday. And Love you my friend😇❤️" +
    "Today isn’t just about cake and photos, it’s about celebrating *you* — the memories we’ve made, and all the moments still waiting for us. 💖";

  const reasons = [
    "You always listen without judging.",
    "You make boring days feel special.",
    "Your smile can fix any mood.",
    "You hype everyone like a pro.",
    "You’re simply irreplaceable.",
  ];

  const typingRef = useRef(null);

  // simple confetti
  const confetti = (count = 26) => {
    const root = document.createElement("div");
    root.className = "fixed inset-0 pointer-events-none z-[9999]";
    document.body.appendChild(root);
    const colors = ["#fb7185", "#f97316", "#22c55e", "#38bdf8", "#a855f7"];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.width = `${6 + Math.random() * 8}px`;
      el.style.height = `${8 + Math.random() * 12}px`;
      el.style.borderRadius = "2px";
      el.style.background = colors[i % colors.length];
      el.style.left = `${10 + Math.random() * 80}%`;
      el.style.top = `${10 + Math.random() * 40}px`;
      el.style.opacity = "0.95";
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      el.style.transition = "transform 1.2s ease-out, opacity 1.2s linear";
      root.appendChild(el);
      setTimeout(() => {
        el.style.transform = `translateY(${200 + Math.random() * 260}px) rotate(${
          720 - Math.random() * 1440
        }deg)`;
        el.style.opacity = "0";
      }, 10);
    }
    setTimeout(() => root.remove(), 1500);
  };

  // typewriter effect
  useEffect(() => {
    if (!revealed) return;
    setTyped("");
    setDoneTyping(false);
    let i = 0;

    typingRef.current = setInterval(() => {
      i++;
      setTyped(fullMessage.slice(0, i));
      if (i >= fullMessage.length) {
        clearInterval(typingRef.current);
        typingRef.current = null;
        setDoneTyping(true);
      }
    }, 30);

    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [revealed, fullMessage]);

  const injectedCSS = `
    @keyframes floatStar {
      0% { transform: translateY(0px); opacity: 0.3; }
      50% { transform: translateY(-10px); opacity: 0.8; }
      100% { transform: translateY(0px); opacity: 0.3; }
    }
    .star-float { animation: floatStar 6s ease-in-out infinite; }

    @keyframes heartBeat {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.12); }
      50% { transform: scale(0.96); }
      75% { transform: scale(1.08); }
    }
    .heart-beat { animation: heartBeat 1.2s ease-in-out infinite; }

    @keyframes cardPop {
      0% { transform: translateY(10px) scale(.96); opacity: 0; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    .card-pop { animation: cardPop 500ms cubic-bezier(.2,.9,.2,1) both; }

    @keyframes chipIn {
      0% { transform: translateY(8px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    .chip-in { animation: chipIn 450ms ease-out both; }
  `;

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);
    confetti();
  };

  return (
    <>
      <style>{injectedCSS}</style>

      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-100 via-white to-indigo-100 px-4 py-10">
        {/* subtle gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.16),_transparent_55%)]" />

        {/* floating stars / dots */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-8 w-2 h-2 rounded-full bg-rose-300/70 blur-[1px] star-float" />
          <div className="absolute top-20 right-16 w-3 h-3 rounded-full bg-indigo-300/70 blur-[1px] star-float" style={{ animationDelay: "0.8s" }} />
          <div className="absolute bottom-16 left-1/4 w-3 h-3 rounded-full bg-amber-300/80 blur-[1px] star-float" style={{ animationDelay: "1.3s" }} />
          <div className="absolute bottom-8 right-1/4 w-2 h-2 rounded-full bg-emerald-300/80 blur-[1px] star-float" style={{ animationDelay: "2s" }} />
        </div>

        {/* main card */}
        <div className="relative z-10 w-full max-w-3xl card-pop">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/70 p-6 md:p-8">
            {/* heading */}
            <div className="text-center mb-6">
              <p className="text-sm uppercase tracking-[0.2em] text-rose-400 mb-2">
                Final Surprise
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                Abi, this one&apos;s just for you ✨
              </h1>
            </div>

            {/* heart / gift button */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <button
                onClick={handleReveal}
                className={`w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center shadow-xl bg-gradient-to-br from-rose-500 to-fuchsia-500 text-white relative border border-white/80 ${
                  !revealed ? "heart-beat" : ""
                }`}
              >
                {!revealed ? (
                  <span className="text-4xl">🎁</span>
                ) : (
                  <span className="text-4xl">💖</span>
                )}
                <span className="absolute -bottom-6 text-xs font-medium text-slate-600">
                  {revealed ? "Surprise opened" : "Tap to open"}
                </span>
              </button>

              <p className="text-xs md:text-sm text-slate-500 mt-5 text-center max-w-xs">
                {revealed
                  ? "Take a breath and read this slowly."
                  : "There is a little letter hidden inside this gift."}
              </p>
            </div>

            {/* typewriter wish */}
            {revealed && (
              <div className="mt-4 mb-6">
                <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-4 md:p-5">
                  <p className="text-sm md:text-base leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {typed}
                    {!doneTyping && (
                      <span className="inline-block w-[6px] h-4 align-middle bg-slate-600 ml-[1px] animate-pulse" />
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* reasons chips */}
            {revealed && (
              <div className="mt-4">
                <p className="text-xs md:text-sm text-slate-500 mb-2">
                  A few tiny reasons you&apos;re so special:
                </p>
                <div className="flex flex-wrap gap-2">
                  {reasons.map((r, i) => (
                    <span
                      key={i}
                      className="chip-in px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-100 to-indigo-100 text-xs md:text-sm text-slate-700 border border-white/70 shadow-sm"
                      style={{ animationDelay: `${0.15 * i}s` }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* footer line */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-xs md:text-sm text-slate-500 text-center md:text-left">
                No matter where life takes us, this little page will always be one of your birthday stories. 🎂
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Made with</span>
                <span className="text-lg">💗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
