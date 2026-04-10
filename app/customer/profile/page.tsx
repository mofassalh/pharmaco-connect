"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/language";

export default function ProfilePage() {
  const { lang } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", area: "", city: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setCustomer(data.customer);
          setForm({
            fullName: data.customer?.fullName || data.name || "",
            phone: data.phone || "",
            address: data.customer?.address || "",
            area: data.customer?.area || "",
            city: data.customer?.city || "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>💊</div>
        <div style={{ color: "#6b7280", fontSize: 14 }}>Loading...</div>
      </div>
    </div>
  );

  const menuItems = [
    { href: "/customer/family", icon: "👨‍👩‍👧", labelBn: "পরিবার", labelEn: "Family", sub: lang === "bn" ? "পরিবারের সদস্যদের manage করুন" : "Manage family members", bg: "#f5f3ff", color: "#8b5cf6" },
    { href: "/customer/orders", icon: "📦", labelBn: "আমার Orders", labelEn: "My Orders", sub: lang === "bn" ? "সব order-এর ইতিহাস দেখুন" : "View all order history", bg: "#eff6ff", color: "#3b82f6" },
    { href: "/customer/prescription", icon: "📋", labelBn: "Prescription", labelEn: "Prescriptions", sub: lang === "bn" ? "সব prescription দেখুন" : "View all prescriptions", bg: "#f0fdf4", color: "#16a34a" },
    { href: "/customer/shop", icon: "💊", labelBn: "Medicine কিনুন", labelEn: "Buy Medicine", sub: lang === "bn" ? "Medicine shop-এ যান" : "Go to medicine shop", bg: "#fffbeb", color: "#f59e0b" },
  ];

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>

      {/* ══════════════ MOBILE ══════════════ */}
      <div className="profile-mobile">

        {/* Green Header */}
        <div style={{
          background: "linear-gradient(135deg, #16a34a, #15803d)",
          padding: "24px 16px 36px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", right: -30, top: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />

          {/* Edit button top right */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, position: "relative", zIndex: 1 }}>
            <button
              onClick={() => setEditing(!editing)}
              style={{ padding: "6px 14px", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif" }}
            >
              {editing ? (lang === "bn" ? "বাতিল" : "Cancel") : (lang === "bn" ? "✏️ Edit" : "✏️ Edit")}
            </button>
          </div>

          {/* Avatar + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
              {user?.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : "👤"}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>
                {form.fullName || user?.name || (lang === "bn" ? "নাম নেই" : "No name")}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>{user?.email}</div>
              {form.phone && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>📞 {form.phone}</div>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, margin: "-18px 16px 0", background: "#fff", borderRadius: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.10)", overflow: "hidden", position: "relative", zIndex: 2 }}>
          {[
            { val: "০", label: lang === "bn" ? "Points" : "Points", color: "#16a34a" },
            { val: "🔥 ০", label: lang === "bn" ? "Streak" : "Streak", color: "#f59e0b" },
            { val: customer?.prescriptions?.length || "০", label: lang === "bn" ? "Prescription" : "Prescriptions", color: "#3b82f6" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "14px 8px", textAlign: "center", borderRight: i < 2 ? "1px solid #e5e7eb" : "none" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: "20px 16px" }}>

          {/* Success message */}
          {saved && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, fontWeight: 600, color: "#16a34a" }}>
              ✅ {lang === "bn" ? "Profile update হয়েছে!" : "Profile updated!"}
            </div>
          )}

          {/* Edit Form */}
          {editing && (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 14 }}>
                {lang === "bn" ? "Profile Edit করুন" : "Edit Profile"}
              </div>
              {[
                { label: lang === "bn" ? "পুরো নাম" : "Full Name", key: "fullName", placeholder: lang === "bn" ? "আপনার নাম" : "Your name" },
                { label: lang === "bn" ? "ফোন নম্বর" : "Phone", key: "phone", placeholder: "01XXXXXXXXX" },
                { label: lang === "bn" ? "ঠিকানা" : "Address", key: "address", placeholder: lang === "bn" ? "বাড়ির ঠিকানা" : "Home address" },
                { label: lang === "bn" ? "এলাকা" : "Area", key: "area", placeholder: lang === "bn" ? "এলাকার নাম" : "Area name" },
                { label: lang === "bn" ? "শহর" : "City", key: "city", placeholder: lang === "bn" ? "শহরের নাম" : "City name" },
              ].map((f) => (
                <div key={f.key} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>{f.label}</div>
                  <input
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif" }}
                  />
                </div>
              ))}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ width: "100%", padding: 12, background: saving ? "#6b7280" : "#16a34a", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}
              >
                {saving ? (lang === "bn" ? "⏳ Saving..." : "⏳ Saving...") : (lang === "bn" ? "✅ Save করুন" : "✅ Save")}
              </button>
            </div>
          )}

          {/* Menu items */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 14 }}>
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i < menuItems.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{lang === "bn" ? item.labelBn : item.labelEn}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>{item.sub}</div>
                  </div>
                  <div style={{ fontSize: 16, color: "#9ca3af" }}>›</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{ width: "100%", padding: 14, background: "#fff", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            🚪 {lang === "bn" ? "Logout" : "Logout"}
          </button>
        </div>

        <div style={{ height: 90 }} />
      </div>

      {/* ══════════════ DESKTOP ══════════════ */}
      <div className="profile-desktop">
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>

          {/* Left — Profile card */}
          <div>
            <div style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", borderRadius: 16, padding: 24, marginBottom: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button onClick={() => setEditing(!editing)} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif" }}>
                  {editing ? (lang === "bn" ? "বাতিল" : "Cancel") : "✏️ Edit"}
                </button>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.4)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                  {user?.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : "👤"}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 4 }}>
                  {form.fullName || user?.name || "—"}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{user?.email}</div>
                {form.phone && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>📞 {form.phone}</div>}
              </div>
            </div>

            {/* Stats */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "16px 20px", marginBottom: 16, display: "flex", justifyContent: "space-around" }}>
              {[
                { val: "০", label: "Points", color: "#16a34a" },
                { val: "🔥 ০", label: "Streak", color: "#f59e0b" },
                { val: "০", label: lang === "bn" ? "Orders" : "Orders", color: "#3b82f6" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Logout */}
            <button onClick={handleLogout} style={{ width: "100%", padding: 12, background: "#fff", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
              🚪 {lang === "bn" ? "Logout" : "Logout"}
            </button>
          </div>

          {/* Right — Edit form + Menu */}
          <div>
            {saved && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, fontWeight: 600, color: "#16a34a" }}>
                ✅ {lang === "bn" ? "Profile update হয়েছে!" : "Profile updated!"}
              </div>
            )}

            {editing ? (
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 24, marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
                  {lang === "bn" ? "Profile Edit করুন" : "Edit Profile"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  {[
                    { label: lang === "bn" ? "পুরো নাম" : "Full Name", key: "fullName", placeholder: lang === "bn" ? "আপনার নাম" : "Your name" },
                    { label: lang === "bn" ? "ফোন নম্বর" : "Phone", key: "phone", placeholder: "01XXXXXXXXX" },
                    { label: lang === "bn" ? "ঠিকানা" : "Address", key: "address", placeholder: lang === "bn" ? "বাড়ির ঠিকানা" : "Home address" },
                    { label: lang === "bn" ? "এলাকা" : "Area", key: "area", placeholder: lang === "bn" ? "এলাকার নাম" : "Area name" },
                    { label: lang === "bn" ? "শহর" : "City", key: "city", placeholder: lang === "bn" ? "শহরের নাম" : "City name" },
                  ].map((f) => (
                    <div key={f.key}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>{f.label}</div>
                      <input
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif" }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: 11, background: saving ? "#6b7280" : "#16a34a", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
                    {saving ? "⏳ Saving..." : (lang === "bn" ? "✅ Save করুন" : "✅ Save")}
                  </button>
                  <button onClick={() => setEditing(false)} style={{ flex: 1, padding: 11, background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
                    {lang === "bn" ? "বাতিল" : "Cancel"}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 24, marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
                  {lang === "bn" ? "ব্যক্তিগত তথ্য" : "Personal Info"}
                </div>
                {[
                  { label: lang === "bn" ? "নাম" : "Name", value: form.fullName || "—" },
                  { label: "Email", value: user?.email || "—" },
                  { label: lang === "bn" ? "ফোন" : "Phone", value: form.phone || "—" },
                  { label: lang === "bn" ? "ঠিকানা" : "Address", value: form.address || "—" },
                  { label: lang === "bn" ? "এলাকা" : "Area", value: form.area || "—" },
                  { label: lang === "bn" ? "শহর" : "City", value: form.city || "—" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Menu */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              {menuItems.map((item, i) => (
                <Link key={i} href={item.href} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < menuItems.length - 1 ? "1px solid #e5e7eb" : "none", transition: "background 0.15s" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{lang === "bn" ? item.labelBn : item.labelEn}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>{item.sub}</div>
                    </div>
                    <div style={{ fontSize: 18, color: "#9ca3af" }}>›</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-mobile { display: none; }
        .profile-desktop { display: block; }
        @media (max-width: 768px) {
          .profile-mobile { display: block; }
          .profile-desktop { display: none; }
        }
      `}</style>
    </div>
  );
}