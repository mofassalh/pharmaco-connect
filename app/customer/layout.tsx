"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/language";

const menuItems = [
  { href: "/customer/dashboard", icon: "🏠", labelBn: "Dashboard", labelEn: "Dashboard" },
  { href: "/customer/prescription", icon: "📋", labelBn: "Prescription", labelEn: "Prescription" },
  { href: "/customer/shop", icon: "💊", labelBn: "Medicine কিনুন", labelEn: "Buy Medicine" },
  { href: "/customer/orders", icon: "📦", labelBn: "Orders", labelEn: "Orders" },
  { href: "/customer/profile", icon: "👤", labelBn: "Profile", labelEn: "Profile" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();

  const handleLangChange = (newLang: "bn" | "en") => {
    setLang(newLang);
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa", fontFamily: "sans-serif" }}>

      {/* Top Nav */}
      <div style={{
        background: "#fff", borderBottom: "0.5px solid #e2e8f0",
        padding: "0 20px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Mobile hamburger — only on small screens */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#4a5568", display: "block" }}
            className="mobile-menu-btn">
            ☰
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "#0D9488", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💊</div>
            <span style={{ fontWeight: 700, color: "#1a202c", fontSize: 15 }}>Pharmaco Connect</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", background: "#f7fafc", borderRadius: 8, padding: 3, border: "0.5px solid #e2e8f0" }}>
            <button onClick={() => handleLangChange("bn")}
              style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: lang === "bn" ? "#0D9488" : "transparent", color: lang === "bn" ? "#fff" : "#718096" }}>
              বাং
            </button>
            <button onClick={() => handleLangChange("en")}
              style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: lang === "en" ? "#0D9488" : "transparent", color: lang === "en" ? "#fff" : "#718096" }}>
              EN
            </button>
          </div>
          <Link href="/customer/profile" style={{ width: 32, height: 32, borderRadius: "50%", background: "#E6FFFA", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 16, border: "1px solid #b2f5ea" }}>👤</Link>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>

        {/* Desktop Sidebar — always visible on large screens */}
        <div style={{
          width: 240, background: "#fff", borderRight: "0.5px solid #e2e8f0",
          display: "flex", flexDirection: "column",
          position: "sticky", top: 56, height: "calc(100vh - 56px)",
          overflowY: "auto", flexShrink: 0,
        }} className="desktop-sidebar">
          <div style={{ padding: "16px 10px", flex: 1 }}>
            {menuItems.map((item, i) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={i} href={item.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 14px", borderRadius: 10, marginBottom: 4,
                    color: active ? "#0D9488" : "#4a5568",
                    background: active ? "#E6FFFA" : "transparent",
                    textDecoration: "none", fontSize: 14, fontWeight: 500,
                  }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span>{lang === "en" ? item.labelEn : item.labelBn}</span>
                </Link>
              );
            })}
          </div>
          <div style={{ padding: "14px 16px", borderTop: "0.5px solid #e2e8f0" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button onClick={() => handleLangChange("bn")}
                style={{ flex: 1, padding: "8px", borderRadius: 8, border: "0.5px solid #e2e8f0", cursor: "pointer", fontSize: 12, fontWeight: 600, background: lang === "bn" ? "#0D9488" : "#fff", color: lang === "bn" ? "#fff" : "#4a5568" }}>
                🇧🇩 বাংলা
              </button>
              <button onClick={() => handleLangChange("en")}
                style={{ flex: 1, padding: "8px", borderRadius: 8, border: "0.5px solid #e2e8f0", cursor: "pointer", fontSize: 12, fontWeight: 600, background: lang === "en" ? "#0D9488" : "#fff", color: lang === "en" ? "#fff" : "#4a5568" }}>
                🇬🇧 EN
              </button>
            </div>
            <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}
              style={{ width: "100%", color: "#E53E3E", background: "#fff5f5", border: "0.5px solid #FEB2B2", padding: "10px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 199, top: 56 }}
            className="mobile-overlay" />
        )}

        {/* Mobile Sidebar */}
        <div style={{
          position: "fixed", top: 56, left: 0, bottom: 0, width: 260,
          background: "#fff", borderRight: "0.5px solid #e2e8f0",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          zIndex: 200, overflowY: "auto",
          display: "flex", flexDirection: "column",
          boxShadow: sidebarOpen ? "4px 0 20px rgba(0,0,0,0.08)" : "none",
        }} className="mobile-sidebar">
          <div style={{ padding: "16px 10px", flex: 1 }}>
            {menuItems.map((item, i) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={i} href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 10, marginBottom: 4,
                    color: active ? "#0D9488" : "#4a5568",
                    background: active ? "#E6FFFA" : "transparent",
                    textDecoration: "none", fontSize: 14, fontWeight: 500,
                  }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span>{lang === "en" ? item.labelEn : item.labelBn}</span>
                </Link>
              );
            })}
          </div>
          <div style={{ padding: "14px 16px", borderTop: "0.5px solid #e2e8f0" }}>
            <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}
              style={{ width: "100%", color: "#E53E3E", background: "#fff5f5", border: "0.5px solid #FEB2B2", padding: "10px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "20px", minWidth: 0 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {children}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar { display: none !important; }
          .mobile-overlay { display: none !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}