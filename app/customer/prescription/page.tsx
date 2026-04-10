"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/language";

export default function PrescriptionPage() {
  const { lang } = useLanguage();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "requests">("active");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/prescriptions");
        if (res.ok) {
          const data = await res.json();
          setPrescriptions(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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

      {/* ── MOBILE ── */}
      <div className="rx-mobile">

        {/* Header */}
        <div style={{ background: "#fff", padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 14 }}>
            {lang === "bn" ? "Prescription" : "Prescription"}
          </div>

          {/* Scan Button */}
          <Link href="/customer/prescription/upload" style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            borderRadius: 14, padding: "14px 16px",
            textDecoration: "none", marginBottom: 12,
            boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
          }}>
            <span style={{ fontSize: 24 }}>📸</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>
                {lang === "bn" ? "Prescription Scan করুন" : "Scan Prescription"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 1 }}>
                {lang === "bn" ? "ছবি তুলুন — AI নিজেই পড়ে নেবে" : "Take photo — AI will read it"}
              </div>
            </div>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 18 }}>→</span>
          </Link>

        {/* Medicine Encyclopedia */}
<Link href="/customer/medicines" style={{
  display: "flex", alignItems: "center", gap: 12,
  background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
  padding: "14px 16px", textDecoration: "none", marginBottom: 12,
}}>
  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📚</div>
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
      {lang === "bn" ? "ওষুধের তথ্যভাণ্ডার" : "Medicine Encyclopedia"}
    </div>
    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>
      {lang === "bn" ? "যেকোনো ওষুধের তথ্য বাংলায় জানুন" : "Learn about any medicine in Bengali"}
    </div>
  </div>
  <span style={{ fontSize: 18, color: "#9ca3af" }}>→</span>
