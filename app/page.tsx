"use client";

import { useState } from "react";
import Image from "next/image";

// --- フォント設定 (Noto Sans JP, Plus Jakarta Sans) ---
const FontSettings = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Plus+Jakarta+Sans:wght@700&display=swap');

    body {
      font-family: 'Noto Sans JP', sans-serif;
      margin: 0;
      -webkit-font-smoothing: antialiased;
      color: #1f2937;
    }

    .nav-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
  `}</style>
);

type ViewState = "login" | "list" | "details";

// コンテンツデータ
const contents = [
  { id: 1, title: "Netherwalk", artist: "YOICHI HAGIWARA", serial: "1456", image: "/jacket.jpg" },
  { id: 2, title: "悠久のアルカナ", artist: "久牧彰", serial: "3122", image: "/jacket2.jpg" },
  { id: 3, title: "SUNDANCE PLOP", artist: "PLOP", serial: "457", image: "/jacket3.jpg" },
];

export default function Home() {
  const [view, setView] = useState<ViewState>("login");
  const [selected, setSelected] = useState(contents[0]);

  // --- 【修正3, 4】 共通コンポーネント: 下部ナビゲーション ---
  const BottomNav = () => {
    // ナビゲーションアイテムのコンポーネント（選択時のスタイル適用）
    const NavItem = ({ name, iconSrc, isActive }: { name: string; iconSrc: string; isActive: boolean }) => (
      <div
        style={{
          textAlign: "center",
          cursor: "pointer",
          // 【修正4】選択中のアイコンの裏にグレーを敷く＆角丸
          backgroundColor: isActive ? "#f3f4f6" : "transparent",
          padding: isActive ? "8px 20px" : "8px",
          borderRadius: "24px",
          transition: "all 0.2s ease",
        }}
      >
        {/* 【修正3】アイコンと文字の位置を近づける (margin-bottomを2pxに縮小) */}
        <Image src={iconSrc} width={24} height={24} alt={name} style={{ display: "block", margin: "0 auto 2px" }} />
        <span className="nav-text" style={{ fontSize: "10px", color: isActive ? "#1f2937" : "#9ca3af" }}>{name}</span>
      </div>
    );

    return (
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "90px", backgroundColor: "#fff", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-evenly", alignItems: "center", paddingBottom: "15px", zIndex: 100 }}>
        {/* 今回はデザイン案に合わせて左端のGEMMをアクティブ状態(isActive=true)として表示 */}
        <NavItem name="GEMM" iconSrc="/gemm.png" isActive={true} />
        <NavItem name="MUNE" iconSrc="/mune.png" isActive={false} />
        <NavItem name="LOOPA" iconSrc="/loopa.png" isActive={false} />
      </div>
    );
  };

  // --- 【修正2】 共通コンポーネント: ヘッダー（検索ウィンドウ追加） ---
  const Header = () => (
    <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", gap: "16px", backgroundColor: "#fff" }}>
      {/* ダミーの検索ウィンドウ */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: "12px", padding: "12px 16px" }}>
        {/* 虫眼鏡アイコン（簡易的に文字で代用。画像に差し替え可能） */}
        <span style={{ color: "#9ca3af", marginRight: "8px", fontSize: "14px" }}>🔍</span>
        <input
          type="text"
          placeholder="Search..." // デザイン案に合わせてプレースホルダーを設定
          readOnly // ダミーなので入力不可に設定
          style={{ border: "none", background: "transparent", outline: "none", fontSize: "14px", width: "100%", fontFamily: "'Noto Sans JP', sans-serif", color: "#1f2937" }}
        />
      </div>
      {/* プロフィールアイコン（右端に配置） */}
      <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "1px solid #eee", flexShrink: 0 }}>
        <Image src="/profile.jpg" width={40} height={40} alt="User" style={{ objectFit: "cover" }} />
      </div>
    </div>
  );

  return (
    <>
      <FontSettings />

      {/* 1. ログイン画面 (TOP) */}
      {view === "login" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <div style={{ marginBottom: "60px" }}>
            {/* 【修正1】 ロゴサイズを大きく (元の1.2倍程度: 180x60 -> 216x72 に変更) */}
            <Image src="/logo.png" width={216} height={72} alt="VENU." priority style={{ height: "auto" }} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setView("list"); }} style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" placeholder="name" style={{ padding: "14px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", backgroundColor: "#f9fafb" }} />
            <input type="password" placeholder="password" style={{ padding: "14px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", backgroundColor: "#f9fafb" }} />
            <button type="submit" style={{ marginTop: "12px", padding: "14px", borderRadius: "8px", border: "none", backgroundColor: "#3b82f6", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: "background-color 0.2s" }}>sign in</button>
          </form>
        </main>
      )}

      {/* 2. マイページ (一覧画面) */}
      {view === "list" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "110px" }}>
          <Header />
          <div style={{ padding: "10px 24px" }}>
            {contents.map((item) => (
              <div key={item.id} onClick={() => { setSelected(item); setView("details"); }} style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", cursor: "pointer" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", flexShrink: 0 }}>
                  <Image src={item.image} width={72} height={72} alt={item.title} style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "15px", marginBottom: "4px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "#4b5563", marginBottom: "2px" }}>{item.artist}</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>Serial: {item.serial}</div>
                </div>
              </div>
            ))}
          </div>
          <BottomNav />
        </main>
      )}

      {/* 3. 詳細画面 */}
      {view === "details" && (
        <main style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "110px" }}>
          <Header />
          <div style={{ padding: "0 24px 40px", textAlign: "center" }}>
            <div style={{ textAlign: "left", marginBottom: "10px" }}>
              <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: "#9ca3af", fontSize: "14px", cursor: "pointer", padding: "8px 0" }}>← Back</button>
            </div>

            <div style={{ width: "100%", maxWidth: "300px", margin: "0 auto 24px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
              <Image src={selected.image} width={300} height={300} alt={selected.title} style={{ width: "100%", height: "auto" }} />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "8px" }}>{selected.title}</h2>
              <p style={{ fontSize: "15px", color: "#4b5563", marginBottom: "4px" }}>{selected.artist}</p>
              <p style={{ fontSize: "12px", color: "#9ca3af" }}>Serial: {selected.serial}</p>
            </div>

            {/* 音源プレーヤー */}
            <div style={{ marginBottom: "48px" }}>
              <audio controls style={{ width: "100%", maxWidth: "320px", borderRadius: "8px" }}>
                <source src="/FamilyMart_Demo.mp3" type="audio/mpeg" />
              </audio>
            </div>

            {/* 【修正5】 追加コンテンツエリア (動画、写真、QR) */}
            <div style={{ textAlign: "left", maxWidth: "320px", margin: "0 auto" }}>

              {/* 特典映像 */}
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "12px", color: "#1f2937" }}>特典映像：Behind The Scenes</h3>
                <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                  <video controls style={{ width: "100%", display: "block", backgroundColor: "#000" }}>
                    <source src="/Behind_The_Scenes.mp4" type="video/mp4" />
                  </video>
                </div>
                <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "8px" }}>※映像が入る</p>
              </div>

              {/* 特典写真 */}
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "12px", color: "#1f2937" }}>特典写真：Barで撮った写真</h3>
                <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                  {/* ↓↓↓ 画像ファイルを用意して public フォルダに入れてください ↓↓↓ */}
                  <Image src="/bar_photo.jpg" width={320} height={213} alt="Bar Photo" style={{ width: "100%", height: "auto", display: "block", backgroundColor: "#f3f4f6" }} />
                  {/* ↑↑↑ 仮のファイル名 bar_photo.jpg を指定しています ↑↑↑ */}
                </div>
                <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "8px" }}>※写真が入る</p>
              </div>

              {/* ライブチケットQR */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "12px", color: "#1f2937" }}>ライブチケット</h3>
                <div style={{ display: "flex", justifyContent: "center", padding: "24px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                  {/* ↓↓↓ QR画像ファイルを用意して public フォルダに入れてください ↓↓↓ */}
                  <Image src="/ticket_qr.png" width={140} height={140} alt="Ticket QR" style={{ display: "block" }} />
                   {/* ↑↑↑ 仮のファイル名 ticket_qr.png を指定しています ↑↑↑ */}
                </div>
                <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "8px" }}>※QR画像が入る</p>
              </div>

            </div>
          </div>
          <BottomNav />
        </main>
      )}
    </>
  );
}
