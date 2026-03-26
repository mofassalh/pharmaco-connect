"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PrescriptionDetailPage() {
  const { id } = useParams();
  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/prescriptions/${id}`)
      .then(r => r.json())
      .then(data => { setPrescription(data); setLoading(false); });
  }, [id]);

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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  );

  if (!prescription) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400">Prescription পাওয়া যায়নি</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/customer/orders" className="text-gray-400 hover:text-gray-600">←</Link>
          <span className="font-bold text-gray-900">Prescription Details</span>
        </div>
        <span style={{
          fontSize: 11, padding: "3px 12px", borderRadius: 20, fontWeight: 600,
          background: statusBg[prescription.status],
          color: statusColor[prescription.status],
        }}>
          {statusLabel[prescription.status]}
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Doctor Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>👨‍⚕️</span> Doctor তথ্য
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Doctor এর নাম", value: prescription.doctorName || "উল্লেখ নেই" },
              { label: "Registration No", value: prescription.doctorReg || "উল্লেখ নেই" },
              { label: "Hospital", value: prescription.hospitalName || "উল্লেখ নেই" },
              { label: "Prescription Date", value: prescription.prescriptionDate ? new Date(prescription.prescriptionDate).toLocaleDateString("bn-BD") : "উল্লেখ নেই" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                <div className="text-sm font-medium text-gray-900">{item.value}</div>
              </div>
            ))}
          </div>
          {prescription.diagnosis && (
            <div className="mt-3 bg-blue-50 rounded-xl p-3">
              <div className="text-xs text-blue-400 mb-1">Diagnosis</div>
              <div className="text-sm font-medium text-blue-900">{prescription.diagnosis}</div>
            </div>
          )}
        </div>

        {/* Upload Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>📋</span> Upload তথ্য
          </h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Upload করা হয়েছে</span>
            <span className="font-medium text-gray-900">
              {new Date(prescription.createdAt).toLocaleDateString("bn-BD", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </span>
          </div>
          {prescription.imageUrl && (
            <div className="mt-3">
              <img src={prescription.imageUrl} alt="prescription" className="w-full rounded-xl border max-h-48 object-contain" />
            </div>
          )}
        </div>

        {/* Medicine Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <span>💊</span> Medicine তালিকা
              <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full ml-auto">
                {prescription.medicines?.length || 0} টি
              </span>
            </h2>
          </div>

          {prescription.medicines?.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-3xl mb-2">💊</div>
              <div>কোনো medicine নেই</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "0.5px solid #e8ecf0" }}>
                    {["Medicine নাম", "Dosage", "দিনে কতবার", "কতদিন", "মোট পরিমাণ", "নির্দেশনা"].map((h, i) => (
                      <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#718096", fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prescription.medicines?.map((med: any, i: number) => (
                    <tr key={i} style={{ borderBottom: "0.5px solid #f7fafc" }}>
                      <td style={{ padding: "12px", fontWeight: 600, color: "#1a202c" }}>
                        <div>{med.medicineName}</div>
                        {med.genericName && <div style={{ fontSize: 11, color: "#a0aec0", fontWeight: 400 }}>{med.genericName}</div>}
                      </td>
                      <td style={{ padding: "12px", color: "#4a5568" }}>{med.dosage || "—"}</td>
                      <td style={{ padding: "12px", color: "#4a5568" }}>{med.frequency || "—"}</td>
                      <td style={{ padding: "12px", color: "#4a5568" }}>{med.duration || "—"}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ background: "#E6FFFA", color: "#0D9488", padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                          {med.quantity || "—"} টি
                        </span>
                      </td>
                      <td style={{ padding: "12px", color: "#718096", fontSize: 12 }}>{med.instructions || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customer Notes */}
        {prescription.customerNotes && (
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
            <h2 className="font-bold text-amber-900 mb-2 text-sm">📝 আপনার নোট</h2>
            <p className="text-sm text-amber-800">{prescription.customerNotes}</p>
          </div>
        )}

        {/* Admin Notes */}
        {prescription.adminNotes && (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
            <h2 className="font-bold text-blue-900 mb-2 text-sm">💬 Admin এর মন্তব্য</h2>
            <p className="text-sm text-blue-800">{prescription.adminNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}