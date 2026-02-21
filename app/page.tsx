"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Noto Sans JP と Plus Jakarta Sans を Google Fonts から読み込み
const FontAndMetaSettings = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Plus+Jakarta+Sans:wght@700&display=swap');

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

  // --- 共通コンポーネント: 検索バー付きヘッダー ---
  // ① プロフィール画像を検索ウィンドウの外に出し、完全な円形で表示
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
      {/* プロフィール画像: 外に出して正円で表示 */}
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
        <Image src="/profile.jpg" width={36} height={36} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );

  // --- 下部ナビゲーション ---
  // ② アイコンと文字を近づけ、上部の線との距離を離す
  const BottomNav = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", alignItems: "flex-start", padding: "12px 0 20px", zIndex: 100 }}>
      {/* GEMM */}
      <div style={{ textAlign: "center", width: "60px" }}>
        <Image src="/gemm.png" width={24} height={24} alt="GEMM" style={{ display: "block", margin: "0 auto 2px" }} />
        <span className="nav-text" style={{ fontSize: "9px", color: "#333", display: "block" }}>GEMM</span>
      </div>
      {/* MUNE */}
      <div style={{ textAlign: "center", width: "60px" }}>
        <Image src="/mune.png" width={24} height={24} alt="MUNE" style={{ display: "block", margin: "0 auto 2px", opacity: 0.5 }} />
        <span className="nav-text" style={{ fontSize: "9px", color: "#999", display: "block" }}>MUNE</span>
      </div>
      {/* LOOPA */}
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
          <form onSubmit={(e) => { e.preventDefault(); setView("list"); }} style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" placeholder="name" required style={{ padding: "14px 16px", borderRadius: "8px", border: "1px solid #eee", backgroundColor: "#fafafa" }} />
            <input type="password" placeholder="password" required style={{ padding: "14px 16px", borderRadius: "8px", border: "1px solid #eee", backgroundColor: "#fafafa" }} />
            <button type="submit" style={{ marginTop: "16px", padding: "14px", borderRadius: "8px", border: "none", backgroundColor: "#228be6", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>sign in</button>
          </form>
        </main>
      )}

      {/* 2. マイページ (一覧) */}
      {view === "list" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "100px" }}>
          <SearchHeader />
          <div style={{ padding: "20px 24px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#999", marginBottom: "16px" }}></h2>
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

      {/* 3. 詳細画面 */}
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
              {/* 楽曲再生 */}
              <div>
                <p style={{ fontSize: "12px", fontWeight: "bold", color: "#aaa", marginBottom: "8px" }}>🎵 楽曲再生</p>
                <audio controls style={{ width: "100%", outline: "none" }}>
                  <source src="/FamilyMart_Demo.mp3" type="audio/mpeg" />
                </audio>
              </div>

              {/* 特典動画 */}
              <div>
                <p style={{ fontSize: "12px", fontWeight: "bold", color: "#aaa", marginBottom: "8px" }}>🎬 特典動画</p>
                <div style={{ borderRadius: "8px", overflow: "hidden", backgroundColor: "#000" }}>
                  <video controls style={{ width: "100%", display: "block" }}>
                    <source src="/Behind_The_Scenes.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>

              {/* ③ その他特典（画像全体を表示するレイアウトに変更） */}
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* 特典写真 */}
                <div>
                  <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px", color: "#333" }}>特典写真</p>
                  <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                    {/* Tour_Photo.jpg を public フォルダに入れてください */}
                    <Image src="/Tour_Photo.jpg" width={400} height={300} alt="特典写真" style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                </div>

                {/* ライブチケット (QRコード) */}
                <div>
                  <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px", color: "#333" }}>ライブチケット</p>
                  <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    {/* qr_code.png を public フォルダに入れてください */}
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
