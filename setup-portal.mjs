import fs from "fs";
import path from "path";

const files = {

"app/admin/dashboard/page.tsx": `"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingPrescriptions: 0,
    todayOrders: 0,
    lowStockItems: 0,
    totalDue: 0,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">💊</span>
          </div>
          <div>
            <span className="font-bold text-gray-900">Pharmaco Connect</span>
            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>
        <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}
          className="text-sm text-red-500 hover:text-red-700">Logout</button>
      </div>
      <div className="flex">
        <div className="w-56 bg-white border-r min-h-screen p-4">
          {[
            { href: "/admin/dashboard", icon: "🏠", label: "Dashboard" },
            { href: "/admin/prescriptions", icon: "📋", label: "Prescriptions" },
            { href: "/admin/inventory", icon: "📦", label: "Inventory" },
            { href: "/admin/orders", icon: "🛒", label: "Orders" },
            { href: "/admin/payments", icon: "💳", label: "Payments" },
            { href: "/admin/customers", icon: "👥", label: "Customers" },
            { href: "/admin/reminders", icon: "🔔", label: "Reminders" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition mb-1 text-gray-600 hover:text-gray-900">
              <span>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: "📋", label: "Pending Prescription", value: "0", color: "bg-amber-50 text-amber-600" },
              { icon: "📦", label: "আজকের Orders", value: "0", color: "bg-blue-50 text-blue-600" },
              { icon: "⚠️", label: "Low Stock", value: "0", color: "bg-red-50 text-red-500" },
              { icon: "💰", label: "মোট Due", value: "৳০", color: "bg-red-50 text-red-500" },
              { icon: "💵", label: "আজকের Revenue", value: "৳০", color: "bg-green-50 text-green-600" },
              { icon: "🚚", label: "Pending Delivery", value: "0", color: "bg-purple-50 text-purple-600" },
            ].map((s, i) => (
              <div key={i} className={\`rounded-2xl p-5 \${s.color.split(" ")[0]}\`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{s.icon}</span>
                  <span className={\`text-2xl font-bold \${s.color.split(" ")[1]}\`}>{s.value}</span>
                </div>
                <div className="text-sm text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/prescriptions" className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-300 transition">
              <div className="text-3xl mb-3">📋</div>
              <div className="font-bold text-gray-900">Prescriptions Review</div>
              <div className="text-sm text-gray-500 mt-1">Customer দের prescription দেখুন ও approve করুন</div>
            </Link>
            <Link href="/admin/inventory" className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-300 transition">
              <div className="text-3xl mb-3">📦</div>
              <div className="font-bold text-gray-900">Inventory</div>
              <div className="text-sm text-gray-500 mt-1">Medicine stock manage করুন</div>
            </Link>
            <Link href="/admin/orders" className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-300 transition">
              <div className="text-3xl mb-3">🛒</div>
              <div className="font-bold text-gray-900">Orders</div>
              <div className="text-sm text-gray-500 mt-1">Order status change করুন</div>
            </Link>
            <Link href="/admin/payments" className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-300 transition">
              <div className="text-3xl mb-3">💳</div>
              <div className="font-bold text-gray-900">Payments & Due</div>
              <div className="text-sm text-gray-500 mt-1">Payment receive ও due track করুন</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}`,

"app/admin/prescriptions/page.tsx": `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const statusColor: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  SUBMITTED: "bg-blue-50 text-blue-600",
  UNDER_REVIEW: "bg-amber-50 text-amber-600",
  APPROVED: "bg-green-50 text-green-600",
  REJECTED: "bg-red-50 text-red-600",
  FULFILLED: "bg-teal-50 text-teal-600",
};
const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Review এ",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  FULFILLED: "Fulfilled",
};

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("SUBMITTED");

  useEffect(() => {
    fetch("/api/prescriptions")
      .then(r => r.json())
      .then(data => { setPrescriptions(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const filtered = prescriptions.filter(p => filter === "ALL" || p.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Prescriptions</span>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL","SUBMITTED","UNDER_REVIEW","APPROVED","REJECTED"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={\`px-4 py-2 rounded-xl text-sm font-medium transition \${filter === s ? "bg-teal-500 text-white" : "bg-white border border-gray-200 text-gray-600"}\`}>
              {s === "ALL" ? "সব" : statusLabel[s]}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <div>কোনো prescription নেই</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{p.customer?.fullName || "Unknown"}</div>
                    <div className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString("bn-BD")}</div>
                  </div>
                  <span className={\`text-xs px-3 py-1 rounded-full font-medium \${statusColor[p.status]}\`}>
                    {statusLabel[p.status]}
                  </span>
                </div>
                {p.medicines?.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {p.medicines.slice(0, 3).map((m: any, j: number) => (
                      <div key={j} className="text-sm text-gray-600">💊 {m.medicineName} {m.dosage && \`- \${m.dosage}\`}</div>
                    ))}
                    {p.medicines.length > 3 && <div className="text-xs text-gray-400">+{p.medicines.length - 3} আরো</div>}
                  </div>
                )}
                <div className="flex gap-2">
                  <Link href={\`/admin/prescriptions/\${p.id}\`}
                    className="flex-1 bg-teal-500 text-white py-2 rounded-xl text-sm font-medium text-center hover:bg-teal-600 transition">
                    Review করুন
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}`,

"app/admin/orders/page.tsx": `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const statusColor: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  CONFIRMED: "bg-blue-50 text-blue-600",
  PROCESSING: "bg-amber-50 text-amber-600",
  OUT_FOR_DELIVERY: "bg-purple-50 text-purple-600",
  DELIVERED: "bg-green-50 text-green-600",
  CANCELLED: "bg-red-50 text-red-600",
};
const statusLabel: Record<string, string> = {
  PENDING: "অপেক্ষায়",
  CONFIRMED: "নিশ্চিত",
  PROCESSING: "প্রস্তুত হচ্ছে",
  OUT_FOR_DELIVERY: "রাস্তায়",
  DELIVERED: "পৌঁছেছে",
  CANCELLED: "বাতিল",
};
const nextStatus: Record<string, string> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PROCESSING",
  PROCESSING: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};
const nextLabel: Record<string, string> = {
  PENDING: "✓ Confirm",
  CONFIRMED: "Pack করুন",
  PROCESSING: "Delivery তে দিন",
  OUT_FOR_DELIVERY: "Delivered ✓",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  const loadOrders = () => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(\`/api/orders/\${orderId}/status\`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, changedBy: "admin" }),
    });
    loadOrders();
  };

  const filtered = orders.filter(o => filter === "ALL" || o.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Orders</span>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL","PENDING","CONFIRMED","PROCESSING","OUT_FOR_DELIVERY","DELIVERED"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={\`px-4 py-2 rounded-xl text-sm font-medium transition \${filter === s ? "bg-teal-500 text-white" : "bg-white border border-gray-200 text-gray-600"}\`}>
              {s === "ALL" ? "সব" : statusLabel[s] || s}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🛒</div>
            <div>কোনো order নেই</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((o, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{o.customer?.user?.email || "Unknown"}</div>
                    <div className="text-xs text-gray-400 font-mono">{o.orderNumber}</div>
                  </div>
                  <div className="text-right">
                    <span className={\`text-xs px-3 py-1 rounded-full font-medium \${statusColor[o.status]}\`}>
                      {statusLabel[o.status]}
                    </span>
                    <div className="text-lg font-bold text-gray-900 mt-1">৳{Number(o.totalAmount).toFixed(0)}</div>
                  </div>
                </div>
                {o.dueAmount > 0 && (
                  <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-3">
                    ⚠️ বাকি: ৳{Number(o.dueAmount).toFixed(0)}
                  </div>
                )}
                <div className="flex gap-2">
                  {nextStatus[o.status] && (
                    <button onClick={() => updateStatus(o.id, nextStatus[o.status])}
                      className="flex-1 bg-teal-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-teal-600 transition">
                      {nextLabel[o.status]}
                    </button>
                  )}
                  {o.status === "DELIVERED" && o.dueAmount > 0 && (
                    <Link href={\`/admin/payments?orderId=\${o.id}\`}
                      className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-medium text-center hover:bg-green-600 transition">
                      💳 Payment নিন
                    </Link>
                  )}
                  {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                    <button onClick={() => updateStatus(o.id, "CANCELLED")}
                      className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 transition">
                      বাতিল
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}`,

"app/admin/payments/page.tsx": `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [saving, setSaving] = useState(false);

  const loadDueOrders = () => {
    fetch("/api/orders?due=true")
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data.filter((o: any) => o.dueAmount > 0) : []); setLoading(false); });
  };

  useEffect(() => { loadDueOrders(); }, []);

  const handlePayment = async () => {
    if (!selectedOrder || !amount) return;
    setSaving(true);
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: selectedOrder.id,
        customerId: selectedOrder.customerId,
        amount: parseFloat(amount),
        method,
        status: "COMPLETED",
        receivedBy: "admin",
        receivedAt: new Date().toISOString(),
      }),
    });
    setSelectedOrder(null);
    setAmount("");
    setSaving(false);
    loadDueOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Payments & Due</span>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">✅</div>
            <div className="text-gray-500">কোনো due নেই!</div>
          </div>
        ) : (
          orders.map((o, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-bold text-gray-900">{o.customer?.user?.email}</div>
                  <div className="text-xs text-gray-400 font-mono">{o.orderNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">বাকি</div>
                  <div className="text-xl font-bold text-red-500">৳{Number(o.dueAmount).toFixed(0)}</div>
                </div>
              </div>
              {selectedOrder?.id === o.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {["CASH","BKASH","NAGAD","ROCKET"].map(m => (
                      <button key={m} onClick={() => setMethod(m)}
                        className={\`py-2 rounded-xl border-2 text-sm font-medium transition \${method === m ? "border-teal-400 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600"}\`}>
                        {m}
                      </button>
                    ))}
                  </div>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder={\`Amount (বাকি: ৳\${Number(o.dueAmount).toFixed(0)})\`}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                  <div className="flex gap-2">
                    <button onClick={handlePayment} disabled={saving}
                      className="flex-1 bg-teal-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-teal-600 disabled:opacity-50 transition">
                      {saving ? "Save হচ্ছে..." : "✓ Payment নিন"}
                    </button>
                    <button onClick={() => setSelectedOrder(null)}
                      className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setSelectedOrder(o); setAmount(Number(o.dueAmount).toFixed(0)); }}
                  className="w-full bg-green-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 transition">
                  💳 Payment নিন
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}`,

"app/admin/customers/page.tsx": `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/customers")
      .then(r => r.json())
      .then(data => { setCustomers(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const filtered = customers.filter(c =>
    c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Customers</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-6">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="নাম বা email search করুন..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-teal-400" />
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">👥</div>
            <div>কোনো customer নেই</div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {filtered.map((c, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                  {c.fullName?.[0] || "?"}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{c.fullName}</div>
                  <div className="text-xs text-gray-400">{c.user?.email} · {c.user?.phone || "Phone নেই"}</div>
                </div>
                <div className="text-xs text-gray-400">{c.city || "ঠিকানা নেই"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}`,

"app/admin/reminders/page.tsx": `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  CALLED: "bg-blue-50 text-blue-600",
  CONFIRMED: "bg-green-50 text-green-600",
  DECLINED: "bg-red-50 text-red-600",
  ORDER_CREATED: "bg-teal-50 text-teal-600",
  COMPLETED: "bg-gray-100 text-gray-500",
};

export default function AdminRemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/reminders")
      .then(r => r.json())
      .then(data => { setReminders(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string, notes?: string) => {
    await fetch(\`/api/reminders/\${id}\`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, callNotes: notes }),
    });
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Reminders</span>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔔</div>
            <div className="text-gray-500">কোনো reminder নেই</div>
          </div>
        ) : (
          reminders.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-bold text-gray-900">{r.customer?.fullName}</div>
                  <div className="text-xs text-gray-400">{r.regularMedicine?.medicineName || r.type}</div>
                  <div className="text-xs text-gray-400">Due: {new Date(r.dueDate).toLocaleDateString("bn-BD")}</div>
                </div>
                <span className={\`text-xs px-3 py-1 rounded-full font-medium \${statusColor[r.status]}\`}>
                  {r.status}
                </span>
              </div>
              {r.status === "PENDING" && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(r.id, "CALLED")}
                    className="flex-1 bg-teal-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-teal-600 transition">
                    📞 Call করলাম
                  </button>
                </div>
              )}
              {r.status === "CALLED" && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(r.id, "CONFIRMED")}
                    className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition">
                    ✓ Confirmed
                  </button>
                  <button onClick={() => updateStatus(r.id, "DECLINED")}
                    className="flex-1 border border-red-200 text-red-500 py-2 rounded-xl text-sm hover:bg-red-50 transition">
                    ✗ Declined
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log("✅ Created:", filePath);
}

console.log("\n🎉 Admin Panel সব pages তৈরি হয়ে গেছে!");

