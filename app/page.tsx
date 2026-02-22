"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// --- フォント・グローバル設定 ---
const FontAndMetaSettings = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;600;700&family=DM+Mono:wght@300;400&display=swap');

    body {
      font-family: 'Noto Sans JP', sans-serif;
      margin: 0;
      background-color: #fff;
      -webkit-font-smoothing: antialiased;
    }
    .nav-text { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; }
    input { font-size: 16px !important; }
  `}</style>
);

type ViewState = "login" | "loading" | "list" | "details";

const contents = [
  { id: 1, title: "Netherwalk", artist: "YOICHI HAGIWARA", serial: "1456", image: "/jacket.jpg" },
  { id: 2, title: "悠久のアルカナ", artist: "久牧彰", serial: "3122", image: "/jacket2.jpg" },
  { id: 3, title: "SUNDANCE PLOP", artist: "PLOP", serial: "457", image: "/jacket3.jpg" },
];

// --- ローディング画面コンポーネント (演出用) ---
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const seekFillRef = useRef<HTMLDivElement>(null);
  const dlPercentRef = useRef<HTMLSpanElement>(null);
  const dlTextRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const checkWrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const DURATION = 10000; // 10秒固定の演出時間
    const SPIN_INTERVAL = 2000;
    let startTime: number | null = null;
    let spinning = false;
    let animationFrameId: number;
    let spinTimer: NodeJS.Timeout;

    // カードの回転アニメーション発火
    const triggerSpin = () => {
      if (spinning || !cardRef.current) return;
      spinning = true;
      cardRef.current.classList.remove('spin');
      void cardRef.current.offsetWidth;
      cardRef.current.classList.add('spin');
      setTimeout(() => { spinning = false; }, 1600);
    };

    // パーティクル生成 (ご提示のロジックを最適化)
    const spawnParticles = () => {
      if (!overlayRef.current) return;
      const colors = ['#fff', '#c8aaff', '#a06eff', '#78a0ff', '#b4d2ff'];
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const angle = (i / 50) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
        const dist = 120 + Math.random() * 250;
        const size = 4 + Math.random() * 6;
        const dur = 0.8 + Math.random() * 0.6;

        p.style.cssText = `
          position: absolute; left: ${cx}px; top: ${cy}px;
          width: ${size}px; height: ${size}px; border-radius: 50%;
          background: ${colors[i % colors.length]};
          box-shadow: 0 0 ${size * 2}px ${colors[i % colors.length]};
          --tx: ${Math.cos(angle) * dist}px; --ty: ${Math.sin(angle) * dist}px;
          animation: particleFly ${dur}s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
        `;
        overlayRef.current.appendChild(p);
        setTimeout(() => p.remove(), dur * 1000);
      }
    };

    // 完了時の演出シークエンス
    const triggerComplete = () => {
      clearInterval(spinTimer);
      if (seekFillRef.current) seekFillRef.current.classList.add('done');
      if (dlTextRef.current) dlTextRef.current.style.opacity = '0';
      if (dlPercentRef.current) dlPercentRef.current.textContent = '100%';

      // フラッシュとカードの浮上
      if (flashRef.current) flashRef.current.classList.add('fire');
      if (cardRef.current) {
        cardRef.current.classList.remove('spin');
        cardRef.current.classList.add('complete');
      }

      // リング演出
      const rings = overlayRef.current?.querySelectorAll('.burst-ring');
      rings?.forEach(r => r.classList.add('fire'));

      spawnParticles();

      // チェックマークとラベル表示
      setTimeout(() => checkWrapRef.current?.classList.add('show'), 200);
      setTimeout(() => labelRef.current?.classList.add('show'), 500);

      // すべての演出が終わってから遷移
      setTimeout(onComplete, 3000);
    };

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      if (seekFillRef.current) seekFillRef.current.style.width = `${progress * 100}%`;
      if (dlPercentRef.current) dlPercentRef.current.textContent = `${Math.floor(progress * 100)}%`;

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
    <div className="loading-container">
      <style dangerouslySetInnerHTML={{__html: `
        .loading-container {
          background: #0a0a0a; min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 40px; overflow: hidden; position: relative;
        }
        .card-scene { perspective: 1200px; z-index: 1; }
        .card {
          width: 252px; height: 352px; border-radius: 12px; position: relative;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.07), 0 25px 70px rgba(0,0,0,0.85);
          transform-style: preserve-3d; transition: all 0.5s ease;
        }
        .card.spin { animation: spinCard 1.6s ease-in-out; }
        .card.complete { animation: floatUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; box-shadow: 0 0 80px rgba(160,100,255,0.4); }

        @keyframes spinCard { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes floatUp { to { transform: translateY(-16px) scale(1.03); } }

        .card-front { position: absolute; inset: 0; border-radius: 12px; overflow: hidden; backface-visibility: hidden; background: #1a1a1a; }
        .holo-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #18052a 0%, #051828 60%, #182808 100%); opacity: 0.8; }
        .card-content { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 12px; z-index: 2; }

        .download-wrapper { width: 252px; display: flex; flex-direction: column; gap: 10px; z-index: 1; }
        .seekbar-track { width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
        .seekbar-fill {
          height: 100%; width: 0%; background: linear-gradient(90deg, #a064ff, #50c8ff);
          box-shadow: 0 0 10px #a064ff; transition: width 0.1s linear;
        }
        .seekbar-fill.done { background: #3cb464; box-shadow: 0 0 20px #3cb464; }

        @keyframes particleFly {
          0% { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }

        .burst-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); border-radius: 50%; border: 2px solid #fff; opacity: 0; }
        .burst-ring.fire { animation: burst 1.2s ease-out forwards; }
        @keyframes burst { from { transform: translate(-50%, -50%) scale(0); opacity: 1; } to { transform: translate(-50%, -50%) scale(4); opacity: 0; } }

        .check-wrap {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0);
          width: 80px; height: 80px; border-radius: 50%; background: rgba(60,180,100,0.2);
          border: 2px solid #8cffb4; display: flex; align-items: center; justify-content: center; opacity: 0;
        }
        .check-wrap.show { transform: translate(-50%, -50%) scale(1); opacity: 1; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .complete-label {
          position: fixed; bottom: 15%; font-family: 'DM Mono'; letter-spacing: 0.3em; color: #8cffb4;
          opacity: 0; transform: translateY(10px); transition: all 0.5s ease;
        }
        .complete-label.show { opacity: 1; transform: translateY(0); }
        .flash { position: fixed; inset: 0; background: #fff; opacity: 0; pointer-events: none; z-index: 100; }
        .flash.fire { animation: flashEffect 0.6s ease-out; }
        @keyframes flashEffect { 0% { opacity: 0; } 20% { opacity: 0.7; } 100% { opacity: 0; } }
      `}} />

      <div className="card-scene">
        <div className="card" ref={cardRef}>
          <div className="card-front">
            <div className="holo-bg"></div>
            <div className="card-content">
              <div className="text-[10px] text-white/50 font-bold tracking-widest">VENU.</div>
              <div className="relative w-full aspect-square mt-2 mb-3 rounded-md overflow-hidden">
                <Image src="/jacket.jpg" fill alt="Jacket" style={{ objectFit: 'cover' }} />
              </div>
              <div className="text-white text-sm font-bold">Business Class</div>
              <div className="text-white/40 text-[9px] font-mono tracking-wider">DARIO</div>
              <div className="mt-auto pt-2 border-t border-white/10 text-[8px] text-white/20 font-mono">
                SERIAL #1456
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="download-wrapper">
        <div className="flex justify-between items-center text-[10px] font-mono text-white/40 uppercase tracking-tighter">
          <span ref={dlTextRef}>Downloading Content...</span>
          <span ref={dlPercentRef}>0%</span>
        </div>
        <div className="seekbar-track">
          <div className="seekbar-fill" ref={seekFillRef}></div>
        </div>
      </div>

      <div className="complete-overlay" ref={overlayRef}>
        <div className="burst-ring"></div>
        <div className="burst-ring" style={{ animationDelay: '0.1s' }}></div>
        <div className="check-wrap" ref={checkWrapRef}>
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#8cffb4" strokeWidth="3">
            <polyline points="4 13 9 18 20 7" />
          </svg>
        </div>
      </div>

      <div className="flash" ref={flashRef}></div>
      <div className="complete-label" ref={labelRef}>DOWNLOAD COMPLETED</div>
    </div>
  );
};

// --- メインページ ---
export default function Home() {
  const [view, setView] = useState<ViewState>("login");
  const [selected, setSelected] = useState(contents[0]);

  const SearchHeader = () => (
    <header className="p-4 flex items-center gap-4 sticky top-0 bg-white z-50">
      <div className="flex-1 flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
        <span className="text-gray-400 text-sm">🔍</span>
        <input type="text" placeholder="Search Contents" className="bg-transparent border-none outline-none text-sm w-full" />
      </div>
      <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-100">
        <Image src="/profile.jpg" width={36} height={36} alt="User" />
      </div>
    </header>
  );

  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 pb-6 flex justify-around items-center z-50">
      {["GEMM", "MUNE", "LOOPA"].map((name, i) => (
        <div key={name} className={`flex flex-col items-center gap-1 ${i === 0 ? 'opacity-100' : 'opacity-30'}`}>
          <div className="w-6 h-6 bg-black rounded-sm" />
          <span className="text-[9px] font-bold tracking-tighter">{name}</span>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <FontAndMetaSettings />

      {view === "login" && (
        <main className="min-h-screen flex flex-col items-center justify-center p-10">
          <Image src="/logo.png" width={160} height={50} alt="Logo" className="mb-12" />
          <form className="w-full max-w-xs flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); setView("loading"); }}>
            <input type="text" placeholder="Username" className="p-4 bg-gray-50 border rounded-lg outline-none" required />
            <input type="password" placeholder="Password" className="p-4 bg-gray-50 border rounded-lg outline-none" required />
            <button className="mt-4 p-4 bg-blue-600 text-white font-bold rounded-lg active:scale-95 transition-transform">Sign In</button>
          </form>
        </main>
      )}

      {view === "loading" && <LoadingScreen onComplete={() => setView("list")} />}

      {view === "list" && (
        <main className="min-h-screen pb-24 bg-white">
          <SearchHeader />
          <div className="px-6 py-4">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Your Collection</h2>
            <div className="flex flex-col gap-6">
              {contents.map((item) => (
                <div key={item.id} onClick={() => { setSelected(item); setView("details"); }} className="flex items-center gap-4 cursor-pointer">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                    <Image src={item.image} width={64} height={64} alt={item.title} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-800">{item.title}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{item.artist}</p>
                    <p className="text-[9px] text-gray-300 font-mono mt-1">SN: {item.serial}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <BottomNav />
        </main>
      )}

      {