</Link>



          {/* Tabs */}
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 10, padding: 3 }}>
            <button onClick={() => setActiveTab("active")} style={{
              flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              background: activeTab === "active" ? "#fff" : "transparent",
              color: activeTab === "active" ? "#16a34a" : "#6b7280",
              boxShadow: activeTab === "active" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              fontFamily: "sans-serif",
            }}>
              {lang === "bn" ? "সক্রিয়" : "Active"}
            </button>
            <button onClick={() => setActiveTab("requests")} style={{
              flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              background: activeTab === "requests" ? "#fff" : "transparent",
              color: activeTab === "requests" ? "#16a34a" : "#6b7280",
              boxShadow: activeTab === "requests" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              fontFamily: "sans-serif",
            }}>
              {lang === "bn" ? "Requests" : "Requests"}
            </button>
          </div>
        </div>

        {/* Active Prescriptions */}
        {activeTab === "active" && (
          <div style={{ padding: "12px 16px" }}>
            {prescriptions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  {lang === "bn" ? "কোনো prescription নেই" : "No prescriptions found"}
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
                  {lang === "bn" ? "উপরের scan button দিয়ে prescription যোগ করুন" : "Add prescription using scan button above"}
                </div>
                <Link href="/customer/prescription/upload" style={{
                  display: "inline-block", padding: "10px 20px",
                  background: "#16a34a", color: "white", borderRadius: 10,
                  textDecoration: "none", fontSize: 14, fontWeight: 600,
                }}>
                  {lang === "bn" ? "+ Prescription যোগ করুন" : "+ Add Prescription"}
                </Link>
              </div>
            ) : (
              prescriptions.map((rx: any, i: number) => (
                <Link key={i} href={`/customer/prescription/${rx.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
                    marginBottom: 10, overflow: "hidden",
                  }}>
                    <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👨‍⚕️</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                            {rx.doctor || (lang === "bn" ? "ডাক্তার অজানা" : "Unknown Doctor")}
                          </div>
                          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
                            {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString("bn-BD") : ""}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "4px 10px",
                        borderRadius: 100, background: "#dcfce7", color: "#15803d",
                      }}>
                        {lang === "bn" ? "সক্রিয়" : "Active"}
                      </span>
                    </div>
                    <div style={{ padding: "10px 16px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {rx.medicines?.slice(0, 3).map((m: any, j: number) => (
                        <span key={j} style={{
                          fontSize: 12, fontWeight: 600, padding: "4px 10px",
                          background: "#f0fdf4", color: "#15803d",
                          borderRadius: 8, border: "1px solid #bbf7d0",
                        }}>
                          {m.medicine?.name || m.medicineName || "Medicine"}
                        </span>
                      ))}
                      {rx.medicines?.length > 3 && (
                        <span style={{ fontSize: 12, color: "#6b7280", padding: "4px 6px" }}>
                          +{rx.medicines.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Prescription Requests */}
        {activeTab === "requests" && (
          <div style={{ padding: "12px 16px" }}>

            {/* New Request Button */}
            <Link href="/customer/prescription/upload" style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#fff", borderRadius: 14, border: "2px dashed #bbf7d0",
              padding: "14px 16px", textDecoration: "none", marginBottom: 14,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>➕</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>
                  {lang === "bn" ? "নতুন Request করুন" : "New Request"}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>
                  {lang === "bn" ? "Prescription upload করে ফার্মেসিতে পাঠান" : "Upload prescription and send to pharmacy"}
                </div>
              </div>
            </Link>

            {/* Request Status Cards */}
            {prescriptions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📨</div>
                <div style={{ fontSize: 14, color: "#6b7280" }}>
                  {lang === "bn" ? "কোনো request নেই" : "No requests yet"}
                </div>
              </div>
            ) : (
              prescriptions.map((rx: any, i: number) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
                  marginBottom: 10, padding: "14px 16px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📋</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                          {rx.doctor || (lang === "bn" ? "Prescription" : "Prescription")}
                        </div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
                          {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString("bn-BD") : ""}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100,
                      background: "#fffbeb", color: "#f59e0b",
                    }}>
                      {lang === "bn" ? "Pending" : "Pending"}
                    </span>
                  </div>

                  {/* Status Progress */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {[
                      { label: lang === "bn" ? "পাঠানো" : "Sent", done: true },
                      { label: lang === "bn" ? "Processing" : "Processing", done: false },
                      { label: lang === "bn" ? "Ready" : "Ready", done: false },
                      { label: lang === "bn" ? "Collected" : "Collected", done: false },
                    ].map((step, j) => (
                      <div key={j} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{
                          width: "100%", height: 4, borderRadius: 2,
                          background: step.done ? "#16a34a" : "#e5e7eb",
                        }} />
                        <div style={{ fontSize: 9, color: step.done ? "#16a34a" : "#9ca3af", fontWeight: 600, textAlign: "center" }}>
                          {step.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div style={{ height: 90 }} />
      </div>

      {/* ── DESKTOP ── */}
      <div className="rx-desktop">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
              {lang === "bn" ? "Prescription ব্যবস্থাপনা" : "Prescription Management"}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              {lang === "bn" ? "আপনার সব prescription এক জায়গায়" : "All your prescriptions in one place"}
            </div>
          </div>
          <Link href="/customer/prescription/upload" style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#16a34a", color: "white", padding: "10px 18px",
            borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 600,
          }}>
            <span>📸</span>
            {lang === "bn" ? "Prescription Scan করুন" : "Scan Prescription"}
          </Link>
        </div>

{/* Medicine Encyclopedia */}
<Link href="/customer/medicines" style={{
  display: "flex", alignItems: "center", gap: 12,
  background: "#eff6ff", borderRadius: 12, border: "1px solid #bfdbfe",
  padding: "12px 16px", textDecoration: "none", marginBottom: 20,
}}>
  <span style={{ fontSize: 22 }}>📚</span>
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: 14, fontWeight: 700, color: "#1d4ed8" }}>
      {lang === "bn" ? "ওষুধের তথ্যভাণ্ডার" : "Medicine Encyclopedia"}
    </div>
    <div style={{ fontSize: 12, color: "#3b82f6", marginTop: 1 }}>
      {lang === "bn" ? "যেকোনো ওষুধের তথ্য বাংলায় জানুন" : "Learn about any medicine in Bengali"}
    </div>
  </div>
  <span style={{ fontSize: 16, color: "#3b82f6" }}>→</span>
</Link>



        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#f3f4f6", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {[
            { key: "active", labelBn: "সক্রিয় Prescription", labelEn: "Active Prescriptions" },
            { key: "requests", labelBn: "Pharmacy Requests", labelEn: "Pharmacy Requests" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: "sans-serif",
              background: activeTab === tab.key ? "#fff" : "transparent",
              color: activeTab === tab.key ? "#16a34a" : "#6b7280",
              boxShadow: activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}>
              {lang === "bn" ? tab.labelBn : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        {activeTab === "active" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {prescriptions.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  {lang === "bn" ? "কোনো prescription নেই" : "No prescriptions found"}
                </div>
                <Link href="/customer/prescription/upload" style={{
                  display: "inline-block", marginTop: 8, padding: "10px 20px",
                  background: "#16a34a", color: "white", borderRadius: 10,
                  textDecoration: "none", fontSize: 14, fontWeight: 600,
                }}>
                  {lang === "bn" ? "+ Prescription যোগ করুন" : "+ Add Prescription"}
                </Link>
              </div>
            ) : (
              prescriptions.map((rx: any, i: number) => (
                <Link key={i} href={`/customer/prescription/${rx.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", transition: "box-shadow 0.2s" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👨‍⚕️</div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                            {rx.doctor || (lang === "bn" ? "ডাক্তার অজানা" : "Unknown Doctor")}
                          </div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                            {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString("bn-BD") : ""}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100, background: "#dcfce7", color: "#15803d" }}>
                        {lang === "bn" ? "সক্রিয়" : "Active"}
                      </span>
                    </div>
                    <div style={{ padding: "12px 20px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {rx.medicines?.slice(0, 4).map((m: any, j: number) => (
                        <span key={j} style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", background: "#f0fdf4", color: "#15803d", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                          {m.medicine?.name || m.medicineName || "Medicine"}
                        </span>
                      ))}
                      {rx.medicines?.length > 4 && (
                        <span style={{ fontSize: 12, color: "#6b7280", padding: "4px 6px" }}>+{rx.medicines.length - 4}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <Link href="/customer/prescription/upload" style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#f0fdf4", color: "#16a34a", padding: "9px 16px",
                borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 600,
                border: "1px solid #bbf7d0",
              }}>
                ➕ {lang === "bn" ? "নতুন Request" : "New Request"}
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {prescriptions.length === 0 ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📨</div>
                  <div style={{ fontSize: 16, color: "#6b7280" }}>
                    {lang === "bn" ? "কোনো request নেই" : "No requests yet"}
                  </div>
                </div>
              ) : (
                prescriptions.map((rx: any, i: number) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📋</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                            {rx.doctor || "Prescription"}
                          </div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                            {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString("bn-BD") : ""}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100, background: "#fffbeb", color: "#f59e0b" }}>
                        Pending
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[
                        { label: lang === "bn" ? "পাঠানো" : "Sent", done: true },
                        { label: "Processing", done: false },
                        { label: "Ready", done: false },
                        { label: "Collected", done: false },
                      ].map((step, j) => (
                        <div key={j} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{ width: "100%", height: 5, borderRadius: 3, background: step.done ? "#16a34a" : "#e5e7eb" }} />
                          <div style={{ fontSize: 10, color: step.done ? "#16a34a" : "#9ca3af", fontWeight: 600 }}>{step.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .rx-mobile { display: none; }
        .rx-desktop { display: block; }
        @media (max-width: 768px) {
          .rx-mobile { display: block; }
          .rx-desktop { display: none; }
        }
      `}</style>
    </div>
  );
}