"use client";
import Link from "next/link";
import { useLanguage } from "../../context/language";

const statusLabel: Record<string, Record<string, string>> = {
  bn: { PENDING: "অপেক্ষায়", CONFIRMED: "নিশ্চিত", PROCESSING: "প্রস্তুত হচ্ছে", OUT_FOR_DELIVERY: "রাস্তায় আছে", DELIVERED: "পৌঁছে গেছে", CANCELLED: "বাতিল" },
  en: { PENDING: "Pending", CONFIRMED: "Confirmed", PROCESSING: "Processing", OUT_FOR_DELIVERY: "Out for Delivery", DELIVERED: "Delivered", CANCELLED: "Cancelled" },
};
const statusColor: Record<string, string> = {
  PENDING: "#718096", CONFIRMED: "#2B6CB0", PROCESSING: "#B7791F",
  OUT_FOR_DELIVERY: "#6B46C1", DELIVERED: "#276749", CANCELLED: "#C53030",
};
const statusBg: Record<string, string> = {
  PENDING: "#f7fafc", CONFIRMED: "#EBF8FF", PROCESSING: "#FFFAF0",
  OUT_FOR_DELIVERY: "#FAF5FF", DELIVERED: "#F0FFF4", CANCELLED: "#FFF5F5",
};

const orders = [
  { id: "ORD-001", date: "২৪ মার্চ ২০২৬", status: "OUT_FOR_DELIVERY", items: ["Napa 500mg x15", "Amoxicillin x14"], total: 850, paid: 850, due: 0 },
  { id: "ORD-002", date: "১৫ মার্চ ২০২৬", status: "DELIVERED", items: ["Omeprazole x10"], total: 450, paid: 200, due: 250 },
];

export default function OrdersPage() {
  const { lang, t } = useLanguage();
  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", marginBottom: 16 }}>{t("myOrders")}</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#a0aec0" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📦</div>
          <div>{t("noOrders")}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((order, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#1a202c", fontFamily: "monospace" }}>{order.id}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>{order.date}</div>
                </div>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: statusBg[order.status], color: statusColor[order.status] }}>
                  {statusLabel[lang]?.[order.status] || order.status}
                </span>
              </div>
              <div style={{ marginBottom: 10 }}>
                {order.items.map((item, j) => (
                  <div key={j} style={{ fontSize: 12, color: "#4a5568", marginBottom: 2 }}>💊 {item}</div>
                ))}
              </div>
              <div style={{ borderTop: "0.5px solid #f7fafc", paddingTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "#718096" }}>{t("total")}</span>
                  <span style={{ fontWeight: 700, color: "#1a202c" }}>৳{order.total}</span>
                </div>
                {order.due > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#C53030", fontWeight: 500 }}>{t("due")}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, color: "#C53030" }}>৳{order.due}</span>
                      <Link href="/customer/profile/payment" style={{ fontSize: 11, background: "#C53030", color: "#fff", padding: "3px 10px", borderRadius: 8, textDecoration: "none" }}>
                        {lang === "en" ? "Pay" : "পরিশোধ"}
                      </Link>
                    </div>
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