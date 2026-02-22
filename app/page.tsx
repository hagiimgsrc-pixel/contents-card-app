"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// グローバルフォント設定（DM Mono を追加）
const FontAndMetaSettings = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;600;700&family=DM+Mono:wght@300;400&display=swap');

    body {
      font-family: 'Noto Sans JP', sans-serif;
      margin: 0;
      -webkit-font-smoothing: antialiased;
      touch-action: manipulation;
      background-color: #fff;
    }

    .nav-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    input {
      font-size: 16px !important;
    }
  `}</style>
);

type ViewState = "login" | "loading" | "list" | "details";

const contents = [
  { id: 1, title: "Business Class", artist: "DARIO", serial: "1456", image: "/jacket.jpg" },
  { id: 2, title: "悠久のアルカナ", artist: "久牧彰", serial: "3122", image: "/jacket2.jpg" },
  { id: 3, title: "SUNDANCE", artist: "PLOP", serial: "457", image: "/jacket3.jpg" },
];

// --- ローディング画面コンポーネント ---
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const seekFillRef = useRef<HTMLDivElement>(null);
  const dlPercentRef = useRef<HTMLSpanElement>(null);
  const dlTextRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const checkWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const DURATION = 10000;
    const SPIN_INTERVAL = 2000;
    let startTime: number | null = null;
    let spinning = false;
    let done = false;
    let animationFrameId: number;
    let spinTimer: NodeJS.Timeout;

    const triggerSpin = () => {
      if (spinning || done || !cardRef.current) return;
      spinning = true;
      cardRef.current.classList.remove('spin');
      void cardRef.current.offsetWidth;
      cardRef.current.classList.add('spin');
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.classList.remove('spin');
          spinning = false;
        }
      }, 2000);
    };

    const spawnParticles = () => {
      if (!overlayRef.current) return;
      const colors = [
        'rgba(255,255,255,0.98)', 'rgba(200,170,255,0.95)',
        'rgba(160,110,255,0.95)', 'rgba(120,160,255,0.95)',
        'rgba(180,210,255,0.95)',
      ];
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      for (let i = 0; i < 56; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const angle = (i / 56) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
        const dist = 100 + Math.random() * 280;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        const size = 4 + Math.random() * 8;
        const dur = (0.9 + Math.random() * 0.7).toFixed(2);
        const color = colors[i % colors.length];
        p.style.cssText = `
          left: ${cx}px; top: ${cy}px;
          background: ${color};
          box-shadow: 0 0 ${size * 2}px ${color};
          width: ${size}px; height: ${size}px;
          --tx: translateX(${tx}px);
          --ty: translateY(${ty}px);
          --dur: ${dur}s;
          animation-delay: ${(Math.random() * 0.18).toFixed(2)}s;
        `;
        overlayRef.current.appendChild(p);
        setTimeout(() => p.remove(), 2000);
        requestAnimationFrame(() => p.classList.add('fire'));
      }

      const streakColors = ['rgba(200,170,255,0.85)', 'rgba(160,110,255,0.85)', 'rgba(120,160,255,0.85)', 'rgba(180,210,255,0.85)'];
      for (let i = 0; i < 16; i++) {
        const s = document.createElement('div');
        s.className = 'streak';
        const angle = (i / 16) * 360;
        const dist = 50 + Math.random() * 90;
        const len = 50 + Math.random() * 80;
        const rad = angle * Math.PI / 180;
        const sx = cx + Math.cos(rad) * dist;
        const sy = cy + Math.sin(rad) * dist;
        const color = streakColors[i % streakColors.length];
        s.style.cssText = `
          left: ${sx}px; top: ${sy}px;
          width: ${len}px;
          background: ${color};
          box-shadow: 0 0 8px ${color};
          --rot: rotate(${angle}deg);
          animation-delay: ${(Math.random() * 0.12).toFixed(2)}s;
        `;
        overlayRef.current.appendChild(s);
        setTimeout(() => s.remove(), 1200);
        requestAnimationFrame(() => s.classList.add('fire'));
      }
    };

    const triggerComplete = () => {
      done = true;
      if (seekFillRef.current) seekFillRef.current.classList.add('done');
      if (dlTextRef.current) dlTextRef.current.textContent = '';
      if (dlPercentRef.current) dlPercentRef.current.textContent = '100%';

      if (flashRef.current) {
        flashRef.current.classList.remove('fire');
        void flashRef.current.offsetWidth;
        flashRef.current.classList.add('fire');
      }

      if (cardRef.current) {
        cardRef.current.classList.remove('spin');
        void cardRef.current.offsetWidth;
        cardRef.current.classList.add('complete');
      }

      document.querySelectorAll('.burst-ring').forEach(r => {
        r.classList.remove('fire');
        void (r as HTMLElement).offsetWidth;
        r.classList.add('fire');
      });

      spawnParticles();

      setTimeout(() => {
        if (checkWrapRef.current) checkWrapRef.current.classList.add('show');
      }, 200);

      const lbl = document.getElementById('completeLabel');
      if (lbl) setTimeout(() => lbl.classList.add('show'), 500);

      // 完了演出後、2.5秒待ってから一覧画面へ自動遷移
      setTimeout(() => {
        onComplete();
      }, 2500);
    };

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      if (seekFillRef.current) seekFillRef.current.style.width = (progress * 100) + '%';
      if (dlPercentRef.current) dlPercentRef.current.textContent = Math.floor(progress * 100) + '%';

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        triggerComplete();
      }
    };

    spinTimer = setInterval(triggerSpin, SPIN_INTERVAL);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      clearInterval(spinTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "40px", padding: "60px 20px", fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: "hidden", position: "relative" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .card-scene { perspective: 1200px; position: relative; z-index: 1; }
        .card { width: 252px; height: 352px; border-radius: 12px; position: relative; box-shadow: 0 0 0 1px rgba(255,255,255,0.07), 0 25px 70px rgba(0,0,0,0.85), 0 0 50px rgba(160,100,255,0.15); transition: box-shadow 0.5s ease; transform-style: preserve-3d; }
        .card.spin { animation: spinCard 1.6s ease-in-out; }
        @keyframes spinCard { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
        .card.complete { animation: floatUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 40px 100px rgba(0,0,0,0.9), 0 0 80px rgba(160,100,255,0.5), 0 0 120px rgba(80,200,255,0.3); }
        @keyframes floatUp { 0% { transform: translateY(0) scale(1); } 60% { transform: translateY(-24px) scale(1.04); } 100% { transform: translateY(-16px) scale(1.03); } }
        .card-front { position: absolute; inset: 0; border-radius: 12px; overflow: hidden; backface-visibility: hidden; }
        .holo-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 25% 20%, rgba(255,80,200,0.45) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(60,200,255,0.45) 0%, transparent 55%), radial-gradient(ellipse at 65% 25%, rgba(120,255,200,0.25) 0%, transparent 40%), linear-gradient(135deg, #18052a 0%, #051828 60%, #182808 100%); animation: holoShift 9s ease-in-out infinite alternate; }
        .card.complete .holo-bg { animation: holoShift 9s ease-in-out infinite alternate, holoIntensify 0.8s ease forwards; }
        @keyframes holoIntensify { 0% { filter: brightness(1); } 100% { filter: brightness(1.4) saturate(1.3); } }
        @keyframes holoShift { 0% { filter: hue-rotate(0deg) brightness(1); } 50% { filter: hue-rotate(25deg) brightness(1.08); } 100% { filter: hue-rotate(-15deg) brightness(0.95); } }
        .holo-shimmer { position: absolute; inset: 0; background: linear-gradient(108deg, transparent 28%, rgba(255,255,255,0.06) 43%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.06) 57%, transparent 72%); animation: shimmer 5s ease-in-out infinite; }
        .card.complete .holo-shimmer { animation: shimmer 0.8s ease-in-out 3; }
        @keyframes shimmer { 0% { transform: translateX(-120%) skewX(-12deg); } 100% { transform: translateX(220%) skewX(-12deg); } }
        .holo-lines { position: absolute; inset: 0; background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px); mix-blend-mode: overlay; }
        .card-content { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 12px; }
        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-shrink: 0; }
        .venu-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 12px; color: rgba(255,255,255,0.92); letter-spacing: 0.08em; }
        .card-type { font-family: 'DM Mono', monospace; font-size: 8px; color: rgba(255,255,255,0.5); letter-spacing: 0.18em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.18); padding: 2px 6px; border-radius: 20px; }
        .card-artwork { width: 228px; height: 228px; border-radius: 7px; overflow: hidden; flex-shrink: 0; margin-bottom: 10px; position: relative;}
        .card-artwork img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .card-info { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
        .track-title { font-weight: 700; font-size: 14px; color: rgba(255,255,255,0.95); line-height: 1.25; }
        .artist-name { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.45); letter-spacing: 0.12em; text-transform: uppercase; }
        .card-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
        .serial { font-family: 'DM Mono', monospace; font-size: 8px; color: rgba(255,255,255,0.28); letter-spacing: 0.1em; }
        .serial span { color: rgba(255,255,255,0.65); }
        .nfc-icon { width: 16px; height: 16px; opacity: 0.35; }
        .card-back { position: absolute; inset: 0; border-radius: 12px; overflow: hidden; backface-visibility: hidden; transform: rotateY(180deg); background: linear-gradient(135deg, #0c0c1a 0%, #1a1a2e 100%); display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 28px 24px; }
        .back-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 28px; color: rgba(255,255,255,0.9); letter-spacing: 0.12em; }
        .nfc-area { width: 70px; height: 70px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; position: relative; }
        .nfc-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(160,100,255,0.3); animation: pulse 3s ease-in-out infinite; }
        .nfc-ring:nth-child(1) { inset: 13px; animation-delay: 0s; }
        .nfc-ring:nth-child(2) { inset: 4px;  animation-delay: 0.6s; }
        .nfc-ring:nth-child(3) { inset: -4px; animation-delay: 1.2s; }
        @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.7; } }
        .back-serial { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.16); letter-spacing: 0.15em; }
        .download-wrapper { width: 252px; display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }
        .download-label { display: flex; justify-content: space-between; align-items: center; }
        .dl-text { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 0.18em; text-transform: uppercase; transition: opacity 0.3s; }
        .dl-percent { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; }
        .seekbar-track { width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; position: relative; }
        .seekbar-fill { height: 100%; width: 0%; border-radius: 2px; background: linear-gradient(90deg, rgba(160,100,255,0.9), rgba(80,200,255,0.9)); box-shadow: 0 0 8px rgba(160,100,255,0.6); transition: width 0.1s linear; position: relative; }
        .seekbar-fill::after { content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 6px; height: 6px; border-radius: 50%; background: white; box-shadow: 0 0 6px rgba(160,100,255,1), 0 0 12px rgba(80,200,255,0.8); }
        .seekbar-fill.done { background: linear-gradient(90deg, rgba(60,180,100,0.95), rgba(140,255,180,0.95)); box-shadow: 0 0 20px rgba(80,220,120,0.95), 0 0 40px rgba(80,220,120,0.5); transition: background 0.4s ease, box-shadow 0.4s ease; }
        .seekbar-fill.done::after { display: none; }
        .complete-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 10; overflow: hidden; }
        .burst-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); border-radius: 50%; border: 3px solid rgba(255,255,255,0.95); opacity: 0; }
        .burst-ring.fire { animation: burstRing 1.4s cubic-bezier(0.1, 0.6, 0.2, 1) forwards; }
        .burst-ring:nth-child(1) { width: 120px;  height: 120px;  border: 4px solid rgba(255,255,255,0.95);    animation-delay: 0s; }
        .burst-ring:nth-child(2) { width: 280px;  height: 280px;  border: 3px solid rgba(200,170,255,0.85);   animation-delay: 0.07s; }
        .burst-ring:nth-child(3) { width: 460px;  height: 460px;  border: 2px solid rgba(160,110,255,0.7);    animation-delay: 0.14s; }
        .burst-ring:nth-child(4) { width: 660px;  height: 660px;  border: 2px solid rgba(120,160,255,0.5);    animation-delay: 0.21s; }
        .burst-ring:nth-child(5) { width: 880px;  height: 880px;  border: 1px solid rgba(180,210,255,0.3);    animation-delay: 0.28s; }
        @keyframes burstRing { 0% { transform: translate(-50%, -50%) scale(0); opacity: 1; } 70% { opacity: 0.7; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 0; } }
        .particle { position: absolute; border-radius: 50%; opacity: 0; }
        .particle.fire { animation: particleFly var(--dur, 1.4s) cubic-bezier(0.1, 0.8, 0.2, 1) forwards; }
        @keyframes particleFly { 0% { transform: translate(0,0) scale(1); opacity: 1; } 80% { opacity: 0.9; } 100% { transform: var(--tx) var(--ty) scale(0); opacity: 0; } }
        .streak { position: absolute; height: 2px; border-radius: 2px; opacity: 0; transform-origin: left center; }
        .streak.fire { animation: streakFly 0.7s ease-out forwards; }
        @keyframes streakFly { 0% { opacity: 1; transform: var(--rot) scaleX(0); } 60% { opacity: 1; transform: var(--rot) scaleX(1); } 100% { opacity: 0; transform: var(--rot) scaleX(1) translateX(80px); } }
        .check-wrap { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); width: 100px; height: 100px; border-radius: 50%; background: rgba(60,180,100,0.18); border: 2.5px solid rgba(140,255,180,0.8); display: flex; align-items: center; justify-content: center; opacity: 0; box-shadow: 0 0 50px rgba(80,220,120,0.6), 0 0 100px rgba(80,220,120,0.25), inset 0 0 30px rgba(80,220,120,0.1); }
        .check-wrap.show { animation: checkPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s forwards; }
        @keyframes checkPop { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0; } 65% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
        .check-wrap svg { width: 46px; height: 46px; stroke: rgba(140,255,180,1); stroke-width: 3; fill: none; stroke-dasharray: 60; stroke-dashoffset: 60; filter: drop-shadow(0 0 8px rgba(140,255,180,0.9)); }
        .check-wrap.show svg { animation: drawCheck 0.45s ease 0.65s forwards; }
        @keyframes drawCheck { to { stroke-dashoffset: 0; } }
        .flash { position: fixed; inset: 0; background: white; opacity: 0; pointer-events: none; z-index: 20; }
        .flash.fire { animation: flashFade 0.6s ease-out forwards; }
        @keyframes flashFade { 0% { opacity: 0; } 8% { opacity: 0.65; } 20% { opacity: 0.15; } 30% { opacity: 0.45; } 100% { opacity: 0; } }
        .complete-label { position: fixed; bottom: 14%; left: 50%; transform: translateX(-50%) translateY(16px); font-family: 'DM Mono', monospace; font-size: 17px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(140,255,180,0); text-shadow: 0 0 20px rgba(80,220,120,0.9); pointer-events: none; z-index: 15; white-space: nowrap; }
        .complete-label.show { animation: labelRise 0.8s cubic-bezier(0.34, 1.2, 0.64, 1) 0.45s forwards; }
        @keyframes labelRise { 0% { color: rgba(140,255,180,0); transform: translateX(-50%) translateY(16px); } 100% { color: rgba(140,255,180,0.85); transform: translateX(-50%) translateY(0); } }
      `}} />

      {/* Card */}
      <div className="card-scene">
        <div className="card" id="card" ref={cardRef}>
          <div className="card-front">
            <div className="holo-bg"></div>
            <div className="holo-shimmer"></div>
            <div className="holo-lines"></div>
            <div className="card-content">
              <div className="card-top">
                <div className="venu-logo">VENU.</div>
                <div className="card-type">Music</div>
              </div>
              <div className="card-artwork">
                <Image src="/jacket.jpg" fill alt="Business Class" style={{ objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="card-info">
                <div className="track-title">Business Class</div>
                <div className="artist-name">DARIO</div>
              </div>
              <div className="card-bottom">
                <div className="serial">Serial <span>#1456</span></div>
                <svg className="nfc-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  <path d="M8.5 8.5c.83-.83 1.94-1.3 3.1-1.38M6 6c1.66-1.66 3.86-2.6 6.1-2.7M11 12.5c.28-.28.65-.44 1.05-.45"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="card-back">
            <div className="back-logo">VENU.</div>
            <div className="nfc-area">
              <div className="nfc-ring"></div>
              <div className="nfc-ring"></div>
              <div className="nfc-ring"></div>
            </div>
            <div className="back-serial">#1456 / 2000</div>
          </div>
        </div>
      </div>

      {/* Download UI */}
      <div className="download-wrapper">
        <div className="download-label">
          <span className="dl-text" id="dlText" ref={dlTextRef}>Downloading</span>
          <span className="dl-percent" id="dlPercent" ref={dlPercentRef}>0%</span>
        </div>
        <div className="seekbar-track">
          <div className="seekbar-fill" id="seekFill" ref={seekFillRef}></div>
        </div>
      </div>

      {/* Complete overlay */}
      <div className="complete-overlay" id="overlay" ref={overlayRef}>
        <div className="burst-ring"></div>
        <div className="burst-ring"></div>
        <div className="burst-ring"></div>
        <div className="burst-ring"></div>
        <div className="burst-ring"></div>
        <div className="check-wrap" id="checkWrap" ref={checkWrapRef}>
          <svg viewBox="0 0 24 24"><polyline points="4 13 9 18 20 7"/></svg>
        </div>
      </div>

      {/* Flash */}
      <div className="flash" id="flash" ref={flashRef}></div>
      <div className="complete-label" id="completeLabel">COMPLETED</div>
    </div>
  );
};


