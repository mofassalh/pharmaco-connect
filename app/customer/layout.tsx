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
  const { lang, setLang, t } = useLanguage();

  const handleLangChange = (newLang: "bn" | "en") => {
    setLang(newLang);
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#efefef", fontFamily: "sans-serif" }}>

      {/* Top Nav */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 4, color: "#4a5568" }}>
            ☰
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, background: "#0D9488", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14 }}>💊</div>
            <span style={{ fontWeight: 700, color: "#1a202c", fontSize: 14 }}>Pharmaco Connect</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", background: "#f7fafc", borderRadius: 8, padding: 3, border: "0.5px solid #e2e8f0" }}>
            <button onClick={() => handleLangChange("bn")}
              style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: lang === "bn" ? "#0D9488" : "transparent", color: lang === "bn" ? "#fff" : "#718096", transition: "all 0.15s" }}>
              বাং
            </button>
            <button onClick={() => handleLangChange("en")}
              style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: lang === "en" ? "#0D9488" : "transparent", color: lang === "en" ? "#fff" : "#718096", transition: "all 0.15s" }}>
              EN
            </button>
          </div>
          <Link href="/customer/profile" style={{ width: 30, height: 30, borderRadius: "50%", background: "#E6FFFA", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 14 }}>👤</Link>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 199, top: 52 }} />
      )}

      {/* Sidebar */}
      <div style={{
        position: "fixed", top: 52, left: 0, bottom: 0, width: 240,
        background: "#fff", borderRight: "0.5px solid #e2e8f0",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
        zIndex: 200, overflowY: "auto",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "12px 8px", flex: 1 }}>
          {menuItems.map((item, i) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={i} href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 12px", borderRadius: 10, marginBottom: 3,
                  color: active ? "#0D9488" : "#4a5568",
                  background: active ? "#E6FFFA" : "transparent",
                  textDecoration: "none", fontSize: 14, fontWeight: 500,
                }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{lang === "en" ? item.labelEn : item.labelBn}</span>
              </Link>
            );
          })}
        </div>

        {/* Language in sidebar too */}
        <div style={{ padding: "12px 16px", borderTop: "0.5px solid #e2e8f0" }}>
          <div style={{ fontSize: 11, color: "#a0aec0", marginBottom: 8 }}>
            {"ভাষা / Language"}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => handleLangChange("bn")}
              style={{ flex: 1, padding: "8px", borderRadius: 8, border: "0.5px solid #e2e8f0", cursor: "pointer", fontSize: 12, fontWeight: 600, background: lang === "bn" ? "#0D9488" : "#fff", color: lang === "bn" ? "#fff" : "#4a5568" }}>
              🇧🇩 বাংলা
            </button>
            <button onClick={() => handleLangChange("bn")}
  suppressHydrationWarning
  style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: lang === "bn" ? "#0D9488" : "transparent", color: lang === "bn" ? "#fff" : "#718096" }}>
  বাং
</button>
<button onClick={() => handleLangChange("en")}
  suppressHydrationWarning
  style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: lang === "en" ? "#0D9488" : "transparent", color: lang === "en" ? "#fff" : "#718096" }}>
  EN
            </button>
          </div>
        </div>

        <div style={{ padding: "12px 16px", borderTop: "0.5px solid #e2e8f0" }}>
          <button
            onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}
            style={{ width: "100%", color: "#E53E3E", background: "none", border: "0.5px solid #FEB2B2", padding: "10px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
            {lang === "en" ? "Logout" : "Logout"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ paddingBottom: 70 }}>
        {children}
      </div>

      
    </div>
  );
}