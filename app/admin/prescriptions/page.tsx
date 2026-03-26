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

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("SUBMITTED");

  useEffect(() => {
    fetch("/api/prescriptions").then(r => r.json())
      .then(data => { setPrescriptions(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const filtered = prescriptions.filter(p => filter === "ALL" || p.status === filter);

  return (
    <AdminLayout title="Prescriptions" active="/admin/prescriptions">
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["ALL", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 12px", borderRadius: 9, fontSize: 12, fontWeight: 500, border: "0.5px solid #e2e8f0", background: filter === s ? "#0D9488" : "#fff", color: filter === s ? "#fff" : "#4a5568", cursor: "pointer" }}>
            {s === "ALL" ? "সব" : statusLabel[s]}
          </button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div> :
        filtered.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}><div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>কোনো prescription নেই</div> :
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((p, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>{p.customer?.fullName || "Unknown"}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>{new Date(p.createdAt).toLocaleDateString("bn-BD")}</div>
                </div>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: statusBg[p.status], color: statusColor[p.status] }}>{statusLabel[p.status]}</span>
              </div>
              {p.medicines?.slice(0, 3).map((m: any, j: number) => (
                <div key={j} style={{ fontSize: 12, color: "#4a5568", marginBottom: 2 }}>💊 {m.medicineName} {m.dosage && `- ${m.dosage}`}</div>
              ))}
              {p.medicines?.length > 3 && <div style={{ fontSize: 11, color: "#a0aec0" }}>+{p.medicines.length - 3} আরো</div>}
              <button style={{ marginTop: 10, width: "100%", background: "#0D9488", color: "#fff", border: "none", padding: "9px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Review করুন
              </button>
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}