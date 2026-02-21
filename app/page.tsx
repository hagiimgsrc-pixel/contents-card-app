"use client"; // ボタンなどの動きを付けるために必要です

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  // ログイン状態を管理する変数 (false: 未ログイン, true: ログイン済み)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ログイン処理（何を入力しても通す設定）
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  // --- 1. ログイン画面 ---
  if (!isLoggedIn) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" }}>
        <div style={{ padding: "40px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "100%", maxWidth: "360px", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "24px", color: "#333" }}>CONTENTS CARD</h1>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="text"
              placeholder="name"
              required
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
            />
            <input
              type="password"
              placeholder="password"
              required
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
            />
            <button
              type="submit"
              style={{ padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#0070f3", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
            >
              サインイン
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- 2. マイページ（ログイン後） ---
  return (
    <main style={{ minHeight: "100vh", padding: "24px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" }}>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "420px", backgroundColor: "#ffffff", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", fontFamily: "sans-serif" }}>

        {/* タイトルを 2026 Journey に変更 */}
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "24px", color: "#1f2937" }}>
          2026 Journey
        </h1>

        <div style={{ marginBottom: "24px" }}>
          <Image
            src="/jacket.jpg"
            alt="Jacket Cover"
            width={400}
            height={300}
            style={{ width: "100%", height: "auto", borderRadius: "12px", objectFit: "cover" }}
            priority
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#6b7280" }}>🎵 デモ音源</p>
          <audio controls style={{ width: "100%" }}>
            <source src="/FamilyMart_Demo.mp3" type="audio/mpeg" />
          </audio>
        </div>

        <div>
          <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#6b7280" }}>🎬 メイキング映像</p>
          <video controls style={{ width: "100%", borderRadius: "12px", backgroundColor: "#000" }}>
            <source src="/Behind_The_Scenes.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </main>
  );
}
