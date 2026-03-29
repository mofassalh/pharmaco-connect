"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const statusLabel: Record<string, string> = {
  PENDING: "অপেক্ষায়",
  SUBMITTED: "Submit হয়েছে",
  UNDER_REVIEW: "Review এ",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  FULFILLED: "সম্পন্ন",
};

const statusColor: Record<string, string> = {
  PENDING: "#718096",
  SUBMITTED: "#2B6CB0",
  UNDER_REVIEW: "#B7791F",
  APPROVED: "#276749",
  REJECTED: "#C53030",
  FULFILLED: "#0D9488",
};

const statusBg: Record<string, string> = {
  PENDING: "#f7fafc",
  SUBMITTED: "#EBF8FF",
  UNDER_REVIEW: "#FFFAF0",
  APPROVED: "#F0FFF4",
  REJECTED: "#FFF5F5",
  FULFILLED: "#E6FFFA",
};

export default function PrescriptionsPage() {
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

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, fontFamily: "sans-serif" }}>
        <div style={{ color: "#a0aec0" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", margin: 0 }}>📋 আমার Prescriptions</h1>
        <Link href="/customer/prescription/upload" style={{ background: "#0D9488", color: "#fff", padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
          + নতুন
        </Link>
      </div>

      {prescriptions.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
          <div style={{ color: "#718096", marginBottom: 20, fontSize: 14 }}>এখনো কোনো prescription নেই</div>
          <Link href="/customer/prescription/upload" style={{ background: "#0D9488", color: "#fff", padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Prescription Upload করুন
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {prescriptions.map((p, i) => (
            <Link key={i} href={`/customer/prescription/${p.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>
                      {p.doctorName || "Doctor উল্লেখ নেই"}
                    </div>
                    {p.hospitalName && (
                      <div style={{ fontSize: 12, color: "#718096", marginTop: 2 }}>🏥 {p.hospitalName}</div>
                    )}
                    <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>
                      {new Date(p.createdAt).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, padding: "4px 12px", borderRadius: 20, fontWeight: 600,
                    background: statusBg[p.status] || "#f7fafc",
                    color: statusColor[p.status] || "#718096",
                  }}>
                    {statusLabel[p.status] || p.status}
                  </span>
                </div>

                {p.medicines?.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {p.medicines.slice(0, 2).map((m: any, j: number) => (
                      <div key={j} style={{ fontSize: 12, color: "#4a5568", marginBottom: 3 }}>💊 {m.medicineName}</div>
                    ))}
                    {p.medicines.length > 2 && (
                      <div style={{ fontSize: 11, color: "#a0aec0" }}>+{p.medicines.length - 2} টি আরো</div>
                    )}
                  </div>
                )}

                <div style={{ fontSize: 12, color: "#0D9488", fontWeight: 600 }}>বিস্তারিত দেখুন →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}