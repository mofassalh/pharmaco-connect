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

export default function FamilyPage() {
  const { lang } = useLanguage();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "", relation: "", age: "", conditions: "", emoji: "👤"
  });
  const [saved, setSaved] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("pharmaco_family");
    if (stored) setMembers(JSON.parse(stored));
  }, []);

  const saveMembers = (updated: FamilyMember[]) => {
    setMembers(updated);
    localStorage.setItem("pharmaco_family", JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (!newMember.name.trim()) return;
    const member: FamilyMember = {
      id: Date.now().toString(),
      ...newMember,
    };
    saveMembers([...members, member]);
    setNewMember({ name: "", relation: "", age: "", conditions: "", emoji: "👤" });
    setShowAddForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    saveMembers(members.filter((m) => m.id !== id));
  };

  const emojis = ["👴", "👵", "👨", "👩", "👦", "👧", "👶", "🧑"];

  const relationOptions = lang === "bn"
    ? ["বাবা", "মা", "স্বামী", "স্ত্রী", "ছেলে", "মেয়ে", "ভাই", "বোন", "দাদা", "দাদি", "অন্যান্য"]
    : ["Father", "Mother", "Husband", "Wife", "Son", "Daughter", "Brother", "Sister", "Grandfather", "Grandmother", "Other"];

  const AddForm = () => (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 16, marginBottom: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14 }}>
        {lang === "bn" ? "নতুন সদস্য যোগ করুন" : "Add New Member"}
      </div>

      {/* Emoji picker */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8 }}>
          {lang === "bn" ? "Avatar বেছে নিন" : "Choose Avatar"}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {emojis.map((e) => (
            <button key={e} onClick={() => setNewMember({ ...newMember, emoji: e })} style={{
              width: 40, height: 40, borderRadius: 10, fontSize: 22,
              border: newMember.emoji === e ? "2px solid #16a34a" : "1px solid #e5e7eb",
              background: newMember.emoji === e ? "#f0fdf4" : "#fff",
              cursor: "pointer",
            }}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
          {lang === "bn" ? "নাম *" : "Name *"}
        </div>
        <input
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
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
          value={newMember.relation}
          onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
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
          value={newMember.age}
          onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
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
          value={newMember.conditions}
          onChange={(e) => setNewMember({ ...newMember, conditions: e.target.value })}
          placeholder={lang === "bn" ? "যেমন: Diabetes, Blood Pressure" : "e.g. Diabetes, Blood Pressure"}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif" }}
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={handleAdd} style={{
          flex: 1, padding: 12, background: "#16a34a", color: "white",
          border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "sans-serif",
        }}>
          {lang === "bn" ? "✅ যোগ করুন" : "✅ Add"}
        </button>
        <button onClick={() => setShowAddForm(false)} style={{
          flex: 1, padding: 12, background: "#f3f4f6", color: "#374151",
          border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "sans-serif",
        }}>
          {lang === "bn" ? "বাতিল" : "Cancel"}
        </button>
      </div>
    </div>
  );

  const MemberCard = ({ member }: { member: FamilyMember }) => (
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
      <button onClick={() => handleDelete(member.id)} style={{
        width: 32, height: 32, borderRadius: 8, background: "#fef2f2",
        border: "1px solid #fecaca", color: "#ef4444", cursor: "pointer",
        fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        🗑
      </button>
    </div>
  );

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>

      {/* ══════════════ MOBILE ══════════════ */}
      <div className="family-mobile">

        {/* Header */}
        <div style={{ background: "#fff", padding: "16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {lang === "bn" ? "পরিবার" : "Family"}
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} style={{
            width: 36, height: 36, borderRadius: 10, background: "#16a34a",
            border: "none", color: "white", fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            +
          </button>
        </div>

        <div style={{ padding: "16px" }}>

          {saved && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, fontWeight: 600, color: "#16a34a", display: "flex", alignItems: "center", gap: 8 }}>
              ✅ {lang === "bn" ? "সদস্য যোগ হয়েছে!" : "Member added!"}
            </div>
          )}

          {showAddForm && <AddForm />}

          {members.length === 0 && !showAddForm ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍👩‍👧</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                {lang === "bn" ? "কোনো সদস্য নেই" : "No family members"}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
                {lang === "bn" ? "পরিবারের সদস্যদের যোগ করুন" : "Add your family members"}
              </div>
              <button onClick={() => setShowAddForm(true)} style={{
                padding: "10px 20px", background: "#16a34a", color: "white",
                border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "sans-serif",
              }}>
                + {lang === "bn" ? "সদস্য যোগ করুন" : "Add Member"}
              </button>
            </div>
          ) : (
            members.map((m) => <MemberCard key={m.id} member={m} />)
          )}

          {/* Add more button */}
          {members.length > 0 && !showAddForm && (
            <div
              onClick={() => setShowAddForm(true)}
              style={{ background: "#fff", borderRadius: 14, border: "2px dashed #bbf7d0", padding: 16, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 10 }}
            >
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

          {/* Info box */}
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
          <button onClick={() => setShowAddForm(!showAddForm)} style={{
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

        <div style={{ display: "grid", gridTemplateColumns: showAddForm ? "1fr 1fr" : "1fr", gap: 20 }}>
          {showAddForm && (
            <div>
              <AddForm />
            </div>
          )}
          <div>
            {members.length === 0 && !showAddForm ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 56, marginBottom: 14 }}>👨‍👩‍👧</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  {lang === "bn" ? "কোনো সদস্য নেই" : "No family members"}
                </div>
                <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
                  {lang === "bn" ? "পরিবারের সদস্যদের যোগ করুন" : "Add your family members to get started"}
                </div>
                <button onClick={() => setShowAddForm(true)} style={{
                  padding: "11px 24px", background: "#16a34a", color: "white",
                  border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "sans-serif",
                }}>
                  + {lang === "bn" ? "প্রথম সদস্য যোগ করুন" : "Add First Member"}
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {members.map((m) => <MemberCard key={m.id} member={m} />)}
                <div
                  onClick={() => setShowAddForm(true)}
                  style={{ background: "#fff", borderRadius: 14, border: "2px dashed #bbf7d0", padding: 20, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                >
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