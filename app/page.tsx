// app/page.tsx または src/app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", padding: "24px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb" }}>
      <div style={{
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "24px",
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        fontFamily: "sans-serif"
      }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "24px", color: "#111827" }}>
          コンテンツカード
        </h1>

        {/* 1. 画像の表示 (jacket.jpg) */}
        <div style={{ marginBottom: "24px" }}>
          <Image
            src="/jacket.jpg"
            alt="Jacket Cover"
            width={400}
            height={300}
            style={{ width: "100%", height: "auto", borderRadius: "8px", objectFit: "cover" }}
            priority // 優先的に読み込む設定
          />
        </div>

        {/* 2. 音声の再生 (FamilyMart_Demo.mp3) */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#4b5563", fontWeight: "bold" }}>
            🎵 FamilyMart Demo
          </p>
          <audio controls style={{ width: "100%" }}>
            <source src="/FamilyMart_Demo.mp3" type="audio/mpeg" />
            お使いのブラウザは音声再生をサポートしていません。
          </audio>
        </div>

        {/* 3. 動画の再生 (Behind_The_Scenes.mp4) */}
        <div>
          <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#4b5563", fontWeight: "bold" }}>
            🎬 Behind The Scenes
          </p>
          <video controls style={{ width: "100%", borderRadius: "8px", backgroundColor: "#000" }}>
            <source src="/Behind_The_Scenes.mp4" type="video/mp4" />
            お使いのブラウザは動画再生をサポートしていません。
          </video>
        </div>
      </div>
    </main>
  );
}
