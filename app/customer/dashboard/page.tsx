"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/language";

export default function CustomerDashboard() {
  const { lang } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
    const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
    setTodayDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, rxRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/prescriptions"),
        ]);
        if (userRes.ok) setUser(await userRes.json());
        if (rxRes.ok) {
          const data = await rxRes.json();
          setPrescriptions(data.slice(0, 3));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const greet = () => {
    const h = new Date().getHours();
    if (lang === "bn") {
      if (h < 12) return "শুভ সকাল 👋";
      if (h < 17) return "শুভ দুপুর 👋";
      if (h < 20) return "শুভ সন্ধ্যা 👋";
      return "শুভ রাত্রি 👋";
    } else {
      if (h < 12) return "Good Morning 👋";
      if (h < 17) return "Good Afternoon 👋";
      if (h < 20) return "Good Evening 👋";
      return "Good Night 👋";
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>💊</div>
        <div style={{ color: "#6b7280", fontSize: 14 }}>Loading...</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>

      {/* ── GREEN HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
        padding: "20px 16px 36px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", right: 40, bottom: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 4 }}>{greet()}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 14 }}>
            {user?.name || user?.email?.split("@")[0] || (lang === "bn" ? "আপনাকে স্বাগতম" : "Welcome")}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 100, padding: "5px 12px", fontSize: 12, color: "white", fontWeight: 600 }}>
            🔥 {lang === "bn" ? "নিয়মিত ওষুধ খেতে থাকুন!" : "Keep taking your medicine!"}
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px", marginTop: -18 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>💊</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{prescriptions.length}</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{lang === "bn" ? "সক্রিয় Prescription" : "Active Prescriptions"}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>🏆</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#16a34a", lineHeight: 1 }}>০</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{lang === "bn" ? "Loyalty Points" : "Loyalty Points"}</div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ padding: "16px 16px 8px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>
        {lang === "bn" ? "দ্রুত কাজ করুন" : "Quick Actions"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, padding: "0 16px" }}>
        {[
          { href: "/customer/prescription", icon: "📋", labelBn: "Prescription", labelEn: "Prescription", bg: "#fffbeb" },
          { href: "/customer/prescription", icon: "📸", labelBn: "Scan করুন", labelEn: "Scan", bg: "#f0fdf4" },
          { href: "/customer/health", icon: "🩺", labelBn: "স্বাস্থ্য", labelEn: "Health", bg: "#fef2f2" },
          { href: "/customer/family", icon: "👨‍👩‍👧", labelBn: "পরিবার", labelEn: "Family", bg: "#f5f3ff" },
        ].map((item, i) => (
          <Link key={i} href={item.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: item.bg, border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              {item.icon}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", textAlign: "center", lineHeight: 1.2 }}>
              {lang === "bn" ? item.labelBn : item.labelEn}
            </div>
          </Link>
        ))}
      </div>

      {/* ── TODAY'S MEDICINES ── */}
      <div style={{ padding: "16px 16px 8px", fontSize: 13, fontWeight: 700, color: "#6b7280", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{lang === "bn" ? "আজকের ওষুধ" : "Today's Medicine"}</span>
        <Link href="/customer/prescription" style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, textDecoration: "none" }}>
          {lang === "bn" ? "সব দেখুন →" : "See all →"}
        </Link>
      </div>

      <div style={{ margin: "0 16px", background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {prescriptions.length === 0 ? (
          <div style={{ padding: "24px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>
              {lang === "bn" ? "কোনো সক্রিয় prescription নেই" : "No active prescriptions"}
            </div>
            <Link href="/customer/prescription" style={{ display: "inline-block", marginTop: 12, padding: "8px 16px", background: "#16a34a", color: "white", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              {lang === "bn" ? "Prescription যোগ করুন" : "Add Prescription"}
            </Link>
          </div>
        ) : (
          prescriptions.map((rx: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: i < prescriptions.length - 1 ? "1px solid #e5e7eb" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: ["#16a34a", "#3b82f6", "#f59e0b"][i % 3], flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    {rx.medicines?.[0]?.medicine?.name || (lang === "bn" ? "ওষুধ" : "Medicine")}
                    {rx.medicines?.length > 1 && <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 4 }}>+{rx.medicines.length - 1}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                    {rx.doctor || (lang === "bn" ? "ডাক্তার অজানা" : "Unknown doctor")}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 100, background: "#dcfce7", color: "#15803d" }}>
                {lang === "bn" ? "সক্রিয়" : "Active"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ── REFILL ALERT ── */}
      <div style={{ padding: "16px 16px 8px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>
        {lang === "bn" ? "Refill সতর্কতা ⚠️" : "Refill Alert ⚠️"}
      </div>
      <div style={{ margin: "0 16px", background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚠️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
            {lang === "bn" ? "Prescription শেষ হওয়ার আগে refill করুন" : "Refill before prescription ends"}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            {lang === "bn" ? "নিয়মিত ওষুধ নিশ্চিত করতে আগে থেকে order করুন" : "Order early to ensure regular medicine"}
          </div>
        </div>
        <Link href="/customer/prescription" style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", textDecoration: "none", whiteSpace: "nowrap" }}>
          {lang === "bn" ? "Order করুন →" : "Order →"}
        </Link>
      </div>

      {/* ── HEALTH TIP ── */}
      <div style={{ padding: "16px 16px 8px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>
        {lang === "bn" ? "আজকের স্বাস্থ্য টিপস" : "Today's Health Tip"}
      </div>
      <div style={{ margin: "0 16px 24px", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0", borderRadius: 14, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>🥗</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>
            {lang === "bn" ? "খাবারের পর ওষুধ খান" : "Take medicine after meals"}
          </div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
            {lang === "bn"
              ? "বেশিরভাগ Antibiotic খাবারের পর খেলে পেটের সমস্যা কমে এবং ওষুধ ভালো কাজ করে।"
              : "Most antibiotics work better and cause less stomach issues when taken after meals."}
          </div>
        </div>
      </div>

    </div>
  );
}