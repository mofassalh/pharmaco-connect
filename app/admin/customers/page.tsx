"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "../layout-component";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/customers").then(r => r.json())
      .then(data => { setCustomers(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const filtered = customers.filter(c =>
    c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Customers" active="/admin/customers">
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="নাম বা email search করুন..."
        style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 14, boxSizing: "border-box" }} />
      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div> :
        filtered.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}><div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>কোনো customer নেই</div> :
        <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, overflow: "hidden" }}>
          {filtered.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < filtered.length - 1 ? "0.5px solid #f7fafc" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E6FFFA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#0D9488", flexShrink: 0 }}>
                {c.fullName?.[0] || "?"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#1a202c" }}>{c.fullName}</div>
                <div style={{ fontSize: 11, color: "#a0aec0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.user?.email}</div>
              </div>
              <div style={{ fontSize: 11, color: "#718096", flexShrink: 0 }}>{c.city || ""}</div>
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}