export default function Home() {
  const [view, setView] = useState<ViewState>("login");
  const [selected, setSelected] = useState(contents[0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // --- 共通コンポーネント: 検索バー付きヘッダー ---
  const SearchHeader = () => (
    <div style={{ padding: "16px 24px", backgroundColor: "#fff", display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f3f4f6", padding: "10px 16px", borderRadius: "25px" }}>
        <span style={{ color: "#999", fontSize: "14px" }}>🔍</span>
        <input
          type="text"
          placeholder="Search in Contents"
          style={{ border: "none", backgroundColor: "transparent", width: "100%", outline: "none", color: "#333", fontSize: "14px" }}
        />
      </div>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
        <Image src="/profile.jpg" width={36} height={36} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );

  // --- 下部ナビゲーション ---
  const BottomNav = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", alignItems: "flex-start", padding: "12px 0 20px", zIndex: 100 }}>
      <div style={{ textAlign: "center", width: "60px" }}>
        <Image src="/gemm.png" width={24} height={24} alt="GEMM" style={{ display: "block", margin: "0 auto 2px" }} />
        <span className="nav-text" style={{ fontSize: "9px", color: "#333", display: "block" }}>GEMM</span>
      </div>
      <div style={{ textAlign: "center", width: "60px" }}>
        <Image src="/mune.png" width={24} height={24} alt="MUNE" style={{ display: "block", margin: "0 auto 2px", opacity: 0.5 }} />
        <span className="nav-text" style={{ fontSize: "9px", color: "#999", display: "block" }}>MUNE</span>
      </div>
      <div style={{ textAlign: "center", width: "60px" }}>
        <Image src="/loopa.png" width={24} height={24} alt="LOOPA" style={{ display: "block", margin: "0 auto 2px", opacity: 0.5 }} />
        <span className="nav-text" style={{ fontSize: "9px", color: "#999", display: "block" }}>LOOPA</span>
      </div>
    </div>
  );

  return (
    <>
      <FontAndMetaSettings />

      {/* 1. ログイン画面 */}
      {view === "login" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <div style={{ marginBottom: "60px" }}>
            <Image src="/logo.png" width={180} height={60} alt="VENU." priority style={{ objectFit: "contain" }} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setView("loading"); }} style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" placeholder="name" required style={{ padding: "14px 16px", borderRadius: "8px", border: "1px solid #eee", backgroundColor: "#fafafa" }} />
            <input type="password" placeholder="password" required style={{ padding: "14px 16px", borderRadius: "8px", border: "1px solid #eee", backgroundColor: "#fafafa" }} />
            <button type="submit" style={{ marginTop: "16px", padding: "14px", borderRadius: "8px", border: "none", backgroundColor: "#228be6", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>sign in</button>
          </form>
        </main>
      )}

      {/* 2. ローディング画面 (追加) */}
      {view === "loading" && (
        <LoadingScreen onComplete={() => setView("list")} />
      )}

      {/* 3. マイページ (一覧) */}
      {view === "list" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "100px" }}>
          <SearchHeader />
          <div style={{ padding: "20px 24px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#999", marginBottom: "16px" }}>Suggested</h2>
            {contents.map((item) => (
              <div key={item.id} onClick={() => { setSelected(item); setView("details"); }} style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", cursor: "pointer" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                  <Image src={item.image} width={64} height={64} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "14px", color: "#333" }}>{item.title}</div>
                  <div style={{ fontSize: "11px", color: "#666", marginTop: "4px", fontWeight: "bold" }}>{item.artist}</div>
                  <div style={{ fontSize: "10px", color: "#aaa", marginTop: "4px" }}>Serial: {item.serial}</div>
                </div>
              </div>
            ))}
          </div>
          <BottomNav />
        </main>
      )}

      {/* 4. 詳細画面 */}
      {view === "details" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "120px" }}>
          <SearchHeader />
          <div style={{ padding: "0 24px 40px" }}>
            <button onClick={() => setView("list")} style={{ margin: "16px 0 24px", background: "none", border: "none", color: "#aaa", fontSize: "14px", cursor: "pointer", padding: 0 }}>
              ← Back
            </button>

            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ width: "100%", maxWidth: "300px", margin: "0 auto", borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                <Image src={selected.image} width={300} height={300} alt={selected.title} style={{ width: "100%", height: "auto" }} />
              </div>
              <div style={{ marginTop: "24px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "6px", color: "#333" }}>{selected.title}</h2>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "4px", fontWeight: "bold" }}>{selected.artist}</p>
                <p style={{ fontSize: "11px", color: "#aaa" }}>Serial: {selected.serial}</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "bold", color: "#aaa", marginBottom: "8px" }}>🎵 楽曲再生</p>
                <audio controls style={{ width: "100%", outline: "none" }}>
                  <source src="/FamilyMart_Demo.mp3" type="audio/mpeg" />
                </audio>
              </div>

              <div>
                <p style={{ fontSize: "12px", fontWeight: "bold", color: "#aaa", marginBottom: "8px" }}>🎬 特典動画</p>
                <div style={{ borderRadius: "8px", overflow: "hidden", backgroundColor: "#000" }}>
                  <video controls style={{ width: "100%", display: "block" }}>
                    <source src="/Behind_The_Scenes.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div>
                  <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px", color: "#333" }}>特典写真</p>
                  <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                    <Image src="/Tour_Photo.jpg" width={400} height={300} alt="特典写真" style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px", color: "#333" }}>ライブチケット</p>
                  <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <Image src="/qr_code.png" width={180} height={180} alt="QRコード" style={{ width: "180px", height: "180px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BottomNav />
        </main>
      )}
    </>
  );
}
