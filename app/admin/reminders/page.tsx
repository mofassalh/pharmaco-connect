"use client";
import { useEffect, useState } from "react";

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

export default function AdminPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("SUBMITTED");
  const [selected, setSelected] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

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
    <div style={{ fontFamily: "sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", margin: 0 }}>📋 Prescriptions</h1>
        <div style={{ fontSize: 13, color: "#718096" }}>মোট: {prescriptions.length} টি</div>
      </div>

      {/* Filter */}
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
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>
                      {p.customer?.fullName || "Unknown"}
                    </div>
                    <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>
                      {new Date(p.createdAt).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                    {p.doctorName && <div style={{ fontSize: 12, color: "#718096", marginTop: 2 }}>👨‍⚕️ {p.doctorName}</div>}
                    {p.hospitalName && <div style={{ fontSize: 12, color: "#718096" }}>🏥 {p.hospitalName}</div>}
                  </div>
                  <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, fontWeight: 600, background: statusBg[p.status], color: statusColor[p.status], height: "fit-content" }}>
                    {statusLabel[p.status]}
                  </span>
                </div>

                {/* Prescription Image */}
                {p.imageUrl && (
                  <a href={p.imageUrl} target="_blank" rel="noopener noreferrer">
                    <img src={p.imageUrl} alt="Prescription"
                      style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 8, border: "0.5px solid #e2e8f0", marginBottom: 10, cursor: "pointer" }} />
                  </a>
                )}

                {/* Medicines */}
                {p.medicines?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    {p.medicines.map((m: any, j: number) => (
                      <div key={j} style={{ fontSize: 12, color: "#4a5568", marginBottom: 3 }}>
                        💊 {m.medicineName} {m.dosage && `— ${m.dosage}`} {m.frequency && `· ${m.frequency}`}
                      </div>
                    ))}
                  </div>
                )}

                {p.customerNotes && (
                  <div style={{ background: "#f7f8fa", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#718096", marginBottom: 10 }}>
                    📝 {p.customerNotes}
                  </div>
                )}

                {/* Action Buttons */}
                {(p.status === "SUBMITTED" || p.status === "UNDER_REVIEW") && (
                  <div>
                    {selected?.id === p.id ? (
                      <div>
                        <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
                          placeholder="Admin notes (optional)"
                          rows={2}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}