"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const menuItems = [
  { href: "/admin/dashboard", icon: "⊞", label: "Dashboard" },
  { href: "/admin/prescriptions", icon: "📋", label: "Prescriptions" },
  { href: "/admin/inventory", icon: "📦", label: "Inventory" },
  { href: "/admin/orders", icon: "🛒", label: "Orders" },
  { href: "/admin/payments", icon: "💳", label: "Payments" },
  { href: "/admin/customers", icon: "👥", label: "Customers" },
  { href: "/admin/reminders", icon: "🔔", label: "Reminders" },
];

export function AdminLayout({ children, title, active }: { children: React.ReactNode; title: string; active: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const Sidebar = () => (
    <div style={{
      width: 220, background: "#ffffff",
      borderRight: "1px solid #e2e8f0",
      display: "flex", flexDirection: "column",
      height: "100%",
    }}>
      <div style={{ padding: "10px 8px", flex: 1 }}>
        {menuItems.map((item, i) => (
          <Link key={i} href={item.href}
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", borderRadius: 9, marginBottom: 2,
              color: item.href === active ? "#0D9488" : "#1a202c",
              background: item.href === active ? "#F0FDF4" : "transparent",
              textDecoration: "none", fontSize: 14, fontWeight: 500,
            }}>
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1a202c" }}>Admin</div>
        <div style={{ fontSize: 11, color: "#718096" }}>admin@pharmaco.com</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "sans-serif" }}>

      {/* Top Nav */}
      <div style={{
        background: "#ffffff", borderBottom: "1px solid #e2e8f0",
        padding: "0 16px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isMobile && (
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 4, color: "#1a202c" }}>
              ☰
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, background: "#0D9488", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14 }}>💊</div>
            <span style={{ fontWeight: 700, color: "#1a202c", fontSize: 14 }}>Pharmaco Connect</span>
            <span style={{ background: "#EDE9FE", color: "#6D28D9", fontSize: 10, padding: "2px 6px", borderRadius: 20, fontWeight: 600 }}>Admin</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/customer/dashboard" style={{ fontSize: 12, color: "#0D9488", textDecoration: "none" }}>
            Customer Portal →
          </Link>
          <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/admin/login"; }}
            style={{ fontSize: 12, color: "#E53E3E", background: "none", border: "1px solid #FEB2B2", padding: "5px 10px", borderRadius: 7, cursor: "pointer", fontWeight: 600 }}>
            Logout
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      {!isMobile ? (
        <div style={{ display: "flex", height: "calc(100vh - 52px)" }}>
          <div style={{ width: 220, flexShrink: 0, height: "calc(100vh - 52px)", position: "sticky", top: 52, overflowY: "auto" }}>
            <Sidebar />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 24, background: "#f7f8fa" }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a202c", marginBottom: 20 }}>{title}</h1>
            {children}
          </div>
        </div>
      ) : (
        <div>
          {mobileOpen && (
            <div onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 199, top: 52 }} />
          )}
          <div style={{
            position: "fixed", top: 52, left: 0, bottom: 0, width: 220,
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.25s ease",
            zIndex: 200, overflowY: "auto", background: "#ffffff",
          }}>
            <Sidebar />
          </div>
          <div style={{ padding: 16, background: "#f7f8fa", minHeight: "calc(100vh - 52px)" }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", marginBottom: 16 }}>{title}</h1>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}