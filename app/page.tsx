"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// フォントとグローバル設定
const GlobalSettings = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Plus+Jakarta+Sans:wght@700&display=swap');

    body {
      font-family: 'Noto Sans JP', sans-serif;
      margin: 0;
      color: #1a1a1a;
      -webkit-font-smoothing: antialiased;
    }

    .nav-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    input {
      font-size: 16px !important; /* iOSのズーム防止 */
    }
  `}</style>
);

type ViewState = "login" | "list" | "details";

const contents = [
  { id: 1, title: "Netherwalk", artist: "YOICHI HAGIWARA", serial: "1456", image: "/jacket.jpg" },
  { id: 2, title: "悠久のアルカナ", artist: "久牧彰", serial: "3122", image: "/jacket2.jpg" },
  { id: 3, title: "SUNDANCE PLOP", artist: "PLOP", serial: "457", image: "/jacket3.jpg" },
];

export default function Home() {
  const [view, setView] = useState<ViewState>("login");
  const [selected, setSelected] = useState(contents[0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // --- 共通コンポーネント: 上部検索バー ---
  const SearchHeader = () => (
    <div style={{ padding: "20px 20px 10px", backgroundColor: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f3f4f6", padding: "8px 16px", borderRadius: "25px" }}>
        <span style={{ color: "#999" }}>🔍</span>
        <input
          type="text"
          placeholder="Search in Contents"
          style={{ border: "none", backgroundColor: "transparent", width: "100%", outline: "none", color: "#666" }}
        />
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold" }}>
          Y
        </div>
      </div>
    </div>
  );

  // --- 共通コンポーネント: 下部ナビゲーション ---
  const BottomNav = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "85px", backgroundColor: "#fff", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: "15px", zIndex: 100 }}>
      {/* GEMM (選択状態) */}
      <div style={{ textAlign: "center", backgroundColor: "#f3f4f6", padding: "8px 20px", borderRadius: "25px", minWidth: "80px" }}>
        <Image src="/gemm.png" width={22} height={22} alt="GEMM" style={{ display: "block", margin: "0 auto 4px" }} />
        <span className="nav-text" style={{ fontSize: "10px", color: "#000" }}>GEMM</span>
      </div>

      <div style={{ textAlign: "center", minWidth: "80px" }}>
        <Image src="/mune.png" width={22} height={22} alt="MUNE" style={{ display: "block", margin: "0 auto 4px", opacity: 0.6 }} />
        <span className="nav-text" style={{ fontSize: "10px", color: "#999" }}>MUNE</span>
      </div>

      <div style={{ textAlign: "center", minWidth: "80px" }}>
        <Image src="/loopa.png" width={22} height={22} alt="LOOPA" style={{ display: "block", margin: "0 auto 4px", opacity: 0.6 }} />
        <span className="nav-text" style={{ fontSize: "10px", color: "#999" }}>LOOPA</span>
      </div>
    </div>
  );

  return (
    <>
      <GlobalSettings />

      {/* 1. ログイン画面 */}
      {view === "login" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <div style={{ marginBottom: "60px" }}>
            {/* ロゴのファイル名を、実際にアップロードされていた名前に合わせています */}
            <Image src="/VENU_.logo.png" width={200} height={70} alt="VENU." style={{ objectFit: "contain" }} priority />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setView("list"); }} style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <input type="text" placeholder="name" required style={{ padding: "14px 18px", borderRadius: "10px", border: "1px solid #e0e0e0", outline: "none" }} />
            <input type="password" placeholder="password" required style={{ padding: "14px 18px", borderRadius: "10px", border: "1px solid #e0e0e0", outline: "none" }} />
            <button type="submit" style={{ marginTop: "8px", padding: "14px", borderRadius: "10px", border: "none", backgroundColor: "#228be6", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>sign in</button>
          </form>
        </main>
      )}

      {/* 2. マイページ (一覧) */}
      {view === "list" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "100px" }}>
          <SearchHeader />
          <div style={{ padding: "10px 24px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#666", marginBottom: "20px" }}>Suggested</h2>
            {contents.map((item) => (
              <div key={item.id} onClick={() => { setSelected(item); setView("details"); }} style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", cursor: "pointer" }}>
                <div style={{ width: "70px", height: "70px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                  <Image src={item.image} width={70} height={70} alt={item.title} style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "15px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "#1a1a1a", marginTop: "2px" }}>{item.artist}</div>
                  <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>Serial: {item.serial}</div>
                </div>
              </div>
            ))}
          </div>
          <BottomNav />
        </main>
      )}

      {/* 3. 詳細画面 */}
      {view === "details" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "100px" }}>
          <SearchHeader />
          <div style={{ padding: "0 24px" }}>
            <button onClick={() => setView("list")} style={{ margin: "10px 0 20px", background: "none", border: "none", color: "#aaa", fontSize: "14px", cursor: "pointer" }}>← Back</button>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "100%", maxWidth: "340px", margin: "0 auto", borderRadius: "12px", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}>
                <Image src={selected.image} width={340} height={340} alt={selected.title} style={{ width: "100%", height: "auto" }} />
              </div>
              <div style={{ marginTop: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "4px" }}>{selected.title}</h2>
                <p style={{ fontSize: "14px", color: "#333", marginBottom: "4px" }}>{selected.artist}</p>
                <p style={{ fontSize: "12px", color: "#bbb" }}>Serial: {selected.serial}</p>
              </div>
              <div style={{ marginTop: "32px" }}>
                <audio controls style={{ width: "100%", maxWidth: "340px" }}>
                  <source src="/FamilyMart_Demo.mp3" type="audio/mpeg" />
                </audio>
              </div>
            </div>
          </div>
          <BottomNav />
        </main>
      )}
    </>
  );
}
