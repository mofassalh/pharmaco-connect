"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "../layout-component";

const statusColor: Record<string, string> = {
  PENDING: "#718096", SUBMITTED: "#2B6CB0", UNDER_REVIEW: "#B7791F",
  APPROVED: "#276749", REJECTED: "#C53030", FULFILLED: "#0D9488",
};
const statusBg: Record<string, string> = {
  PENDING: "#f7fafc", SUBMITTED: "#EBF8FF", UNDER_REVIEW: "#FFFAF0",
  APPROVED: "#F0FFF4", REJECTED: "#FFF5F5", FULFILLED: "#E6FFFA",
};
const statusLabel: Record<string, string> = {
  PENDING: "Pending", SUBMITTED: "Submitted", UNDER_REVIEW: "Review এ",
  APPROVED: "Approved", REJECTED: "Rejected", FULFILLED: "Fulfilled",
};

const CONDITIONS: Record<string, { label: string; bg: string; color: string; border: string }> = {
  "খালি পেটে":    { label: "🌿 খালি পেটে",    bg: "#F0FFF4", color: "#166534", border: "#BBF7D0" },
  "ভরা পেটে":    { label: "🍽️ ভরা পেটে",    bg: "#F7F0FF", color: "#6B21A8", border: "#E9D5FF" },
  "দুধের সাথে":  { label: "🥛 দুধের সাথে",  bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  "পানির সাথে":  { label: "💧 পানির সাথে",  bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  "চিবিয়ে খাবে": { label: "🍬 চিবিয়ে খাবে", bg: "#FDF4FF", color: "#7E22CE", border: "#E9D5FF" },
  "গিলে খাবে":   { label: "🚫 গিলে খাবে",   bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3" },
  "ঘুমানোর আগে": { label: "🛌 ঘুমানোর আগে", bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" },
  "প্রয়োজনে":   { label: "💊 প্রয়োজনে",   bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
};

function DoseCell({ value }: { value?: string }) {
  if (!value || value === "0") return <span style={{ color: "#d1d5db", fontSize: 16 }}>—</span>;
  return (
    <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: "#f0fdfa", color: "#0D9488", border: "0.5px solid #99F6E4" }}>
      {value}
    </span>
  );
}

export default function AdminPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("SUBMITTED");
  const [selected, setSelected] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    fetch("/api/prescriptions").then(r => r.json())
      .then(data => { setPrescriptions(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true);
    await fetch(`/api/prescriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes, reviewedAt: new Date().toISOString() }),
    });
    setSelected(null);
    setAdminNotes("");
    setUpdating(false);
    load();
  };

  const filtered = prescriptions.filter(p => filter === "ALL" || p.status === filter);

  const counts = {
    ALL: prescriptions.length,
    SUBMITTED: prescriptions.filter(p => p.status === "SUBMITTED").length,
    UNDER_REVIEW: prescriptions.filter(p => p.status === "UNDER_REVIEW").length,
    APPROVED: prescriptions.filter(p => p.status === "APPROVED").length,
    REJECTED: prescriptions.filter(p => p.status === "REJECTED").length,
  };

  return (
    <AdminLayout title="Prescriptions" active="/admin/prescriptions">
      <div style={{ fontFamily: "sans-serif" }}>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["ALL", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: filter === s ? "#0D9488" : "#fff", color: filter === s ? "#fff" : "#4a5568", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              {s === "ALL" ? "সব" : statusLabel[s]} ({counts[s as keyof typeof counts] || 0})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ color: "#a0aec0" }}>কোনো prescription নেই</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((p, i) => (
              <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, overflow: "hidden" }}>

                {/* Header */}
                <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "0.5px solid #f7fafc", cursor: "pointer" }}
                  onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>{p.customer?.fullName || "Unknown"}</div>
                      <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>
                        {new Date(p.createdAt).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                        {p.doctorName && ` · ${p.doctorName}`}
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: "#a0aec0" }}>{p.medicines?.length || 0}টি medicine</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, fontWeight: 600, background: statusBg[p.status], color: statusColor[p.status] }}>
                      {statusLabel[p.status]}
                    </span>
                    <span style={{ color: "#a0aec0", fontSize: 12 }}>{expanded === p.id ? "▲" : "▼"}</span>
                  </div>
                </div>

                {expanded === p.id && (
                  <div style={{ padding: 16 }}>
                    {/* Image */}
                    {p.imageUrl && (
                      <a href={p.imageUrl} target="_blank" rel="noopener noreferrer">
                        <img src={p.imageUrl} alt="Prescription"
                          style={{ width: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 8, border: "0.5px solid #e2e8f0", marginBottom: 14, cursor: "pointer" }} />
                      </a>
                    )}

                    {/* Medicine Table */}
                    {p.medicines?.length > 0 && (
                      <div style={{ border: "0.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                          <thead>
                            <tr style={{ background: "#f8fafc" }}>
                              <th style={{ padding: "10px 12px", textAlign: "left", color: "#718096", fontWeight: 600, borderBottom: "0.5px solid #e2e8f0" }}>💊 Medicine</th>
                              <th style={{ padding: "10px 8px", textAlign: "center", color: "#C2410C", fontWeight: 600, borderBottom: "0.5px solid #e2e8f0" }}>🌅 সকাল</th>
                              <th style={{ padding: "10px 8px", textAlign: "center", color: "#1D4ED8", fontWeight: 600, borderBottom: "0.5px solid #e2e8f0" }}>☀️ দুপুর</th>
                              <th style={{ padding: "10px 8px", textAlign: "center", color: "#C2410C", fontWeight: 600, borderBottom: "0.5px solid #e2e8f0" }}>🌆 বিকাল</th>
                              <th style={{ padding: "10px 8px", textAlign: "center", color: "#4338CA", fontWeight: 600, borderBottom: "0.5px solid #e2e8f0" }}>🌙 রাত</th>
                              <th style={{ padding: "10px 8px", textAlign: "center", color: "#718096", fontWeight: 600, borderBottom: "0.5px solid #e2e8f0" }}>নিয়ম</th>
                            </tr>
                          </thead>
                          <tbody>
                            {p.medicines.map((m: any, j: number) => (
                              <tr key={j} style={{ borderBottom: "0.5px solid #f7fafc" }}>
                                <td style={{ padding: "12px" }}>
                                  <div style={{ fontWeight: 600, color: "#1a202c" }}>{m.medicineName}</div>
                                  {m.dosage && <div style={{ fontSize: 11, color: "#a0aec0" }}>{m.dosage}</div>}
                                  {m.duration && <div style={{ fontSize: 11, color: "#a0aec0" }}>{m.duration}</div>}
                                </td>
                                <td style={{ padding: "12px", textAlign: "center" }}><DoseCell value={m.morning} /></td>
                                <td style={{ padding: "12px", textAlign: "center" }}><DoseCell value={m.noon} /></td>
                                <td style={{ padding: "12px", textAlign: "center" }}><DoseCell value={m.evening} /></td>
                                <td style={{ padding: "12px", textAlign: "center" }}><DoseCell value={m.night} /></td>
                                <td style={{ padding: "12px", textAlign: "center" }}>
                                  {m.condition && CONDITIONS[m.condition] ? (
                                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: CONDITIONS[m.condition].bg, color: CONDITIONS[m.condition].color, border: `0.5px solid ${CONDITIONS[m.condition].border}` }}>
                                      {CONDITIONS[m.condition].label}
                                    </span>
                                  ) : m.condition ? (
                                    <span style={{ fontSize: 11, color: "#718096" }}>{m.condition}</span>
                                  ) : <span style={{ color: "#d1d5db" }}>—</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {p.customerNotes && (
                      <div style={{ background: "#FFFBEB", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#92400E", marginBottom: 12 }}>
                        📝 {p.customerNotes}
                      </div>
                    )}

                    {(p.status === "SUBMITTED" || p.status === "UNDER_REVIEW") && (
                      <div>
                        {selected?.id === p.id ? (
                          <div>
                            <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
                              placeholder="Admin notes (optional)" rows={2}
                              style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 13, boxSizing: "border-box", resize: "none", marginBottom: 8 }} />
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => updateStatus(p.id, "APPROVED")} disabled={updating}
                                style={{ flex: 1, background: "#276749", color: "#fff", border: "none", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                ✓ Approve
                              </button>
                              <button onClick={() => updateStatus(p.id, "REJECTED")} disabled={updating}
                                style={{ flex: 1, background: "#FFF5F5", color: "#C53030", border: "0.5px solid #FEB2B2", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                ✗ Reject
                              </button>
                              <button onClick={() => updateStatus(p.id, "UNDER_REVIEW")} disabled={updating}
                                style={{ padding: "10px 14px", background: "#FFFAF0", color: "#B7791F", border: "0.5px solid #F6AD55", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                                Review এ নিন
                              </button>
                              <button onClick={() => setSelected(null)}
                                style={{ padding: "10px 14px", background: "#fff", color: "#718096", border: "0.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                                বাতিল
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setSelected(p)}
                            style={{ width: "100%", background: "#0D9488", color: "#fff", border: "none", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                            Review করুন
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
