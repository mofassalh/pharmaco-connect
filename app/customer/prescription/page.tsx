"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/language";

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
            <Link key={i} href={`/customer/prescription/${p.id}`} style={{ textDecoration: "none" }}>
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
}