"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Noto Sans JP と Plus Jakarta Sans を Google Fonts から読み込み
// 同時に、iOSの自動ズームを防ぐメタ設定を疑似的に適用
const FontAndMetaSettings = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Plus+Jakarta+Sans:wght@700&display=swap');

    body {
      font-family: 'Noto Sans JP', sans-serif;
      margin: 0;
      -webkit-font-smoothing: antialiased;
      /* 入力時のズームを防ぐための設定 */
      touch-action: manipulation;
    }

    .nav-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    /* iOSで入力欄がズームされないよう16pxを保証 */
    input {
      font-size: 16px !important;
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

  // 画面遷移時にスクロール位置を一番上に戻し、ズームの影響をリセットする
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // --- 下部ナビゲーション ---
  const BottomNav = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "85px", backgroundColor: "#fff", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: "15px", zIndex: 100 }}>
      <div style={{ textAlign: "center" }}>
        <Image src="/gemm.png" width={24} height={24} alt="GEMM" style={{ display: "block", margin: "0 auto 6px" }} />
        <span className="nav-text" style={{ fontSize: "10px" }}>GEMM</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <Image src="/mune.png" width={24} height={24} alt="MUNE" style={{ display: "block", margin: "0 auto 6px" }} />
        <span className="nav-text" style={{ fontSize: "10px" }}>MUNE</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <Image src="/loopa.png" width={24} height={24} alt="LOOPA" style={{ display: "block", margin: "0 auto 6px" }} />
        <span className="nav-text" style={{ fontSize: "10px" }}>LOOPA</span>
      </div>
    </div>
  );

  // --- ヘッダー ---
  const Header = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "1px solid #eee" }}>
        <Image src="/profile.jpg" width={40} height={40} alt="User" />
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
            <Image src="/VENU_.logo.png" width={180} height={60} alt="VENU." priority />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setView("list"); }} style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" placeholder="name" required style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #ccc" }} />
            <input type="password" placeholder="password" required style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #ccc" }} />
            <button type="submit" style={{ marginTop: "12px", padding: "14px", borderRadius: "8px", border: "none", backgroundColor: "#0088cc", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>sign in</button>
          </form>
        </main>
      )}

      {/* 2. マイページ */}
      {view === "list" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "100px" }}>
          <Header />
          <div style={{ padding: "0 24px" }}>
            {contents.map((item) => (
              <div key={item.id} onClick={() => { setSelected(item); setView("details"); }} style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", cursor: "pointer" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "4px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <Image src={item.image} width={80} height={80} alt={item.title} />
                </div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "16px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "#333", marginTop: "2px" }}>{item.artist}</div>
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>Serial: {item.serial}</div>
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
          <Header />
          <div style={{ padding: "0 24px", textAlign: "center" }}>
            <button onClick={() => setView("list")} style={{ display: "block", marginBottom: "20px", background: "none", border: "none", color: "#999", fontSize: "14px", cursor: "pointer" }}>← Back</button>
            <div style={{ width: "100%", maxWidth: "320px", margin: "0 auto", borderRadius: "8px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
              <Image src={selected.image} width={320} height={320} alt={selected.title} style={{ width: "100%", height: "auto" }} />
            </div>
            <div style={{ marginTop: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "4px" }}>{selected.title}</h2>
              <p style={{ fontSize: "14px", color: "#333", marginBottom: "4px" }}>{selected.artist}</p>
              <p style={{ fontSize: "12px", color: "#999" }}>Serial: {selected.serial}</p>
            </div>
            <div style={{ marginTop: "32px" }}>
              <audio controls style={{ width: "100%", maxWidth: "320px" }}>
                <source src="/FamilyMart_Demo.mp3" type="audio/mpeg" />
              </audio>
            </div>
          </div>
          <BottomNav />
        </main>
      )}
    </>
  );
}
