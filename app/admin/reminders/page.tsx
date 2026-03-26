"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "../layout-component";

const statusColor: Record<string, string> = { PENDING: "#B7791F", CALLED: "#2B6CB0", CONFIRMED: "#276749", DECLINED: "#C53030", ORDER_CREATED: "#0D9488", COMPLETED: "#718096" };
const statusBg: Record<string, string> = { PENDING: "#FFFAF0", CALLED: "#EBF8FF", CONFIRMED: "#F0FFF4", DECLINED: "#FFF5F5", ORDER_CREATED: "#E6FFFA", COMPLETED: "#f7fafc" };

export default function AdminRemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/reminders").then(r => r.json())
      .then(data => { setReminders(Array.isArray(data) ? data : []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, status: string) => {
    await fetch(`/api/reminders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  return (
    <AdminLayout title="Reminders" active="/admin/reminders">
      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div> :
        reminders.length === 0 ? <div style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div><div style={{ color: "#a0aec0" }}>কোনো reminder নেই</div></div> :
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reminders.map((r, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>{r.customer?.fullName}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0" }}>{r.regularMedicine?.medicineName || r.type}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0" }}>Due: {new Date(r.dueDate).toLocaleDateString("bn-BD")}</div>
                </div>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: statusBg[r.status] || "#f7fafc", color: statusColor[r.status] || "#718096", height: "fit-content" }}>{r.status}</span>
              </div>
              {r.status === "PENDING" && (
                <button onClick={() => update(r.id, "CALLED")} style={{ width: "100%", background: "#0D9488", color: "#fff", border: "none", padding: 9, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📞 Call করলাম</button>
              )}
              {r.status === "CALLED" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => update(r.id, "CONFIRMED")} style={{ flex: 1, background: "#38A169", color: "#fff", border: "none", padding: 9, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✓ Confirmed</button>
                  <button onClick={() => update(r.id, "DECLINED")} style={{ flex: 1, border: "0.5px solid #FEB2B2", color: "#E53E3E", background: "#fff", padding: 9, borderRadius: 9, fontSize: 13, cursor: "pointer" }}>✗ Declined</button>
                </div>
              )}
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}