"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FamilyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", relation: "", phone: "", age: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(data => { if (data.id) setUser(data); });
    const saved = localStorage.getItem("family-members");
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  const handleAdd = () => {
    if (!form.name || !form.relation) { alert("নাম ও সম্পর্ক দিন"); return; }
    setSaving(true);
    const newMembers = [...members, { ...form, id: Date.now() }];
    setMembers(newMembers);
    localStorage.setItem("family-members", JSON.stringify(newMembers));
    setForm({ name: "", relation: "", phone: "", age: "" });
    setShowForm(false);
    setSaving(false);
  };

  const handleRemove = (id: number) => {
    const updated = members.filter((m: any) => m.id !== id);
    setMembers(updated);
    localStorage.setItem("family-members", JSON.stringify(updated));
  };

  const relations = ["স্বামী/স্ত্রী", "বাবা", "মা", "ছেলে", "মেয়ে", "ভাই", "বোন", "অন্যান্য"];

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: 32 }}>

      {/* Sub Header */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 48, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 56, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#a0aec0" }}>←</button>
        <span style={{ fontWeight: 700, color: "#1a202c", fontSize: 15 }}>👨‍👩‍👧‍👦 পরিবারের সদস্য</span>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>

        {/* নিজের card */}
        {user && (
          <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {user.photoUrl ? (
                <img src={user.photoUrl} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E6FFFA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#0D9488" }}>
                  {user.name?.[0] || "?"}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>{user.name}</span>
                  <span style={{ fontSize: 11, background: "#E6FFFA", color: "#0D9488", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>আমি</span>
                </div>
                <div style={{ fontSize: 12, color: "#718096", marginTop: 2 }}>{user.phone || user.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Family Members */}
        {members.map((m: any) => (
          <div key={m.id} style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#EBF8FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#2B6CB0" }}>
                {m.name?.[0] || "?"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>{m.name}</span>
                  <span style={{ fontSize: 11, background: "#EBF8FF", color: "#2B6CB0", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{m.relation}</span>
                </div>
                {m.phone && <div style={{ fontSize: 12, color: "#718096", marginTop: 2 }}>📞 {m.phone}</div>}
                {m.age && <div style={{ fontSize: 12, color: "#718096" }}>বয়স: {m.age}</div>}
              </div>
              <button onClick={() => handleRemove(m.id)}
                style={{ background: "none", border: "none", color: "#FC8181", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
          </div>
        ))}

        {/* Add Form */}
        {showForm ? (
          <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 16, marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c", marginBottom: 14 }}>নতুন সদস্য</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>নাম *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="সদস্যের নাম"
                style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>সম্পর্ক *</label>
              <select value={form.relation} onChange={e => setForm({ ...form, relation: e.target.value })}
                style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box", background: "#fff" }}>
                <option value="">বেছে নিন</option>
                {relations.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>বয়স</label>
                <input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
                  placeholder="যেমন: ৪৫"
                  style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowForm(false)}
                style={{ flex: 1, background: "#fff", border: "0.5px solid #e2e8f0", color: "#4a5568", padding: "12px", borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
                বাতিল
              </button>
              <button onClick={handleAdd} disabled={saving}
                style={{ flex: 1, background: "#0D9488", color: "#fff", border: "none", padding: "12px", borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 700 }}>
                যোগ করুন
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)}
            style={{ width: "100%", border: "2px dashed #b2f5ea", background: "#f0fdf9", color: "#0D9488", padding: "16px", borderRadius: 14, fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
            + নতুন সদস্য যোগ করুন
          </button>
        )}

        <p style={{ fontSize: 12, color: "#a0aec0", textAlign: "center", marginTop: 12, padding: "0 16px" }}>
          পরিবারের সদস্য যোগ করলে তাদের prescription ও medicine আলাদাভাবে track করতে পারবেন
        </p>
      </div>
    </div>
  );
}