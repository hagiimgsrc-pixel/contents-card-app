"use client";

import { useState } from "react";
import Image from "next/image";

type ViewState = "login" | "list" | "details";

export default function Home() {
  const [view, setView] = useState<ViewState>("login");
  const [selectedTitle, setSelectedTitle] = useState("2026 Journey");

  // 1. ログイン処理
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setView("list");
  };

  // フォルダのリスト
  const folders = [
    "2026 Journey",
    "Project 2025",
    "Event 2024"
  ];

  // --- フォルダ一覧画面 ---
  const ListScreen = () => (
    <div style={{ padding: "40px", textAlign: "center", width: "100%", maxWidth: "400px" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "32px", color: "#333" }}>マイページ</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {folders.map((folder) => (
          <div
            key={folder}
            onClick={() => {
              setSelectedTitle(folder); // クリックしたフォルダ名をタイトルに設定
              setView("details");
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "16px 20px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              border: "1px solid #eee",
              gap: "12px",
              transition: "transform 0.1s"
            }}
          >
            <span style={{ fontSize: "2rem" }}>📁</span>
            <span style={{ fontWeight: "bold", color: "#4b5563" }}>{folder}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // --- 詳細画面（中身は共通） ---
  const DetailsScreen = () => (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "420px", backgroundColor: "#ffffff", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", fontFamily: "sans-serif" }}>
      <button
        onClick={() => setView("list")}
        style={{ marginBottom: "16px", background: "none", border: "none", color: "#0070f3", cursor: "pointer", fontSize: "0.9rem" }}
      >
        ← 戻る
      </button>

      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "24px", color: "#1f2937" }}>
        {selectedTitle}
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
  );

  return (
    <main style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" }}>
      {view === "login" && (
        <div style={{ padding: "40px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "100%", maxWidth: "360px", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "24px", color: "#333" }}>CONTENTS CARD</h1>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input type="text" placeholder="name" required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} />
            <input type="password" placeholder="password" required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} />
            <button type="submit" style={{ padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#0070f3", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
              サインイン
            </button>
          </form>
        </div>
      )}
      {view === "list" && <ListScreen />}
      {view === "details" && <DetailsScreen />}
    </main>
  );
}
