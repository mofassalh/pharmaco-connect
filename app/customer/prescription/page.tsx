"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const statusLabel: Record<string, string> = {
  PENDING: "অপেক্ষায়", SUBMITTED: "Submit হয়েছে",
  UNDER_REVIEW: "Review এ", APPROVED: "Approved",
  REJECTED: "Rejected", FULFILLED: "সম্পন্ন",
};
const statusColor: Record<string, string> = {
  PENDING: "#718096", SUBMITTED: "#2B6CB0", UNDER_REVIEW: "#B7791F",
  APPROVED: "#276749", REJECTED: "#C53030", FULFILLED: "#0D9488",
};
const statusBg: Record<string, string> = {
  PENDING: "#f7fafc", SUBMITTED: "#EBF8FF", UNDER_REVIEW: "#FFFAF0",
  APPROVED: "#F0FFF4", REJECTED: "#FFF5F5", FULFILLED: "#E6FFFA",
};

export default function PrescriptionsListPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prescriptions/my")
      .then(r => r.json())
      .then(data => {
        setPrescriptions(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#efefef", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/customer/profile" style={{ color: "#a0aec0", textDecoration: "none", fontSize: 18 }}>←</Link>
          <span style={{ fontWeight: 700, color: "#1a202c" }}>আমার Prescriptions</span>
        </div>
        <Link href="/customer/prescription/upload" style={{ background: "#0D9488", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
          + নতুন
        </Link>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div>
        ) : prescriptions.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ color: "#718096", marginBottom: 16 }}>এখনো কোনো prescription নেই</div>
            <Link href="/customer/prescription/upload" style={{ background: "#0D9488", color: "#fff", padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Prescription Upload করুন
            </Link>
          </div>
        ) : (
          prescriptions.map((p, i) => (
            <Link key={i} href={`/customer/prescription/${p.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>
                      {p.doctorName || "Doctor উল্লেখ নেই"}
                    </div>
                    <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>
                      {new Date(p.createdAt).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: statusBg[p.status], color: statusColor[p.status], height: "fit-content" }}>
                    {statusLabel[p.status]}
                  </span>
                </div>
                {p.medicines?.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {p.medicines.slice(0, 2).map((m: any, j: number) => (
                      <div key={j} style={{ fontSize: 12, color: "#4a5568", marginBottom: 2 }}>💊 {m.medicineName}</div>
                    ))}
                    {p.medicines.length > 2 && (
                      <div style={{ fontSize: 11, color: "#a0aec0" }}>+{p.medicines.length - 2} আরো</div>
                    )}
                  </div>
                )}
                <div style={{ fontSize: 11, color: "#0D9488" }}>বিস্তারিত দেখুন →</div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "0.5px solid #e2e8f0", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 10 }}>
        <Link href="/customer/dashboard" style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#a0aec0", textDecoration: "none", fontSize: 11, gap: 2 }}>
          <span style={{ fontSize: 20 }}>🏠</span>Home
        </Link>
        <Link href="/customer/prescription" style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#0D9488", textDecoration: "none", fontSize: 11, gap: 2 }}>
          <span style={{ fontSize: 20 }}>📋</span>Prescription
        </Link>
        <Link href="/customer/orders" style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#a0aec0", textDecoration: "none", fontSize: 11, gap: 2 }}>
          <span style={{ fontSize: 20 }}>📦</span>Orders
        </Link>
        <Link href="/customer/profile" style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#a0aec0", textDecoration: "none", fontSize: 11, gap: 2 }}>
          <span style={{ fontSize: 20 }}>👤</span>Profile
        </Link>
      </div>
    </div>
  );
}

