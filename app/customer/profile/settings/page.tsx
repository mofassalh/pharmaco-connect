"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../context/language";

export default function SettingsPage() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const [notif, setNotif] = useState(true);

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: 32 }}>

      {/* Sub Header */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 48, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 56, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#a0aec0" }}>←</button>
        <span style={{ fontWeight: 700, color: "#1a202c", fontSize: 15 }}>⚙️ Settings</span>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>

        {/* Language */}
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 16, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c", marginBottom: 14 }}>🌐 ভাষা / Language</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setLang("bn"); window.location.reload(); }}
              style={{ flex: 1, padding: "12px", borderRadius: 10, border: lang === "bn" ? "2px solid #0D9488" : "0.5px solid #e2e8f0", background: lang === "bn" ? "#E6FFFA" : "#fff", color: lang === "bn" ? "#0D9488" : "#4a5568", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              🇧🇩 বাংলা
            </button>
            <button onClick={() => { setLang("en"); window.location.reload(); }}
              style={{ flex: 1, padding: "12px", borderRadius: 10, border: lang === "en" ? "2px solid #0D9488" : "0.5px solid #e2e8f0", background: lang === "en" ? "#E6FFFA" : "#fff", color: lang === "en" ? "#0D9488" : "#4a5568", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              🇬🇧 English
            </button>
          </div>
          <p style={{ fontSize: 12, color: "#0D9488", textAlign: "center", marginTop: 10 }}>
            {lang === "bn" ? "✓ বাংলা selected" : "✓ English selected"}
          </p>
        </div>

        {/* Notification */}
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 16, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>🔔 Notification</div>
            <div style={{ fontSize: 12, color: "#a0aec0", marginTop: 2 }}>Call ও SMS reminder</div>
          </div>
          <button onClick={() => setNotif(!notif)}
            style={{ width: 48, height: 26, borderRadius: 13, background: notif ? "#0D9488" : "#e2e8f0", border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
            <div style={{ width: 20, height: 20, background: "#fff", borderRadius: "50%", position: "absolute", top: 3, left: notif ? 24 : 4, transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </button>
        </div>

        {/* Menu */}
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", overflow: "hidden", marginBottom: 12 }}>
          {[
            { icon: "🔒", label: "Password পরিবর্তন", sub: "Security" },
            { icon: "💬", label: "Help & Support", sub: "সমস্যা জানান" },
            { icon: "📄", label: "Privacy Policy", sub: "আমাদের নীতিমালা" },
          ].map((item, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i < arr.length - 1 ? "0.5px solid #f7fafc" : "none", cursor: "pointer" }}>
              <span style={{ fontSize: 22, width: 36, textAlign: "center" }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#a0aec0", marginTop: 1 }}>{item.sub}</div>
              </div>
              <span style={{ color: "#cbd5e0", fontSize: 16 }}>›</span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}
          style={{ width: "100%", color: "#E53E3E", background: "#fff5f5", border: "0.5px solid #FEB2B2", padding: "12px", borderRadius: 12, fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}