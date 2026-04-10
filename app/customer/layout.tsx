"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/language";


 const menuItems = [
  { href: "/customer/dashboard", icon: "🏠", labelBn: "হোম", labelEn: "Home" },
  { href: "/customer/prescription", icon: "📋", labelBn: "Prescription", labelEn: "Prescription" },
  { href: "/customer/health", icon: "🩺", labelBn: "স্বাস্থ্য", labelEn: "Health" },
  { href: "/customer/shop", icon: "💊", labelBn: "Medicine", labelEn: "Medicine" },
  { href: "/customer/profile", icon: "👤", labelBn: "Profile", labelEn: "Profile" },
];

const sidebarItems = [
  { href: "/customer/dashboard", icon: "🏠", labelBn: "হোম", labelEn: "Home" },
  { href: "/customer/prescription", icon: "📋", labelBn: "Prescription", labelEn: "Prescription" },
  { href: "/customer/health", icon: "🩺", labelBn: "স্বাস্থ্য", labelEn: "Health" },
  { href: "/customer/shop", icon: "💊", labelBn: "Medicine কিনুন", labelEn: "Buy Medicine" },
  { href: "/customer/orders", icon: "📦", labelBn: "Orders", labelEn: "Orders" },
  { href: "/customer/profile", icon: "👤", labelBn: "Profile", labelEn: "Profile" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLangChange = (newLang: "bn" | "en") => {
    setLang(newLang);
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "sans-serif" }}>

      {/* ── DESKTOP TOP NAV ── */}
      <div className="desktop-topbar" style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 20px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <Link href="/customer/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "#16a34a", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💊</div>
          <span style={{ fontWeight: 700, color: "#111827", fontSize: 15 }}>Pharmaco Connect</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 8, padding: 3, border: "1px solid #e5e7eb" }}>
            <button onClick={() => handleLangChange("bn")} style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: lang === "bn" ? "#16a34a" : "transparent", color: lang === "bn" ? "#fff" : "#6b7280" }}>বাং</button>
            <button onClick={() => handleLangChange("en")} style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: lang === "en" ? "#16a34a" : "transparent", color: lang === "en" ? "#fff" : "#6b7280" }}>EN</button>
          </div>
          <Link href="/customer/profile" style={{ width: 34, height: 34, borderRadius: "50%", background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 16 }}>👤</Link>
        </div>
      </div>

      {/* ── MOBILE TOP BAR ── */}
      <div className="mobile-topbar" style={{
        background: "#16a34a",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, background: "rgba(255,255,255,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💊</div>
          <span style={{ fontWeight: 700, color: "white", fontSize: 15 }}>Pharmaco Connect</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: 3 }}>
            <button onClick={() => handleLangChange("bn")} style={{ padding: "3px 8px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, background: lang === "bn" ? "rgba(255,255,255,0.3)" : "transparent", color: "white" }}>বাং</button>
            <button onClick={() => handleLangChange("en")} style={{ padding: "3px 8px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, background: lang === "en" ? "rgba(255,255,255,0.3)" : "transparent", color: "white" }}>EN</button>
          </div>
          <Link href="/customer/profile" style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 15 }}>👤</Link>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>

        {/* ── DESKTOP SIDEBAR ── */}
        <div className="desktop-sidebar" style={{
          width: 240,
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 56,
          height: "calc(100vh - 56px)",
          overflowY: "auto",
          flexShrink: 0,
        }}>
          <div style={{ padding: "12px 10px", flex: 1 }}>
            {sidebarItems.map((item, i) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={i} href={item.href} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10, marginBottom: 4,
                  color: active ? "#16a34a" : "#4a5568",
                  background: active ? "#f0fdf4" : "transparent",
                  textDecoration: "none", fontSize: 14, fontWeight: active ? 700 : 500,
                  borderLeft: active ? "3px solid #16a34a" : "3px solid transparent",
                }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span>{lang === "en" ? item.labelEn : item.labelBn}</span>
                </Link>
              );
            })}
          </div>
          <div style={{ padding: "14px 16px", borderTop: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <button onClick={() => handleLangChange("bn")} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #e5e7eb", cursor: "pointer", fontSize: 12, fontWeight: 600, background: lang === "bn" ? "#16a34a" : "#fff", color: lang === "bn" ? "#fff" : "#4a5568" }}>🇧🇩 বাংলা</button>
              <button onClick={() => handleLangChange("en")} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #e5e7eb", cursor: "pointer", fontSize: 12, fontWeight: 600, background: lang === "en" ? "#16a34a" : "#fff", color: lang === "en" ? "#fff" : "#4a5568" }}>🇬🇧 EN</button>
            </div>
            <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}
              style={{ width: "100%", color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
<div style={{ flex: 1, minWidth: 0 }}>
  {children}
</div>

        
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="mobile-bottomnav" style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 100,
        background: "#fff",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        padding: "8px 4px 20px",
        gap: 2,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
      }}>
        {menuItems.map((item, i) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={i} href={item.href} style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "6px 2px",
              borderRadius: 10,
              textDecoration: "none",
              background: active ? "#f0fdf4" : "transparent",
            }}>
              <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: active ? "#16a34a" : "#6b7280" }}>
                {lang === "en" ? item.labelEn : item.labelBn}
              </span>
            </Link>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-topbar { display: none !important; }
          .desktop-sidebar { display: none !important; }
          .desktop-content { display: none !important; }
          .mobile-topbar { display: flex !important; }
          .mobile-content { display: block !important; }
          .mobile-bottomnav { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-topbar { display: none !important; }
          .mobile-content { display: none !important; }
          .mobile-bottomnav { display: none !important; }
          .desktop-topbar { display: flex !important; }
          .desktop-sidebar { display: flex !important; }
          .desktop-content { display: block !important; }
        }
      `}</style>
    </div>
  );
}