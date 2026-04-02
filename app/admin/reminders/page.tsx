"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "../layout-component";

export default function AdminRemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  const load = () => {
    fetch("/api/reminders").then(r => r.json())
      .then(data => { setReminders(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const markDone = async (id: string) => {
    await fetch(`/api/reminders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED" }),
    });
    load();
  };

  const filtered = reminders.filter(r => filter === "ALL" || r.status === filter);

  const counts = {
    ALL: reminders.length,
    PENDING: reminders.filter(r => r.status === "PENDING").length,
    COMPLETED: reminders.filter(r => r.status === "COMPLETED").length,
  };

  return (
    <AdminLayout title="Reminders" active="/admin/reminders">
      <div style={{ fontFamily: "sans-serif" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#718096" }}>মোট: {reminders.length} টি</div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["ALL", "PENDING", "COMPLETED"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: filter === s ? "#0D9488" : "#fff", color: filter === s ? "#fff" : "#4a5568", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              {s === "ALL" ? "সব" : s === "PENDING" ? "Pending" : "Done"} ({counts[s as keyof typeof counts] || 0})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
            <div style={{ color: "#a0aec0" }}>কোনো reminder নেই</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((r, i) => (
              <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>
                      {r.customer?.fullName || "Unknown"}
                    </div>
                    <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>
                      📞 {r.customer?.user?.phone || "Phone নেই"}
                    </div>
                    {r.medicineName && (
                      <div style={{ fontSize: 12, color: "#4a5568", marginTop: 4 }}>
                        💊 {r.medicineName}
                      </div>
                    )}
                    {r.notes && (
                      <div style={{ fontSize: 12, color: "#718096", marginTop: 4 }}>
                        📝 {r.notes}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 4 }}>
                      📅 {new Date(r.reminderDate || r.createdAt).toLocaleDateString("bn-BD")}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
                    background: r.status === "COMPLETED" ? "#F0FFF4" : "#FFFAF0",
                    color: r.status === "COMPLETED" ? "#276749" : "#B7791F"
                  }}>
                    {r.status === "COMPLETED" ? "✓ Done" : "Pending"}
                  </span>
                </div>

                {r.status === "PENDING" && (
                  <button onClick={() => markDone(r.id)}
                    style={{ width: "100%", background: "#0D9488", color: "#fff", border: "none", padding: "9px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    ✓ Call করা হয়েছে
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

