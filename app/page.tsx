"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
// アイコンライブラリを追加（lucide-react）
import { User, Settings, HelpCircle, Activity, ChevronRight, ArrowLeft, TrendingUp } from "lucide-react";

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

// Viewの型に profile と echoes を追加
type ViewState = "login" | "loading" | "list" | "details" | "profile" | "echoes";

const contents = [
  { id: 1, title: "Business Class", artist: "DARIO", serial: "1456", image: "/jacket.jpg" },
  { id: 2, title: "悠久のアルカナ", artist: "久牧彰", serial: "3122", image: "/jacket2.jpg" },
  { id: 3, title: "SUNDANCE", artist: "PLOP", serial: "457", image: "/jacket3.jpg" },
];

// --- ローディング画面コンポーネント (変更なし) ---
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
    // ... (既存のLoadingScreenの中身)
    // ※長くなるため、お手元の既存コードをそのままここに入れてください。
    return <div onClick={onComplete}>Loading... (Click to Skip)</div>; 
};

export default function Home() {
  const [view, setView] = useState<ViewState>("login");
  const [selected, setSelected] = useState(contents[0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // --- 検索バー付きヘッダー (プロフィール遷移を追加) ---
  const SearchHeader = () => (
    <div style={{ padding: "16px 24px", backgroundColor: "#fff", display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid #f0f0f0" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f3f4f6", padding: "10px 16px", borderRadius: "25px" }}>
        <span style={{ color: "#999", fontSize: "14px" }}>🔍</span>
        <input
          type="text"
          placeholder="Search in Contents"
          style={{ border: "none", backgroundColor: "transparent", width: "100%", outline: "none", color: "#333", fontSize: "14px" }}
        />
      </div>
      {/* 写真をクリックしてプロフィールへ移動 */}
      <div 
        onClick={() => setView("profile")}
        style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, cursor: "pointer", border: "2px solid #eee" }}
      >
        <Image src="/profile.jpg" width={36} height={36} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );

  // --- 下部ナビゲーション ---
  const BottomNav = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", alignItems: "flex-start", padding: "12px 0 20px", zIndex: 100 }}>
      <div onClick={() => setView("list")} style={{ textAlign: "center", width: "60px", cursor: "pointer" }}>
        <Image src="/gemm.png" width={24} height={24} alt="GEMM" style={{ display: "block", margin: "0 auto 2px", opacity: view === "list" ? 1 : 0.5 }} />
        <span className="nav-text" style={{ fontSize: "9px", color: view === "list" ? "#333" : "#999", display: "block" }}>GEMM</span>
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

      {/* 2. ローディング画面 */}
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
                <div style={{ width: "64px", height: "64px", borderRadius:
