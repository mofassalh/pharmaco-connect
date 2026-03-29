"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RefillsPage() {
  const router = useRouter();
  const [reminder, setReminder] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refills, setRefills] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("refills");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [form, setForm] = useState({ name: "", condition: "", meds: "", refillDay: "1" });

  const handleAdd = () => {
    if (!form.name || !form.meds) { alert("নাম ও medicine দিন"); return; }
    const newRefills = [...refills, {
      id: Date.now(),
      name: form.name,
      condition: form.condition,
      meds: form.meds.split(",").map(m => m.trim()),
      refillDay: Number(form.refillDay),
      lastRefill: new Date().toLocaleDateString("bn-BD"),
      nextDue: new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString("bn-BD"),
      daysLeft: 30,
    }];
    setRefills(newRefills);
    localStorage.setItem("refills", JSON.stringify(newRefills));
    setForm({ name: "", condition: "", meds: "", refillDay: "1" });
    setShowForm(false);
  };

  const handleRemove = (id: number) => {
    const updated = refills.filter((r: any) => r.id !== id);
    setRefills(updated);
    localStorage.setItem("refills", JSON.stringify(updated));
  };

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: 32 }}>

      {/* Sub Header */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 48, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 56, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#a0aec0" }}>←</button>
        <span style={{ fontWeight: 700, color: "#1a202c", fontSize: 15 }}>🔔 Monthly Refill</span>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>

        {/* Reminder Toggle */}
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 16, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>৫ দিন আগে Reminder</div>
            <div style={{ fontSize: 12, color: "#a0aec0", marginTop: 2 }}>Refill এর আগে phone call পাবেন</div>
          </div>
          <button onClick={() => setReminder(!reminder)}
            style={{ width: 48, height: 26, borderRadius: 13, background: reminder ? "#0D9488" : "#e2e8f0", border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
            <div style={{ width: 20, height: 20, background: "#fff", borderRadius: "50%", position: "absolute", top: 3, left: reminder ? 24 : 4, transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </button>
        </div>

        {/* Refill Cards */}
        {refills.map((p: any) => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>{p.name}</div>
                {p.condition && <div style={{ fontSize: 11, background: "#FFFAF0", color: "#B7791F", padding: "2px 8px", borderRadius: 20, display: "inline-block", marginTop: 4, fontWeight: 600 }}>{p.condition}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ textAlign: "center", padding: "6px 12px", borderRadius: 10, background: p.daysLeft <= 7 ? "#FFF5F5" : "#F0FFF4" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: p.daysLeft <= 7 ? "#C53030" : "#276749" }}>{p.daysLeft}</div>
                  <div style={{ fontSize: 10, color: "#718096" }}>দিন বাকি</div>
                </div>
                <button onClick={() => handleRemove(p.id)} style={{ background: "none", border: "none", color: "#FC8181", cursor: "pointer", fontSize: 18 }}>✕</button>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              {p.meds.map((m: string, j: number) => (
                <div key={j} style={{ fontSize: 12, color: "#4a5568", marginBottom: 3 }}>💊 {m}</div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#a0aec0", marginBottom: 12 }}>
              শেষ: {p.lastRefill} · পরের: {p.nextDue}
            </div>
            <Link href="/customer/shop"
              style={{ display: "block", width: "100%", background: "#0D9488", color: "#fff", border: "none", padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 700, textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}>
              🔄 এখনই Refill করুন
            </Link>
          </div>
        ))}

        {/* Add Form */}
        {showForm ? (
          <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 16, marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c", marginBottom: 14 }}>নতুন Refill যোগ করুন</div>
            {[
              { label: "রোগীর নাম *", key: "name", placeholder: "যেমন: বাবা (Abdul Karim)" },
              { label: "রোগের নাম", key: "condition", placeholder: "যেমন: ডায়াবেটিস" },
              { label: "Medicine তালিকা *", key: "meds", placeholder: "comma দিয়ে লিখুন: Metformin, Amlodipine" },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>প্রতি মাসের কত তারিখে Refill করেন?</label>
              <input type="number" min="1" max="31" value={form.refillDay} onChange={e => setForm({ ...form, refillDay: e.target.value })}
                style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowForm(false)}
                style={{ flex: 1, background: "#fff", border: "0.5px solid #e2e8f0", color: "#4a5568", padding: "12px", borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
                বাতিল
              </button>
              <button onClick={handleAdd}
                style={{ flex: 1, background: "#0D9488", color: "#fff", border: "none", padding: "12px", borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 700 }}>
                যোগ করুন
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)}
            style={{ width: "100%", border: "2px dashed #b2f5ea", background: "#f0fdf9", color: "#0D9488", padding: "16px", borderRadius: 14, fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
            + নতুন Refill যোগ করুন
          </button>
        )}
      </div>
    </div>
  );
}