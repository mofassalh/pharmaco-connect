"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

const TIME_BADGES: Record<string, { icon: string; label: string; bg: string; color: string; border: string }> = {
  morning: { icon: "🌅", label: "সকাল", bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  noon:    { icon: "☀️", label: "দুপুর", bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  evening: { icon: "🌆", label: "বিকাল", bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  night:   { icon: "🌙", label: "রাত",   bg: "#1E1B4B", color: "#C7D2FE", border: "#4338CA" },
};

const CONDITIONS: Record<string, { label: string; bg: string; color: string; border: string }> = {
  "খালি পেটে":    { label: "🌿 খালি পেটে",    bg: "#F0FFF4", color: "#166534", border: "#BBF7D0" },
  "ভরা পেটে":    { label: "🍽️ ভরা পেটে",    bg: "#F7F0FF", color: "#6B21A8", border: "#E9D5FF" },
  "দুধের সাথে":  { label: "🥛 দুধের সাথে",  bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  "পানির সাথে":  { label: "💧 পানির সাথে",  bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  "চিবিয়ে খাবে": { label: "🍬 চিবিয়ে খাবে", bg: "#FDF4FF", color: "#7E22CE", border: "#E9D5FF" },
  "গিলে খাবে":   { label: "🚫 গিলে খাবে",   bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3" },
  "ঘুমানোর আগে": { label: "🛌 ঘুমানোর আগে", bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" },
  "প্রয়োজনে":   { label: "💊 প্রয়োজনে",   bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
};

export default function PrescriptionDetailPage() {
  const { id } = useParams();
  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/prescriptions/${id}`)
      .then(r => r.json())
      .then(data => { setPrescription(data); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f7fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ color: "#a0aec0" }}>Loading...</div>
    </div>
  );

  if (!prescription) return (
    <div style={{ minHeight: "100vh", background: "#f7fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ color: "#a0aec0" }}>Prescription পাওয়া যায়নি</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f7fafc", fontFamily: "sans-serif", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/customer/orders" style={{ color: "#718096", textDecoration: "none", fontSize: 20 }}>←</Link>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1a202c" }}>Prescription Details</span>
        </div>
        <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, fontWeight: 600, background: statusBg[prescription.status], color: statusColor[prescription.status] }}>
          {statusLabel[prescription.status]}
        </span>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Doctor Info */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: 15, color: "#1a202c", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            👨‍⚕️ Doctor তথ্য
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Doctor এর নাম", value: prescription.doctorName || "উল্লেখ নেই" },
              { label: "Registration No", value: prescription.doctorReg || "উল্লেখ নেই" },
              { label: "Hospital", value: prescription.hospitalName || "উল্লেখ নেই" },
              { label: "Prescription Date", value: prescription.prescriptionDate ? new Date(prescription.prescriptionDate).toLocaleDateString("bn-BD") : "উল্লেখ নেই" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#f7fafc", borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, color: "#a0aec0", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a202c" }}>{item.value}</div>
              </div>
            ))}
          </div>
          {prescription.diagnosis && (
            <div style={{ marginTop: 12, background: "#EBF8FF", borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, color: "#2B6CB0", marginBottom: 4 }}>Diagnosis</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a202c" }}>{prescription.diagnosis}</div>
            </div>
          )}
        </div>

        {/* Prescription Image */}
        {prescription.imageUrl && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: "#1a202c", marginBottom: 12 }}>📋 Prescription</h2>
            <a href={prescription.imageUrl} target="_blank" rel="noopener noreferrer">
              <img src={prescription.imageUrl} alt="prescription"
                style={{ width: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 10, border: "0.5px solid #e2e8f0", cursor: "pointer" }} />
            </a>
          </div>
        )}

        {/* Medicine List — Badge View */}
        {prescription.medicines?.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontWeight: 700, fontSize: 15, color: "#1a202c" }}>💊 Medicine তালিকা</h2>
              <span style={{ fontSize: 12, background: "#E6FFFA", color: "#0D9488", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
                {prescription.medicines.length} টি
              </span>
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              {prescription.medicines.map((med: any, i: number) => (
                <div key={i} style={{ background: "#f7fafc", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c", marginBottom: 4 }}>{med.medicineName}</div>
                  {med.dosage && <div style={{ fontSize: 12, color: "#718096", marginBottom: 8 }}>{med.dosage} {med.duration && `· ${med.duration}`}</div>}

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Object.entries(TIME_BADGES).map(([key, badge]) => {
                      const val = med[key];
                      if (!val || val === "0") return null;
                      return (
                        <span key={key} style={{ fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20, background: badge.bg, color: badge.color, border: `0.5px solid ${badge.border}` }}>
                          {badge.icon} {badge.label} {val}
                        </span>
                      );
                    })}

                    {med.condition && CONDITIONS[med.condition] && (
                      <span style={{ fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20, background: CONDITIONS[med.condition].bg, color: CONDITIONS[med.condition].color, border: `0.5px solid ${CONDITIONS[med.condition].border}` }}>
                        {CONDITIONS[med.condition].label}
                      </span>
                    )}

                    {!med.morning && !med.noon && !med.evening && !med.night && med.frequency && (
                      <span style={{ fontSize: 12, color: "#718096", padding: "5px 12px", borderRadius: 20, background: "#f0f0f0" }}>
                        {med.frequency}
                      </span>
                    )}
                  </div>

                  {med.instructions && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#718096" }}>📝 {med.instructions}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {prescription.customerNotes && (
          <div style={{ background: "#FFFBEB", borderRadius: 16, border: "1px solid #FDE68A", padding: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 13, color: "#92400E", marginBottom: 6 }}>📝 আপনার নোট</h2>
            <p style={{ fontSize: 13, color: "#92400E", margin: 0 }}>{prescription.customerNotes}</p>
          </div>
        )}

        {prescription.adminNotes && (
          <div style={{ background: "#EBF8FF", borderRadius: 16, border: "1px solid #BEE3F8", padding: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 13, color: "#2B6CB0", marginBottom: 6 }}>💬 Admin এর মন্তব্য</h2>
            <p style={{ fontSize: 13, color: "#2B6CB0", margin: 0 }}>{prescription.adminNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
