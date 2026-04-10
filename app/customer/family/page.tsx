"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/language";

type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  age: string;
  conditions: string;
  emoji: string;
};

const EMOJIS = ["👴", "👵", "👨", "👩", "👦", "👧", "👶", "🧑"];

// ── AddForm — page এর বাইরে ──
function AddForm({
  lang, onAdd, onCancel,
}: {
  lang: string;
  onAdd: (m: Omit<FamilyMember, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ name: "", relation: "", age: "", conditions: "", emoji: "👤" });

  const relationOptions = lang === "bn"
    ? ["বাবা", "মা", "স্বামী", "স্ত্রী", "ছেলে", "মেয়ে", "ভাই", "বোন", "দাদা", "দাদি", "অন্যান্য"]
    : ["Father", "Mother", "Husband", "Wife", "Son", "Daughter", "Brother", "Sister", "Grandfather", "Grandmother", "Other"];

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 16, marginBottom: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14 }}>
        {lang === "bn" ? "নতুন সদস্য যোগ করুন" : "Add New Member"}
      </div>

      {/* Emoji */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8 }}>
          {lang === "bn" ? "Avatar বেছে নিন" : "Choose Avatar"}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {EMOJIS.map((e) => (
            <button key={e} type="button" onClick={() => setForm({ ...form, emoji: e })} style={{
              width: 40, height: 40, borderRadius: 10, fontSize: 22,
              border: form.emoji === e ? "2px solid #16a34a" : "1px solid #e5e7eb",
              background: form.emoji === e ? "#f0fdf4" : "#fff",
              cursor: "pointer",
            }}>{e}</button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
          {lang === "bn" ? "নাম *" : "Name *"}
        </div>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder={lang === "bn" ? "যেমন: আব্বু" : "e.g. Father"}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif" }}
        />
      </div>

      {/* Relation */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
          {lang === "bn" ? "সম্পর্ক" : "Relation"}
        </div>
        <select
          value={form.relation}
          onChange={(e) => setForm({ ...form, relation: e.target.value })}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif", background: "#fff" }}
        >
          <option value="">{lang === "bn" ? "বেছে নিন" : "Select"}</option>
          {relationOptions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Age */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
          {lang === "bn" ? "বয়স" : "Age"}
        </div>
        <input
          type="number"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          placeholder="45"
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif" }}
        />
      </div>

      {/* Conditions */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
          {lang === "bn" ? "রোগ বা সমস্যা" : "Health Conditions"}
        </div>
        <input
          value={form.conditions}
          onChange={(e) => setForm({ ...form, conditions: e.target.value })}
          placeholder={lang === "bn" ? "যেমন: Diabetes, Blood Pressure" : "e.g. Diabetes, Blood Pressure"}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif" }}
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" onClick={() => onAdd(form)} style={{
          flex: 1, padding: 12, background: "#16a34a", color: "white",
          border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "sans-serif",
        }}>
          {lang === "bn" ? "✅ যোগ করুন" : "✅ Add"}
        </button>
        <button type="button" onClick={onCancel} style={{
          flex: 1, padding: 12, background: "#f3f4f6", color: "#374151",
          border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "sans-serif",
        }}>
          {lang === "bn" ? "বাতিল" : "Cancel"}
        </button>
      </div>
    </div>
  );
}

// ── MemberCard — page এর বাইরে ──
function MemberCard({ member, lang, onDelete }: { member: FamilyMember; lang: string; onDelete: (id: string) => void }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 16, marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
        {member.emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{member.name}</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
          {member.relation}{member.age ? ` · ${lang === "bn" ? "বয়স" : "Age"} ${member.age}` : ""}
        </div>
        {member.conditions && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
            {member.conditions.split(",").map((c, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", background: "#fef2f2", color: "#ef4444", borderRadius: 6, border: "1px solid #fecaca" }}>
                {c.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
      <button type="button" onClick={() => onDelete(member.id)} style={{
        width: 32, height: 32, borderRadius: 8, background: "#fef2f2",
        border: "1px solid #fecaca", color: "#ef4444", cursor: "pointer",
        fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>🗑</button>
    </div>
  );
}

// ── Main Page ──
export default function FamilyPage() {
  const { lang } = useLanguage();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pharmaco_family");
    if (stored) setMembers(JSON.parse(stored));
  }, []);

  const saveMembers = (updated: FamilyMember[]) => {
    setMembers(updated);
    localStorage.setItem("pharmaco_family", JSON.stringify(updated));
  };

  const handleAdd = (form: Omit<FamilyMember, "id">) => {
    if (!form.name.trim()) return;
    saveMembers([...members, { id: Date.now().toString(), ...form }]);
    setShowAddForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    saveMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>

      {/* ══════════════ MOBILE ══════════════ */}
      <div className="family-mobile">
        <div style={{ background: "#fff", padding: "16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {lang === "bn" ? "পরিবার" : "Family"}
          </div>
          <button type="button" onClick={() => setShowAddForm(!showAddForm)} style={{
            width: 36, height: 36, borderRadius: 10, background: "#16a34a",
            border: "none", color: "white", fontSize: 22, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>+</button>
        </div>

        <div style={{ padding: "16px" }}>
          {saved && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, fontWeight: 600, color: "#16a34a" }}>
              ✅ {lang === "bn" ? "সদস্য যোগ হয়েছে!" : "Member added!"}
            </div>
          )}

          {showAddForm && (
            <AddForm lang={lang} onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
          )}

          {members.length === 0 && !showAddForm ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍👩‍👧</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                {lang === "bn" ? "কোনো সদস্য নেই" : "No family members"}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
                {lang === "bn" ? "পরিবারের সদস্যদের যোগ করুন" : "Add your family members"}
              </div>
              <button type="button" onClick={() => setShowAddForm(true)} style={{
                padding: "10px 20px", background: "#16a34a", color: "white",
                border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "sans-serif",
              }}>
                + {lang === "bn" ? "সদস্য যোগ করুন" : "Add Member"}
              </button>
            </div>
          ) : (
            members.map((m) => (
              <MemberCard key={m.id} member={m} lang={lang} onDelete={handleDelete} />
            ))
          )}

          {members.length > 0 && !showAddForm && (
            <div onClick={() => setShowAddForm(true)} style={{
              background: "#fff", borderRadius: 14, border: "2px dashed #bbf7d0",
              padding: 16, display: "flex", alignItems: "center", gap: 12,
              cursor: "pointer", marginBottom: 10,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>➕</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>
                  {lang === "bn" ? "নতুন সদস্য যোগ করুন" : "Add New Member"}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>
                  {lang === "bn" ? "পরিবারের যে কাউকে add করুন" : "Add anyone from your family"}
                </div>
              </div>
            </div>
          )}

          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, marginTop: 8 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
            <div style={{ fontSize: 12, color: "#1d4ed8", lineHeight: 1.5 }}>
              {lang === "bn"
                ? "পরিবারের সদস্যদের prescription ও reminder আলাদাভাবে manage করা যাবে।"
                : "You can manage prescriptions and reminders separately for each family member."}
            </div>
          </div>
        </div>
        <div style={{ height: 90 }} />
      </div>

      {/* ══════════════ DESKTOP ══════════════ */}
      <div className="family-desktop">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
              {lang === "bn" ? "পরিবারের স্বাস্থ্য ব্যবস্থাপনা" : "Family Health Management"}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              {lang === "bn" ? "পরিবারের সবার স্বাস্থ্য এক জায়গায়" : "All family health in one place"}
            </div>
          </div>
          <button type="button" onClick={() => setShowAddForm(!showAddForm)} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 18px", background: "#16a34a", color: "white",
            border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "sans-serif",
          }}>
            ➕ {lang === "bn" ? "সদস্য যোগ করুন" : "Add Member"}
          </button>
        </div>

        {saved && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, fontWeight: 600, color: "#16a34a" }}>
            ✅ {lang === "bn" ? "সদস্য যোগ হয়েছে!" : "Member added successfully!"}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: showAddForm ? "400px 1fr" : "1fr", gap: 20 }}>
          {showAddForm && (
            <AddForm lang={lang} onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
          )}
          <div>
            {members.length === 0 && !showAddForm ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 56, marginBottom: 14 }}>👨‍👩‍👧</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  {lang === "bn" ? "কোনো সদস্য নেই" : "No family members"}
                </div>
                <button type="button" onClick={() => setShowAddForm(true)} style={{
                  padding: "11px 24px", background: "#16a34a", color: "white",
                  border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "sans-serif",
                }}>
                  + {lang === "bn" ? "প্রথম সদস্য যোগ করুন" : "Add First Member"}
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {members.map((m) => (
                  <MemberCard key={m.id} member={m} lang={lang} onDelete={handleDelete} />
                ))}
                <div onClick={() => setShowAddForm(true)} style={{
                  background: "#fff", borderRadius: 14, border: "2px dashed #bbf7d0",
                  padding: 20, display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>➕</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>
                      {lang === "bn" ? "নতুন সদস্য" : "New Member"}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                      {lang === "bn" ? "যোগ করুন" : "Add member"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .family-mobile { display: none; }
        .family-desktop { display: block; }
        @media (max-width: 768px) {
          .family-mobile { display: block; }
          .family-desktop { display: none; }
        }
      `}</style>
    </div>
  );
}