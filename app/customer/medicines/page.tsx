"use client";
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
}