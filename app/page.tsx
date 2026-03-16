"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { User, Settings, HelpCircle, Activity, ChevronRight, ArrowLeft, TrendingUp } from "lucide-react";
import Link from 'next/link';

// --- グローバルフォント・スタイル設定 ---
const FontAndMetaSettings = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;600;700&family=DM+Mono:wght@300;400&display=swap');

    body {
      font-family: 'Noto Sans JP', sans-serif;
      margin: 0;
      -webkit-font-smoothing: antialiased;
      touch-action: manipulation;
      background-color: #fff;
      color: #333;
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

// 表示画面の型定義
type ViewState = "login" | "loading" | "list" | "details" | "profile" | "echoes";

const contents = [
  { id: 1, title: "Business Class", artist: "DARIO", serial: "1456", image: "/jacket.jpg" },
  { id: 2, title: "悠久のアルカナ", artist: "久牧彰", serial: "3122", image: "/jacket2.jpg" },
  { id: 3, title: "SUNDANCE", artist: "PLOP", serial: "457", image: "/jacket3.jpg" },
];

// --- ローディング画面（NFCスキャン演出）コンポーネント ---
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const seekFillRef = useRef<HTMLDivElement>(null);
  const dlPercentRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const checkWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const DURATION = 3500; // デモ用に少し短縮
    let startTime: number | null = null;
    let animationFrameId: number;

    const spawnParticles = () => {
      if (!overlayRef.current) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
          position: absolute; left: ${cx}px; top: ${cy}px;
          width: 6px; height: 6px; background: #a06eff;
          border-radius: 50%; pointer-events: none;
          transition: all 1s ease-out;
        `;
        overlayRef.current.appendChild(p);
        const tx = (Math.random() - 0.5) * 400;
        const ty = (Math.random() - 0.5) * 400;
        requestAnimationFrame(() => {
          p.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
          p.style.opacity = '0';
        });
        setTimeout(() => p.remove(), 1000);
      }
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
        if (flashRef.current) {
          flashRef.current.style.opacity = '1';
          setTimeout(() => { if (flashRef.current) flashRef.current.style.opacity = '0'; }, 300);
        }
        spawnParticles();
        if (checkWrapRef.current) checkWrapRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        if (checkWrapRef.current) checkWrapRef.current.style.opacity = '1';
        setTimeout(onComplete, 1500);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "40px", position: "relative", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .seekbar-track { width: 200px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
        .seekbar-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #a06eff, #50c8ff); }
        .flash { position: fixed; inset: 0; background: white; opacity: 0; pointer-events: none; transition: opacity 0.3s; z-index: 100; }
        .check-wrap { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); opacity: 0; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); background: #4ade80; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 50; }
      `}} />
      <div style={{ color: "white", fontSize: "12px", letterSpacing: "0.2em" }}>AUTHENTICATING...</div>
      <div className="seekbar-track"><div className="seekbar-fill" ref={seekFillRef}></div></div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }} ref={dlPercentRef}>0%</div>
      <div className="flash" ref={flashRef}></div>
      <div className="check-wrap" ref={checkWrapRef}><Activity color="white" size={40} /></div>
      <div ref={overlayRef}></div>
    </div>
  );
};

