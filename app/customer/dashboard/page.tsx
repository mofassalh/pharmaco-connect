"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomerDashboard() {
  const [userName, setUserName] = useState("...");
  const [orders, setOrders] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [dueAmount, setDueAmount] = useState(0);

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(data => {
      if (data.name) setUserName(data.name);
    });
    fetch("/api/orders?my=1").then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        setOrders(data);
        const due = data.reduce((sum: number, o: any) => sum + Number(o.dueAmount || 0), 0);
        setDueAmount(due);
      }
    });
    fetch("/api/prescriptions/my").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setPrescriptions(data);
    });
  }, []);

  const activeOrders = orders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED").length;
  const today = new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });

  const statusLabel: Record<string, string> = {
    PENDING: "অপেক্ষায়", CONFIRMED: "নিশ্চিত", PROCESSING: "প্রস্তুত হচ্ছে",
    OUT_FOR_DELIVERY: "রাস্তায় আছে", DELIVERED: "পৌঁছে গেছে", CANCELLED: "বাতিল",
  };
  const statusBg: Record<string, string> = {
    PENDING: "#f7fafc", CONFIRMED: "#EBF8FF", PROCESSING: "#FFFAF0",
    OUT_FOR_DELIVERY: "#FAF5FF", DELIVERED: "#F0FFF4", CANCELLED: "#FFF5F5",
  };
  const statusColor: Record<string, string> = {
    PENDING: "#718096", CONFIRMED: "#2B6CB0", PROCESSING: "#B7791F",
    OUT_FOR_DELIVERY: "#6B46C1", DELIVERED: "#276749", CANCELLED: "#C53030",
  };

  return (
    <div style={{ fontFamily: "sans-serif", paddingBottom: 32 }}>

      {/* Welcome Banner */}
      <div style={{ background: "#0D9488", borderRadius: 16, padding: "20px 24px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, color: "#9FE1CB", marginBottom: 4 }}>স্বাগতম</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{userName.split(" ")[0]} 👋</div>
          <div style={{ fontSize: 12, color: "#9FE1CB" }}>আজকে {today}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#9FE1CB" }}>Active Orders</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginTop: 2 }}>{activeOrders}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { val: activeOrders, label: "Active Orders", bg: "#E6FFFA", color: "#0D9488" },
          { val: prescriptions.length, label: "Prescriptions", bg: "#EBF8FF", color: "#2B6CB0" },
          { val: orders.length, label: "মোট Orders", bg: "#FFFAF0", color: "#B7791F" },
          { val: "0", label: "Loyalty Points", bg: "#FAF5FF", color: "#6B46C1" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: 12, padding: "14px", border: "0.5px solid #e8ecf0" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#718096" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        <Link href="/customer/prescription/upload" style={{ background: "#0D9488", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 6, textDecoration: "none" }}>
          <span style={{ fontSize: 22 }}>📋</span>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Prescription</div>
          <div style={{ fontSize: 10, color: "#9FE1CB" }}>AI auto-fill</div>
        </Link>
        <Link href="/customer/shop" style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 6, textDecoration: "none" }}>
          <span style={{ fontSize: 22 }}>💊</span>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1a202c" }}>Medicine Shop</div>
          <div style={{ fontSize: 10, color: "#a0aec0" }}>Order করুন</div>
        </Link>
        <Link href="/customer/orders" style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 6, textDecoration: "none" }}>
          <span style={{ fontSize: 22 }}>📦</span>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1a202c" }}>My Orders</div>
          <div style={{ fontSize: 10, color: "#a0aec0" }}>Track করুন</div>
        </Link>
        <Link href="/customer/profile/refills" style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 6, textDecoration: "none" }}>
          <span style={{ fontSize: 22 }}>🔔</span>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1a202c" }}>Refill</div>
          <div style={{ fontSize: 10, color: "#a0aec0" }}>Reminder</div>
        </Link>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>

        {/* Recent Orders */}
        <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#1a202c" }}>সাম্প্রতিক Orders</span>
            <Link href="/customer/orders" style={{ fontSize: 12, color: "#0D9488", textDecoration: "none" }}>সব দেখুন</Link>
          </div>
          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#a0aec0", fontSize: 13 }}>কোনো order নেই</div>
          ) : (
            orders.slice(0, 3).map((o, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "0.5px solid #f7fafc" : "none" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a202c" }}>#{o.orderNumber?.slice(-6)}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0" }}>{new Date(o.createdAt).toLocaleDateString("bn-BD")}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0D9488" }}>৳{Number(o.totalAmount).toFixed(0)}</div>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600, background: statusBg[o.status] || "#f7fafc", color: statusColor[o.status] || "#718096" }}>
                    {statusLabel[o.status] || o.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Prescriptions */}
        <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#1a202c" }}>সাম্প্রতিক Prescriptions</span>
            <Link href="/customer/prescription" style={{ fontSize: 12, color: "#0D9488", textDecoration: "none" }}>সব দেখুন</Link>
          </div>
          {prescriptions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ color: "#a0aec0", fontSize: 13, marginBottom: 12 }}>কোনো prescription নেই</div>
              <Link href="/customer/prescription/upload" style={{ background: "#0D9488", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                Upload করুন
              </Link>
            </div>
          ) : (
            prescriptions.slice(0, 3).map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "0.5px solid #f7fafc" : "none" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a202c" }}>{p.doctorName || "Doctor নেই"}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0" }}>{new Date(p.createdAt).toLocaleDateString("bn-BD")}</div>
                </div>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600, background: "#E6FFFA", color: "#0D9488" }}>
                  {p.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Due Alert — নিচে */}
      {dueAmount > 0 && (
        <div style={{ background: "#FFF5F5", border: "0.5px solid #FEB2B2", borderRadius: 12, padding: "14px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#C53030" }}>বাকি টাকা আছে!</div>
              <div style={{ fontSize: 12, color: "#718096" }}>৳{dueAmount.toFixed(0)} পরিশোধ বাকি</div>
            </div>
          </div>
          <Link href="/customer/profile/billing" style={{ background: "#C53030", color: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
            পরিশোধ করুন
          </Link>
        </div>
      )}
    </div>
  );
}