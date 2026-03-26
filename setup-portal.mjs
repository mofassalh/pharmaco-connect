import fs from "fs";
import path from "path";

const adminLayout = `"use client";
import Link from "next/link";
import { useState } from "react";

const menuItems = [
  { href: "/admin/dashboard", icon: "⊞", label: "Dashboard" },
  { href: "/admin/prescriptions", icon: "📋", label: "Prescriptions" },
  { href: "/admin/inventory", icon: "📦", label: "Inventory" },
  { href: "/admin/orders", icon: "🛒", label: "Orders" },
  { href: "/admin/payments", icon: "💳", label: "Payments" },
  { href: "/admin/customers", icon: "👥", label: "Customers" },
  { href: "/admin/reminders", icon: "🔔", label: "Reminders" },
];

export function AdminLayout({ children, title, active }: { children: React.ReactNode; title: string; active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ minHeight: "100vh", background: "#efefef", fontFamily: "sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 4, color: "#4a5568" }}>☰</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, background: "#0D9488", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14 }}>💊</div>
            <span style={{ fontWeight: 700, color: "#1a202c", fontSize: 14 }}>Pharmaco Connect</span>
            <span style={{ background: "#EDE9FE", color: "#6D28D9", fontSize: 10, padding: "2px 6px", borderRadius: 20, fontWeight: 600 }}>Admin</span>
          </div>
        </div>
        <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}
          style={{ fontSize: 12, color: "#E53E3E", background: "none", border: "0.5px solid #FEB2B2", padding: "5px 10px", borderRadius: 7, cursor: "pointer" }}>
          Logout
        </button>
      </div>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 90 }} />}
      <div style={{ position: "fixed", top: 52, left: 0, bottom: 0, width: 220, background: "#fff", borderRight: "0.5px solid #e2e8f0", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease", zIndex: 95, overflowY: "auto" }}>
        <div style={{ padding: "10px 8px" }}>
          {menuItems.map((item, i) => (
            <Link key={i} href={item.href} onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderRadius: 9, marginBottom: 2, color: item.href === active ? "#0D9488" : "#4a5568", background: item.href === active ? "#F0FDF4" : "transparent", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Link href="/admin/dashboard" style={{ color: "#a0aec0", textDecoration: "none", fontSize: 18 }}>←</Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c" }}>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}`;