// --- メインアプリケーション ---
export default function Home() {
  const [view, setView] = useState<ViewState>("login");
  const [selected, setSelected] = useState(contents[0]);

  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  const SearchHeader = () => (
    <div style={{ padding: "16px 24px", backgroundColor: "#fff", display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f3f4f6", padding: "10px 16px", borderRadius: "25px" }}>
        <span style={{ color: "#999" }}>🔍</span>
        <input type="text" placeholder="Search" style={{ border: "none", backgroundColor: "transparent", width: "100%", outline: "none", fontSize: "14px" }} />
      </div>
<Link href="/profile">
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", cursor: "pointer", border: "2px solid #eee" }}>
        <img src="https://github.com/hagiimgsrc-pixel.png" alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </Link>
  </div>
);

  const BottomNav = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", padding: "12px 0 20px", zIndex: 10 }}>
      <div onClick={() => setView("list")} style={{ textAlign: "center", opacity: view === "list" ? 1 : 0.4 }}><Activity size={24} /><span className="nav-text" style={{ fontSize: "9px", display: "block" }}>GEMM</span></div>
      <div style={{ textAlign: "center", opacity: 0.4 }}><TrendingUp size={24} /><span className="nav-text" style={{ fontSize: "9px", display: "block" }}>MUNE</span></div>
      <div style={{ textAlign: "center", opacity: 0.4 }}><User size={24} /><span className="nav-text" style={{ fontSize: "9px", display: "block" }}>LOOPA</span></div>
    </div>
  );

  return (
    <>
      <FontAndMetaSettings />

      {/* 1. ログイン */}
      {view === "login" && (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <Image src="/logo.png" width={160} height={50} alt="VENU." style={{ marginBottom: "40px" }} />
          <form onSubmit={(e) => { e.preventDefault(); setView("loading"); }} style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" placeholder="name" required style={{ padding: "14px", borderRadius: "8px", border: "1px solid #eee", backgroundColor: "#fafafa" }} />
            <input type="password" placeholder="password" required style={{ padding: "14px", borderRadius: "8px", border: "1px solid #eee", backgroundColor: "#fafafa" }} />
            <button type="submit" style={{ padding: "14px", borderRadius: "8px", border: "none", backgroundColor: "#228be6", color: "#fff", fontWeight: "bold" }}>sign in</button>
          </form>
        </main>
      )}

      {/* 2. ローディング */}
      {view === "loading" && <LoadingScreen onComplete={() => setView("list")} />}

      {/* 3. 一覧 */}
      {view === "list" && (
        <main style={{ minHeight: "100vh", paddingBottom: "100px" }}>
          <SearchHeader />
          <div style={{ padding: "24px" }}>
            <h2 style={{ fontSize: "12px", color: "#aaa", marginBottom: "20px" }}>SUGGESTED FOR YOU</h2>
            {contents.map((item) => (
              <div key={item.id} onClick={() => { setSelected(item); setView("details"); }} style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <Image src={item.image} width={60} height={60} alt={item.title} style={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "15px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>{item.artist}</div>
                </div>
              </div>
            ))}
          </div>
          <BottomNav />
        </main>
      )}

      {/* 4. 詳細 */}
      {view === "details" && (
        <main style={{ minHeight: "100vh", paddingBottom: "100px" }}>
          <SearchHeader />
          <div style={{ padding: "24px" }}>
            <ArrowLeft onClick={() => setView("list")} style={{ marginBottom: "20px" }} />
            <div style={{ textAlign: "center" }}>
              <Image src={selected.image} width={280} height={280} alt={selected.title} style={{ borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }} />
              <h2 style={{ fontSize: "22px", margin: "24px 0 8px" }}>{selected.title}</h2>
              <p style={{ color: "#666" }}>{selected.artist}</p>
            </div>
          </div>
          <BottomNav />
        </main>
      )}

      {/* 5. プロフィール */}
      {view === "profile" && (
        <main style={{ minHeight: "100vh" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #f0f0f0" }}>
            <ArrowLeft onClick={() => setView("list")} style={{ marginRight: "16px" }} />
            <h1 style={{ fontSize: "18px", fontWeight: "bold" }}>プロフィール</h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0" }}>
            <div style={{ width: "90px", height: "90px", borderRadius: "50%", overflow: "hidden", border: "3px solid #f8f8f8", marginBottom: "12px" }}>
              <Image src="/profile.jpg" width={90} height={90} alt="User" />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>萩原さん</h2>
            <p style={{ color: "#aaa", fontSize: "14px" }}>累計収益: 520 pt</p>
          </div>
          <div style={{ padding: "0 24px" }}>
            {[
              { label: "プロフィール編集", icon: <User size={20} />, action: () => {} },
              { label: "Echoes (収益履歴)", icon: <Activity size={20} />, action: () => setView("echoes") },
              { label: "設定とプライバシー", icon: <Settings size={20} />, action: () => {} },
            ].map((item, i) => (
              <div key={i} onClick={item.action} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid #fcfcfc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>{item.icon}<span style={{ fontWeight: "600" }}>{item.label}</span></div>
                <ChevronRight size={18} color="#eee" />
              </div>
            ))}
          </div>
          <BottomNav />
        </main>
      )}

      {/* 6. Echoes（収益履歴） */}
      {view === "echoes" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "16px 24px", backgroundColor: "#fff", borderBottom: "1px solid #f0f0f0" }}>
            <ArrowLeft onClick={() => setView("profile")} style={{ marginRight: "16px" }} />
            <h1 style={{ fontSize: "18px", fontWeight: "bold" }}>Echoes</h1>
          </div>
          <div style={{ padding: "24px" }}>
            <div style={{ backgroundColor: "#000", padding: "24px", borderRadius: "16px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", fontWeight: "bold" }}>TOTAL REVENUE</p>
                <p style={{ fontSize: "32px", fontWeight: "bold" }}>520 <span style={{ fontSize: "14px", fontWeight: "normal" }}>pt</span></p>
              </div>
              <TrendingUp size={32} color="#4ade80" />
            </div>
            <h3 style={{ fontSize: "11px", color: "#bbb", fontWeight: "bold", marginBottom: "16px" }}>RECENT ECHOES</h3>
            {[
              { date: '2026/03/16', amount: 17, from: '購入者① (4次流通分)', work: 'SUNDANCE' },
              { date: '2026/03/10', amount: 331, from: '購入者② (3次流通分)', work: '悠久のアルカナ' },
              { date: '2026/02/28', amount: 172, from: '購入者① (3次流通分)', work: 'Business Class' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", border: "1px solid #f0f0f0" }}>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 4px" }}>{item.work}</p>
                  <p style={{ fontSize: "10px", color: "#999" }}>{item.from}</p>
                </div>
                <p style={{ fontSize: "15px", fontWeight: "bold", color: "#228be6" }}>+{item.amount} pt</p>
              </div>
            ))}
          </div>
          <BottomNav />
        </main>
      )}
    </>
  );
}
