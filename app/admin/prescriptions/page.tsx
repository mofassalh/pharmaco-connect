"use client";
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
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === s ? "bg-teal-500 text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
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
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[p.status]}`}>
                    {statusLabel[p.status]}
                  </span>
                </div>
                {p.medicines?.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {p.medicines.slice(0, 3).map((m: any, j: number) => (
                      <div key={j} className="text-sm text-gray-600">💊 {m.medicineName} {m.dosage && `- ${m.dosage}`}</div>
                    ))}
                    {p.medicines.length > 3 && <div className="text-xs text-gray-400">+{p.medicines.length - 3} আরো</div>}
                  </div>
                )}
                <div className="flex gap-2">
                  <Link href={`/admin/prescriptions/${p.id}`}
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
}