const files = {
"app/admin/layout-component.tsx": adminLayout,

"app/admin/prescriptions/page.tsx": `"use client";
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
                <div key={j} style={{ fontSize: 12, color: "#4a5568", marginBottom: 2 }}>💊 {m.medicineName} {m.dosage && \`- \${m.dosage}\`}</div>
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
}`,

"app/admin/orders/page.tsx": `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "../layout-component";

const statusColor: Record<string, string> = { PENDING: "#718096", CONFIRMED: "#2B6CB0", PROCESSING: "#B7791F", OUT_FOR_DELIVERY: "#6B46C1", DELIVERED: "#276749", CANCELLED: "#C53030" };
const statusBg: Record<string, string> = { PENDING: "#f7fafc", CONFIRMED: "#EBF8FF", PROCESSING: "#FFFAF0", OUT_FOR_DELIVERY: "#FAF5FF", DELIVERED: "#F0FFF4", CANCELLED: "#FFF5F5" };
const statusLabel: Record<string, string> = { PENDING: "অপেক্ষায়", CONFIRMED: "নিশ্চিত", PROCESSING: "প্রস্তুত হচ্ছে", OUT_FOR_DELIVERY: "রাস্তায়", DELIVERED: "পৌঁছেছে", CANCELLED: "বাতিল" };
const nextStatus: Record<string, string> = { PENDING: "CONFIRMED", CONFIRMED: "PROCESSING", PROCESSING: "OUT_FOR_DELIVERY", OUT_FOR_DELIVERY: "DELIVERED" };
const nextLabel: Record<string, string> = { PENDING: "✓ Confirm", CONFIRMED: "Pack করুন", PROCESSING: "Delivery তে দিন", OUT_FOR_DELIVERY: "Delivered ✓" };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  const load = () => {
    fetch("/api/orders").then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(\`/api/orders/\${id}/status\`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, changedBy: "admin" }) });
    load();
  };

  const filtered = orders.filter(o => filter === "ALL" || o.status === filter);

  return (
    <AdminLayout title="Orders" active="/admin/orders">
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["ALL", "PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 12px", borderRadius: 9, fontSize: 12, fontWeight: 500, border: "0.5px solid #e2e8f0", background: filter === s ? "#0D9488" : "#fff", color: filter === s ? "#fff" : "#4a5568", cursor: "pointer" }}>
            {s === "ALL" ? "সব" : statusLabel[s] || s}
          </button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div> :
        filtered.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}><div style={{ fontSize: 32, marginBottom: 8 }}>🛒</div>কোনো order নেই</div> :
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((o, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>{o.customer?.user?.email || "Unknown"}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0", fontFamily: "monospace" }}>{o.orderNumber}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: statusBg[o.status], color: statusColor[o.status] }}>{statusLabel[o.status]}</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1a202c", marginTop: 4 }}>৳{Number(o.totalAmount).toFixed(0)}</div>
                </div>
              </div>
              {o.dueAmount > 0 && <div style={{ background: "#FFF5F5", color: "#C53030", fontSize: 12, padding: "6px 10px", borderRadius: 8, marginBottom: 8 }}>⚠️ বাকি: ৳{Number(o.dueAmount).toFixed(0)}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                {nextStatus[o.status] && (
                  <button onClick={() => updateStatus(o.id, nextStatus[o.status])} style={{ flex: 1, background: "#0D9488", color: "#fff", border: "none", padding: "9px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {nextLabel[o.status]}
                  </button>
                )}
                {o.status === "DELIVERED" && o.dueAmount > 0 && (
                  <Link href={\`/admin/payments\`} style={{ flex: 1, background: "#38A169", color: "#fff", padding: "9px", borderRadius: 9, fontSize: 13, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>
                    💳 Payment
                  </Link>
                )}
                {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                  <button onClick={() => updateStatus(o.id, "CANCELLED")} style={{ padding: "9px 14px", border: "0.5px solid #FEB2B2", color: "#E53E3E", background: "#fff", borderRadius: 9, fontSize: 13, cursor: "pointer" }}>
                    বাতিল
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}`,

"app/admin/payments/page.tsx": `"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "../layout-component";

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/orders?due=true").then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data.filter((o: any) => Number(o.dueAmount) > 0) : []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const handlePayment = async () => {
    if (!selectedOrder || !amount) return;
    setSaving(true);
    await fetch("/api/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: selectedOrder.id, customerId: selectedOrder.customerId, amount: parseFloat(amount), method, status: "COMPLETED", receivedBy: "admin", receivedAt: new Date().toISOString() }) });
    setSelectedOrder(null); setAmount(""); setSaving(false); load();
  };

  return (
    <AdminLayout title="Payments & Due" active="/admin/payments">
      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div> :
        orders.length === 0 ? <div style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 32, marginBottom: 8 }}>✅</div><div style={{ color: "#a0aec0" }}>কোনো due নেই!</div></div> :
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((o, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>{o.customer?.user?.email}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0", fontFamily: "monospace" }}>{o.orderNumber}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#a0aec0" }}>বাকি</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#C53030" }}>৳{Number(o.dueAmount).toFixed(0)}</div>
                </div>
              </div>
              {selectedOrder?.id === o.id ? (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                    {["CASH", "BKASH", "NAGAD", "ROCKET"].map(m => (
                      <button key={m} onClick={() => setMethod(m)} style={{ padding: "9px", borderRadius: 9, fontSize: 13, fontWeight: 500, border: method === m ? "2px solid #0D9488" : "0.5px solid #e2e8f0", background: method === m ? "#E6FFFA" : "#fff", color: method === m ? "#0D9488" : "#4a5568", cursor: "pointer" }}>{m}</button>
                    ))}
                  </div>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={\`৳\${Number(o.dueAmount).toFixed(0)}\`}
                    style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 9, padding: "10px 14px", fontSize: 14, marginBottom: 10, boxSizing: "border-box" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handlePayment} disabled={saving} style={{ flex: 1, background: "#0D9488", color: "#fff", border: "none", padding: 10, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                      {saving ? "Save হচ্ছে..." : "✓ Payment নিন"}
                    </button>
                    <button onClick={() => setSelectedOrder(null)} style={{ padding: "10px 14px", border: "0.5px solid #e2e8f0", background: "#fff", borderRadius: 9, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setSelectedOrder(o); setAmount(Number(o.dueAmount).toFixed(0)); }} style={{ width: "100%", background: "#38A169", color: "#fff", border: "none", padding: 10, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  💳 Payment নিন
                </button>
              )}
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}`,

"app/admin/customers/page.tsx": `"use client";
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
}`,

"app/admin/reminders/page.tsx": `"use client";
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
    await fetch(\`/api/reminders/\${id}\`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
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
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log("✅ Created:", filePath);
}
console.log("\n🎉 Admin pages mobile responsive হয়ে গেছে!");

