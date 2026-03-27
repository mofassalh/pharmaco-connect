import fs from "fs";
import path from "path";

const files = {

"app/customer/orders/page.tsx": `"use client";
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
}`,

"app/customer/medicines/page.tsx": `"use client";
import { useLanguage } from "../../context/language";

const meds = [
  { name: "Napa 500mg", dosage: "500mg", frequency: "৩ বার দৈনিক", nextDue: "১ এপ্রিল ২০২৬", available: true },
  { name: "Amlodipine 5mg", dosage: "5mg", frequency: "১ বার রাতে", nextDue: "৫ এপ্রিল ২০২৬", available: true },
  { name: "Metformin 500mg", dosage: "500mg", frequency: "২ বার দৈনিক", nextDue: "১০ এপ্রিল ২০২৬", available: false },
];

export default function MedicinesPage() {
  const { lang, t } = useLanguage();
  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", marginBottom: 16 }}>
        {lang === "en" ? "My Medicines" : "নিয়মিত Medicine"}
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {meds.map((med, i) => (
          <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>💊 {med.name}</span>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: med.available ? "#F0FFF4" : "#FFF5F5", color: med.available ? "#276749" : "#C53030" }}>
                {med.available ? t("available") : t("outOfStock")}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#718096", marginBottom: 8 }}>{med.dosage} · {med.frequency}</div>
            <div style={{ background: "#E6FFFA", color: "#0D9488", fontSize: 12, padding: "6px 10px", borderRadius: 8 }}>
              🔔 {lang === "en" ? "Next refill:" : "পরের refill:"} {med.nextDue}
            </div>
          </div>
        ))}
        <button style={{ width: "100%", border: "2px dashed #5DCAA5", color: "#0D9488", background: "none", padding: 14, borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          + {lang === "en" ? "Add Regular Medicine" : "নতুন নিয়মিত Medicine যোগ করুন"}
        </button>
      </div>
    </div>
  );
}`,

"app/customer/prescription/page.tsx": `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../../context/language";

const statusLabel: Record<string, Record<string, string>> = {
  bn: { PENDING: "অপেক্ষায়", SUBMITTED: "Submit হয়েছে", UNDER_REVIEW: "Review এ", APPROVED: "Approved", REJECTED: "Rejected", FULFILLED: "সম্পন্ন" },
  en: { PENDING: "Pending", SUBMITTED: "Submitted", UNDER_REVIEW: "Under Review", APPROVED: "Approved", REJECTED: "Rejected", FULFILLED: "Fulfilled" },
};
const statusColor: Record<string, string> = { PENDING: "#718096", SUBMITTED: "#2B6CB0", UNDER_REVIEW: "#B7791F", APPROVED: "#276749", REJECTED: "#C53030", FULFILLED: "#0D9488" };
const statusBg: Record<string, string> = { PENDING: "#f7fafc", SUBMITTED: "#EBF8FF", UNDER_REVIEW: "#FFFAF0", APPROVED: "#F0FFF4", REJECTED: "#FFF5F5", FULFILLED: "#E6FFFA" };

export default function PrescriptionsListPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    fetch("/api/prescriptions/my").then(r => r.json())
      .then(data => { setPrescriptions(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c" }}>
          {lang === "en" ? "My Prescriptions" : "আমার Prescriptions"}
        </h1>
        <Link href="/customer/prescription/upload" style={{ background: "#0D9488", color: "#fff", padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
          + {lang === "en" ? "New" : "নতুন"}
        </Link>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div>
      ) : prescriptions.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ color: "#718096", marginBottom: 16 }}>
            {lang === "en" ? "No prescriptions yet" : "এখনো কোনো prescription নেই"}
          </div>
          <Link href="/customer/prescription/upload" style={{ background: "#0D9488", color: "#fff", padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            {lang === "en" ? "Upload Prescription" : "Prescription Upload করুন"}
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {prescriptions.map((p, i) => (
            <Link key={i} href={\`/customer/prescription/\${p.id}\`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>{p.doctorName || (lang === "en" ? "No doctor" : "Doctor উল্লেখ নেই")}</div>
                    <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>{new Date(p.createdAt).toLocaleDateString(lang === "en" ? "en-BD" : "bn-BD", { year: "numeric", month: "long", day: "numeric" })}</div>
                  </div>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: statusBg[p.status], color: statusColor[p.status], height: "fit-content" }}>
                    {statusLabel[lang]?.[p.status] || p.status}
                  </span>
                </div>
                {p.medicines?.slice(0, 2).map((m: any, j: number) => (
                  <div key={j} style={{ fontSize: 12, color: "#4a5568", marginBottom: 2 }}>💊 {m.medicineName}</div>
                ))}
                {p.medicines?.length > 2 && <div style={{ fontSize: 11, color: "#a0aec0" }}>+{p.medicines.length - 2} {lang === "en" ? "more" : "আরো"}</div>}
                <div style={{ fontSize: 11, color: "#0D9488", marginTop: 6 }}>{lang === "en" ? "View details →" : "বিস্তারিত দেখুন →"}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
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
console.log("\n🎉 Done!");

