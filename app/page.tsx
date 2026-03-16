"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// グローバルフォント設定
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

// "echoes" を追加
type ViewState = "login" | "loading" | "list" | "details" | "profile" | "echoes";

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

      spawnParticles();

      setTimeout(() => {
        if (checkWrapRef.current) checkWrapRef.current.classList.add('show');
      }, 200);

      const lbl = document.getElementById('completeLabel');
      if (lbl) setTimeout(() => lbl.classList.add('show'), 500);

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
        .holo-shimmer { position: absolute; inset: 0; background: linear-gradient(108deg, transparent 28%, rgba(255,255,255,0.06) 43%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.06) 57%, transparent 72%); animation: shimmer 5s ease-in-out infinite; }
        @keyframes shimmer { 0% { transform: translateX(-120%) skewX(-12deg); } 100% { transform: translateX(220%) skewX(-12deg); } }
        .card-content { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 12px; }
        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-shrink: 0; }
        .venu-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 12px; color: rgba(255,255,255,0.92); letter-spacing: 0.08em; }
        .card-type { font-family: 'DM Mono', monospace; font-size: 8px; color: rgba(255,255,255,0.5); letter-spacing: 0.18em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.18); padding: 2px 6px; border-radius: 20px; }
        .card-artwork { width: 228px; height: 228px; border-radius: 7px; overflow: hidden; flex-shrink: 0; margin-bottom: 10px; position: relative;}
        .card-info { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
        .track-title { font-weight: 700; font-size: 14px; color: rgba(255,255,255,0.95); line-height: 1.25; }
        .artist-name { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.45); letter-spacing: 0.12em; text-transform: uppercase; }
        .card-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
        .serial { font-family: 'DM Mono', monospace; font-size: 8px; color: rgba(255,255,255,0.28); letter-spacing: 0.1em; }
        .serial span { color: rgba(255,255,255,0.65); }
        .download-wrapper { width: 252px; display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }
        .dl-text { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 0.18em; text-transform: uppercase; }
        .dl-percent { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; }
        .seekbar-track { width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; position: relative; }
        .seekbar-fill { height: 100%; width: 0%; border-radius: 2px; background: linear-gradient(90deg, rgba(160,100,255,0.9), rgba(80,200,255,0.9)); box-shadow: 0 0 8px rgba(160,100,255,0.6); transition: width 0.1s linear; position: relative; }
        .seekbar-fill.done { background: linear-gradient(90deg, rgba(60,180,100,0.95), rgba(140,255,180,0.95)); box-shadow: 0 0 20px rgba(80,220,120,0.95); }
        .check-wrap { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); width: 100px; height: 100px; border-radius: 50%; background: rgba(60,180,100,0.18); border: 2.5px solid rgba(140,255,180,0.8); display: flex; align-items: center; justify-content: center; opacity: 0; }
        .check-wrap.show { animation: checkPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s forwards; }
        @keyframes checkPop { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
        .check-wrap svg { width: 46px; height: 46px; stroke: rgba(140,255,180,1); stroke-width: 3; fill: none; stroke-dasharray: 60; stroke-dashoffset: 60; }
        .check-wrap.show svg { animation: drawCheck 0.45s ease 0.65s forwards; }
        @keyframes drawCheck { to { stroke-dashoffset: 0; } }
        .flash { position: fixed; inset: 0; background: white; opacity: 0; pointer-events: none; z-index: 20; }
        .flash.fire { animation: flashFade 0.6s ease-out forwards; }
        @keyframes flashFade { 0% { opacity: 0; } 8% { opacity: 0.65; } 100% { opacity: 0; } }
        .complete-label { position: fixed; bottom: 14%; left: 50%; transform: translateX(-50%) translateY(16px); font-family: 'DM Mono', monospace; font-size: 17px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(140,255,180,0); pointer-events: none; z-index: 15; white-space: nowrap; }
        .complete-label.show { animation: labelRise 0.8s cubic-bezier(0.34, 1.2, 0.64, 1) 0.45s forwards; }
        @keyframes labelRise { 0% { color: rgba(140,255,180,0); transform: translateX(-50%) translateY(16px); } 100% { color: rgba(140,255,180,0.85); transform: translateX(-50%) translateY(0); } }
        .particle { position: absolute; border-radius: 50%; opacity: 0; }
        .particle.fire { animation: particleFly 1.4s cubic-bezier(0.1, 0.8, 0.2, 1) forwards; }
        @keyframes particleFly { 0% { transform: translate(0,0) scale(1); opacity: 1; } 100% { transform: var(--tx) var(--ty) scale(0); opacity: 0; } }
      `}} />

      <div className="card-scene">
        <div className="card" id="card" ref={cardRef}>
          <div className="card-front">
            <div className="holo-bg"></div>
            <div className="holo-shimmer"></div>
            <div className="card-content">
              <div className="card-top">
                <div className="venu-logo">VENU.</div>
                <div className="card-type">Music</div>
              </div>
              <div className="card-artwork">
                <Image src="/jacket.jpg" fill alt="Business Class" style={{ objectFit: 'cover' }} />
              </div>
              <div className="card-info">
                <div className="track-title">Business Class</div>
                <div className="artist-name">DARIO</div>
              </div>
              <div className="card-bottom">
                <div className="serial">Serial <span>#1456</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="download-wrapper">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="dl-text" ref={dlTextRef}>Downloading</span>
          <span className="dl-percent" ref={dlPercentRef}>0%</span>
        </div>
        <div className="seekbar-track">
          <div className="seekbar-fill" ref={seekFillRef}></div>
        </div>
      </div>

      <div className="complete-overlay" ref={overlayRef}>
        <div className="check-wrap" ref={checkWrapRef}>
          <svg viewBox="0 0 24 24"><polyline points="4 13 9 18 20 7"/></svg>
        </div>
      </div>
      <div className="flash" ref={flashRef}></div>
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

  // --- 共通コンポーネント ---
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
      <div
        onClick={() => setView("profile")}
        style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, cursor: "pointer" }}
      >
        <Image src="/profile.jpg" width={36} height={36} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );

  const BottomNav = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", alignItems: "flex-start", padding: "12px 0 20px", zIndex: 100 }}>
      <div onClick={() => setView("list")} style={{ textAlign: "center", width: "60px", cursor: "pointer" }}>
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

      {/* 1. ログイン */}
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

      {/* 2. ローディング */}
      {view === "loading" && (
        <LoadingScreen onComplete={() => setView("list")} />
      )}

      {/* 3. 一覧 */}
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

      {/* 4. 詳細 */}
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
            {/* ... 他の詳細は省略なし ... */}
          </div>
          <BottomNav />
        </main>
      )}

      {/* 5. プロフィール */}
      {view === "profile" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "100px" }}>
          <div style={{ padding: "16px 24px", display: "flex", alignItems: "center" }}>
            <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: "#333", fontSize: "20px", cursor: "pointer", padding: "8px 0" }}>✕</button>
          </div>
          <div style={{ padding: "0 24px", textAlign: "center", marginBottom: "40px" }}>
            <div style={{ width: "88px", height: "88px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 16px", border: "1px solid #eee" }}>
              <Image src="/profile.jpg" width={88} height={88} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginBottom: "4px" }}>萩原 陽一</h2>
            <p style={{ fontSize: "13px", color: "#999" }}>hagiwara@example.com</p>
          </div>
          <div style={{ borderTop: "1px solid #f3f4f6" }}>
            {["プロフィール編集", "Echoes", "設定とプライバシー", "ヘルプセンター"].map((menu, idx) => (
              <div
                key={idx}
                onClick={() => menu === "Echoes" && setView("echoes")} // Echoesへの切り替え
                style={{ padding: "18px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
              >
                <span style={{ fontSize: "15px", color: "#333", fontWeight: "500" }}>{menu}</span>
                <span style={{ color: "#ccc", fontSize: "18px" }}>›</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "40px 24px" }}>
            <button onClick={() => setView("login")} style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #eee", backgroundColor: "#fff", color: "#ff4d4f", fontSize: "15px", fontWeight: "600" }}>ログアウト</button>
          </div>
          <BottomNav />
        </main>
      )}

      {/* 6. Echoes (収益画面) */}
      {view === "echoes" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "100px" }}>
          <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", borderBottom: "1px solid #f3f4f6" }}>
            <button onClick={() => setView("profile")} style={{ background: "none", border: "none", color: "#333", fontSize: "20px", cursor: "pointer", paddingRight: "16px" }}>←</button>
            <h1 style={{ fontSize: "17px", fontWeight: "bold", margin: 0 }}>Echoes</h1>
          </div>

          <div style={{ padding: "32px 24px", textAlign: "center", backgroundColor: "#fcfcfc" }}>
            <p style={{ fontSize: "13px", color: "#999", marginBottom: "8px" }}>現在の総収益</p>
            <h2 style={{ fontSize: "40px", fontWeight: "bold", color: "#333", margin: 0 }}>
              520 <span style={{ fontSize: "16px", fontWeight: "normal" }}>pt</span>
            </h2>
            <div style={{ marginTop: "20px" }}>
              <button style={{ padding: "10px 24px", borderRadius: "24px", border: "1px solid #eee", backgroundColor: "#fff", fontSize: "13px", fontWeight: "600", color: "#333" }}>
                換金申請（1,000pt〜）
              </button>
            </div>
          </div>

          <div style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "16px" }}>収益履歴</h3>
            {[
              { title: "二次流通ロイヤリティ (1st Holder)", artist: "DARIO", date: "2026.03.18", amount: "+17", detail: "4thへの転売による還元" },
              { title: "二次流通ロイヤリティ (2nd Holder)", artist: "久牧彰", date: "2026.03.10", amount: "+348", detail: "3rdへの転売による還元" },
              { title: "初期サポーター報酬", artist: "DARIO", date: "2026.02.15", amount: "+155", detail: "カード保有継続ボーナス" }
            ].map((item, idx) => (
              <div key={idx} style={{ padding: "16px 0", borderBottom: "1px solid #f9f9f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#333", margin: "0 0 4px 0" }}>{item.title}</p>
                  <p style={{ fontSize: "11px", color: "#999", margin: "0 0 8px 0" }}>{item.artist} | {item.date}</p>
                  <p style={{ fontSize: "11px", color: "#bbb", margin: 0 }}>{item.detail}</p>
                </div>
                <div style={{ textAlign: "right", paddingLeft: "16px" }}>
                  <p style={{ fontSize: "16px", fontWeight: "bold", color: "#22c55e", margin: 0 }}>{item.amount} pt</p>
                  <p style={{ fontSize: "10px", color: "#ccc", margin: "4px 0 0 0" }}>完了</p>
                </div>
              </div>
            ))}
          </div>
          <BottomNav />
        </main>
      )}
    </>
  );
}
