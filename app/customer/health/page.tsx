"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/language";

export default function HealthPage() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"vitals" | "symptom" | "goals">("vitals");
  const [symptomText, setSymptomText] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiReply, setShowAiReply] = useState(false);

  // Vitals state
  const [vitals, setVitals] = useState({
    bp_sys: "", bp_dia: "", sugar: "", weight: ""
  });
  const [vitalSaved, setVitalSaved] = useState(false);

  const handleSymptomCheck = async () => {
    if (!symptomText.trim()) return;
    setAiLoading(true);
    setShowAiReply(false);
    // Simulated AI response — real AI integration পরে করব
    setTimeout(() => {
      setAiReply(
        lang === "bn"
          ? "আপনার লক্ষণ দেখে মনে হচ্ছে সাধারণ ভাইরাল সমস্যা হতে পারে। পর্যাপ্ত বিশ্রাম নিন এবং প্রচুর পানি পান করুন। ৩ দিনের বেশি সমস্যা থাকলে অবশ্যই ডাক্তার দেখান। ⚠️ এটি ডাক্তারের বিকল্প নয়।"
          : "Based on your symptoms, it may be a common viral issue. Get enough rest and drink plenty of water. If symptoms persist for more than 3 days, please see a doctor. ⚠️ This is not a substitute for medical advice."
      );
      setAiLoading(false);
      setShowAiReply(true);
    }, 1500);
  };

  const handleVitalSave = () => {
    setVitalSaved(true);
    setTimeout(() => setVitalSaved(false), 2000);
  };

  const goals = [
    {
      name: lang === "bn" ? "মাসিক Streak Goal" : "Monthly Streak Goal",
      current: 15, total: 30, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0",
      sub: lang === "bn" ? "১৫ দিন ধরে নিয়মিত ওষুধ খাচ্ছেন" : "15 days of regular medicine",
      pts: "+৫০ pts",
    },
    {
      name: lang === "bn" ? "Blood Sugar নিয়ন্ত্রণ" : "Blood Sugar Control",
      current: 6, total: 10, color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe",
      sub: lang === "bn" ? "এই সপ্তাহে ৬ দিন স্বাভাবিক ছিল" : "6 days normal this week",
      pts: "+৩০ pts",
    },
  ];

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>

      {/* ══════════════ MOBILE ══════════════ */}
      <div className="health-mobile">

        {/* Header */}
        <div style={{ background: "#fff", padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 14 }}>
            {lang === "bn" ? "আমার স্বাস্থ্য" : "My Health"}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 10, padding: 3 }}>
            {[
              { key: "vitals", labelBn: "Vital Signs", labelEn: "Vital Signs" },
              { key: "symptom", labelBn: "AI Checker", labelEn: "AI Checker" },
              { key: "goals", labelBn: "Goals", labelEn: "Goals" },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{
                flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, fontFamily: "sans-serif",
                background: activeTab === tab.key ? "#fff" : "transparent",
                color: activeTab === tab.key ? "#16a34a" : "#6b7280",
                boxShadow: activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}>
                {lang === "bn" ? tab.labelBn : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* ── VITALS TAB ── */}
        {activeTab === "vitals" && (
          <div style={{ padding: "16px" }}>

            {/* Vital cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { icon: "❤️", label: lang === "bn" ? "Blood Pressure" : "Blood Pressure", value: vitals.bp_sys && vitals.bp_dia ? `${vitals.bp_sys}/${vitals.bp_dia}` : "—", unit: "mmHg", trend: "→", trendColor: "#f59e0b", trendLabel: lang === "bn" ? "স্বাভাবিক" : "Normal" },
                { icon: "🩸", label: lang === "bn" ? "Blood Sugar" : "Blood Sugar", value: vitals.sugar || "—", unit: "mg/dL", trend: "↓", trendColor: "#16a34a", trendLabel: lang === "bn" ? "ভালো" : "Good" },
                { icon: "⚖️", label: lang === "bn" ? "ওজন" : "Weight", value: vitals.weight || "—", unit: "kg", trend: "→", trendColor: "#f59e0b", trendLabel: lang === "bn" ? "একই" : "Stable" },
                { icon: "🧬", label: lang === "bn" ? "Report Scan" : "Report Scan", value: null, unit: "", trend: "", trendColor: "", trendLabel: "" },
              ].map((v, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #e5e7eb" }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{v.icon}</div>
                  {v.value !== null ? (
                    <>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{v.value}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{v.unit}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{v.label}</div>
                      {v.trend && <div style={{ fontSize: 11, fontWeight: 700, color: v.trendColor, marginTop: 4 }}>{v.trend} {v.trendLabel}</div>}
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{v.label}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4 }}>
                        {lang === "bn" ? "ছবি তুলুন, AI বুঝিয়ে দেবে" : "Take photo, AI explains"}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginTop: 8, cursor: "pointer" }}>
                        {lang === "bn" ? "ছবি তুলুন →" : "Scan →"}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Input vitals */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 14 }}>
                {lang === "bn" ? "আজকের তথ্য দিন" : "Log Today's Vitals"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
                    {lang === "bn" ? "BP (Systolic)" : "BP (Systolic)"}
                  </div>
                  <input
                    type="number"
                    placeholder="120"
                    value={vitals.bp_sys}
                    onChange={(e) => setVitals({ ...vitals, bp_sys: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
                    {lang === "bn" ? "BP (Diastolic)" : "BP (Diastolic)"}
                  </div>
                  <input
                    type="number"
                    placeholder="80"
                    value={vitals.bp_dia}
                    onChange={(e) => setVitals({ ...vitals, bp_dia: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
                    {lang === "bn" ? "Blood Sugar (mg/dL)" : "Blood Sugar (mg/dL)"}
                  </div>
                  <input
                    type="number"
                    placeholder="98"
                    value={vitals.sugar}
                    onChange={(e) => setVitals({ ...vitals, sugar: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
                    {lang === "bn" ? "ওজন (kg)" : "Weight (kg)"}
                  </div>
                  <input
                    type="number"
                    placeholder="72"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif" }}
                  />
                </div>
              </div>
              <button
                onClick={handleVitalSave}
                style={{ width: "100%", padding: 12, background: "#16a34a", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}
              >
                {vitalSaved ? (lang === "bn" ? "✅ Save হয়েছে!" : "✅ Saved!") : (lang === "bn" ? "Save করুন" : "Save")}
              </button>
            </div>
          </div>
        )}

        {/* ── SYMPTOM CHECKER TAB ── */}
        {activeTab === "symptom" && (
          <div style={{ padding: "16px" }}>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🩺</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                    {lang === "bn" ? "AI Symptom Checker" : "AI Symptom Checker"}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>
                    {lang === "bn" ? "বাংলায় লক্ষণ লিখুন" : "Describe your symptoms"}
                  </div>
                </div>
              </div>

              <textarea
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder={lang === "bn" ? "যেমন: মাথা ব্যথা, জ্বর ২ দিন ধরে, গলায় ব্যথা..." : "e.g. headache, fever for 2 days, sore throat..."}
                rows={4}
                style={{ width: "100%", padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", resize: "none", fontFamily: "sans-serif", marginBottom: 12 }}
              />

              <button
                onClick={handleSymptomCheck}
                disabled={aiLoading || !symptomText.trim()}
                style={{ width: "100%", padding: 12, background: aiLoading ? "#6b7280" : "#16a34a", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: aiLoading ? "not-allowed" : "pointer", fontFamily: "sans-serif" }}
              >
                {aiLoading ? (lang === "bn" ? "⏳ AI ভাবছে..." : "⏳ AI thinking...") : (lang === "bn" ? "🤖 AI-কে জিজ্ঞেস করুন" : "🤖 Ask AI")}
              </button>

              {showAiReply && (
                <div style={{ marginTop: 14, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    🤖 {lang === "bn" ? "AI-এর পরামর্শ" : "AI Advice"}
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{aiReply}</div>
                </div>
              )}
            </div>

            {/* Warning */}
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
              <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
                {lang === "bn"
                  ? "এই AI পরামর্শ শুধু সাধারণ তথ্যের জন্য। গুরুতর সমস্যায় অবশ্যই ডাক্তার দেখান।"
                  : "This AI advice is for general information only. For serious issues, please consult a doctor."}
              </div>
            </div>
          </div>
        )}

        {/* ── GOALS TAB ── */}
        {activeTab === "goals" && (
          <div style={{ padding: "16px" }}>

            {/* Loyalty Points */}
            <div style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>
                  {lang === "bn" ? "Loyalty Points 🏆" : "Loyalty Points 🏆"}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "white" }}>০ pts</div>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: "0%", height: "100%", background: "white", borderRadius: 3 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>০</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>
                  {lang === "bn" ? "৫০০ pts = ৫০৳ discount!" : "500 pts = ৳50 discount!"}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>৫০০</div>
              </div>
            </div>

            {/* Goals */}
            {goals.map((goal, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
                {/* Ring */}
                <div style={{ width: 52, height: 52, borderRadius: "50%", border: `4px solid ${goal.border}`, background: goal.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: goal.color, lineHeight: 1 }}>{goal.current}</div>
                    <div style={{ fontSize: 9, color: "#6b7280" }}>/{goal.total}</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 3 }}>{goal.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{goal.sub}</div>
                  <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${(goal.current / goal.total) * 100}%`, height: "100%", background: goal.color, borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: goal.color, marginTop: 4 }}>{goal.pts}</div>
                </div>
              </div>
            ))}

            {/* Daily Tip */}
            <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0", borderRadius: 14, padding: 16, display: "flex", gap: 12 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>
                  {lang === "bn" ? "আজকের টিপস" : "Today's Tip"}
                </div>
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
                  {lang === "bn"
                    ? "প্রতিদিন নির্দিষ্ট সময়ে ওষুধ খেলে শরীরে ওষুধের মাত্রা ঠিক থাকে এবং দ্রুত সুস্থ হওয়া যায়।"
                    : "Taking medicine at the same time each day maintains consistent drug levels and speeds recovery."}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ height: 90 }} />
      </div>

      {/* ══════════════ DESKTOP ══════════════ */}
      <div className="health-desktop">
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
          {lang === "bn" ? "আমার স্বাস্থ্য" : "My Health"}
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
          {lang === "bn" ? "আপনার স্বাস্থ্য তথ্য ও AI পরামর্শ এক জায়গায়" : "Your health data and AI advice in one place"}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

          {/* Vitals Input */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
              {lang === "bn" ? "আজকের Vital Signs" : "Today's Vital Signs"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              {[
                { label: "BP Systolic", placeholder: "120", key: "bp_sys" },
                { label: "BP Diastolic", placeholder: "80", key: "bp_dia" },
                { label: lang === "bn" ? "Blood Sugar (mg/dL)" : "Blood Sugar (mg/dL)", placeholder: "98", key: "sugar" },
                { label: lang === "bn" ? "ওজন (kg)" : "Weight (kg)", placeholder: "72", key: "weight" },
              ].map((f) => (
                <div key={f.key}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>{f.label}</div>
                  <input
                    type="number"
                    placeholder={f.placeholder}
                    value={vitals[f.key as keyof typeof vitals]}
                    onChange={(e) => setVitals({ ...vitals, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "sans-serif" }}
                  />
                </div>
              ))}
            </div>
            <button onClick={handleVitalSave} style={{ width: "100%", padding: 11, background: "#16a34a", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
              {vitalSaved ? "✅ Saved!" : (lang === "bn" ? "Save করুন" : "Save")}
            </button>
          </div>

          {/* AI Symptom Checker */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
              🩺 {lang === "bn" ? "AI Symptom Checker" : "AI Symptom Checker"}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>
              {lang === "bn" ? "বাংলায় লক্ষণ লিখুন, AI পরামর্শ দেবে" : "Describe symptoms, AI will advise"}
            </div>
            <textarea
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder={lang === "bn" ? "যেমন: মাথা ব্যথা, জ্বর ২ দিন ধরে..." : "e.g. headache, fever for 2 days..."}
              rows={3}
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", resize: "none", fontFamily: "sans-serif", marginBottom: 10 }}
            />
            <button onClick={handleSymptomCheck} disabled={aiLoading || !symptomText.trim()} style={{ width: "100%", padding: 11, background: aiLoading ? "#6b7280" : "#16a34a", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", marginBottom: 10 }}>
              {aiLoading ? "⏳ AI thinking..." : "🤖 " + (lang === "bn" ? "AI-কে জিজ্ঞেস করুন" : "Ask AI")}
            </button>
            {showAiReply && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>🤖 AI Advice</div>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{aiReply}</div>
              </div>
            )}
          </div>
        </div>

        {/* Goals Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {goals.map((goal, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", border: `4px solid ${goal.border}`, background: goal.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: goal.color }}>{goal.current}</div>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>/{goal.total}</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{goal.name}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>{goal.sub}</div>
                <div style={{ height: 5, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(goal.current / goal.total) * 100}%`, height: "100%", background: goal.color, borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: goal.color, marginTop: 6 }}>{goal.pts}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Loyalty + Tip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", borderRadius: 14, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Loyalty Points 🏆</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "white" }}>০ pts</div>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
              <div style={{ width: "0%", height: "100%", background: "white", borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 8 }}>
              {lang === "bn" ? "৫০০ pts হলে ৫০৳ discount পাবেন!" : "Get ৳50 discount at 500 pts!"}
            </div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0", borderRadius: 14, padding: 20, display: "flex", gap: 14 }}>
            <span style={{ fontSize: 32, flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>
                {lang === "bn" ? "আজকের টিপস" : "Today's Tip"}
              </div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                {lang === "bn"
                  ? "প্রতিদিন নির্দিষ্ট সময়ে ওষুধ খেলে দ্রুত সুস্থ হওয়া যায়।"
                  : "Taking medicine at the same time each day speeds recovery."}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .health-mobile { display: none; }
        .health-desktop { display: block; }
        @media (max-width: 768px) {
          .health-mobile { display: block; }
          .health-desktop { display: none; }
        }
      `}</style>
    </div>
  );
}