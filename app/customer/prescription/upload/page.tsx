"use client";
import { useState } from "react";
import Link from "next/link";

interface Medicine {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
}

export default function PrescriptionUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setMedicines([]);
    setSubmitted(false);
  };

  const handleAI = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2500));
    setMedicines([
      { medicineName: "Napa 500mg", dosage: "500mg", frequency: "৩ বার দৈনিক", duration: "৫ দিন", quantity: 15 },
      { medicineName: "Amoxicillin 250mg", dosage: "250mg", frequency: "২ বার দৈনিক", duration: "৭ দিন", quantity: 14 },
      { medicineName: "Omeprazole 20mg", dosage: "20mg", frequency: "১ বার সকালে", duration: "১০ দিন", quantity: 10 },
    ]);
    setLoading(false);
  };

  const updateMed = (i: number, field: string, value: string) => {
    const updated = [...medicines];
    updated[i] = { ...updated[i], [field]: value };
    setMedicines(updated);
  };

  const removeMed = (i: number) => {
    setMedicines(medicines.filter((_, j) => j !== i));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Prescription Submit হয়েছে!</h2>
          <p className="text-gray-500 text-sm mb-6">Admin review করবেন এবং আপনাকে জানানো হবে।</p>
          <Link href="/customer/dashboard" className="block w-full bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 transition">
            Dashboard এ যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/customer/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Prescription Upload</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Step 1 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold">1</div>
            <h2 className="font-bold text-gray-900">Prescription এর ছবি তুলুন</h2>
          </div>
          {!preview ? (
            <label className="border-2 border-dashed border-teal-300 rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-teal-500 transition">
              <span className="text-4xl mb-3">📷</span>
              <span className="text-gray-600 font-medium">ছবি select করুন বা তুলুন</span>
              <span className="text-gray-400 text-xs mt-1">JPG, PNG — সর্বোচ্চ 10MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <div className="space-y-3">
              <img src={preview} alt="prescription" className="w-full rounded-xl border max-h-64 object-contain" />
              <div className="flex gap-2">
                <button onClick={handleAI} disabled={loading}
                  className="flex-1 bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 disabled:opacity-50 transition">
                  {loading ? "AI পড়ছে... ⏳" : "✨ AI দিয়ে পড়ুন"}
                </button>
                <label className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 cursor-pointer hover:bg-gray-50 transition text-sm">
                  পরিবর্তন
                  <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Step 2 - Medicine List */}
        {medicines.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="font-bold text-gray-900">Medicine তালিকা চেক করুন</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">AI এই তালিকা তৈরি করেছে — ভুল থাকলে edit করুন</p>
            <div className="space-y-3">
              {medicines.map((med, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      value={med.medicineName}
                      onChange={e => updateMed(i, "medicineName", e.target.value)}
                      className="font-medium text-gray-900 bg-transparent border-b border-gray-200 focus:outline-none focus:border-teal-400 flex-1 mr-2"
                    />
                    <button onClick={() => removeMed(i)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Dosage", field: "dosage" },
                      { label: "Frequency", field: "frequency" },
                      { label: "Duration", field: "duration" },
                      { label: "Quantity", field: "quantity" },
                    ].map((f, j) => (
                      <div key={j}>
                        <div className="text-xs text-gray-400 mb-1">{f.label}</div>
                        <input
                          value={String(med[f.field as keyof Medicine])}
                          onChange={e => updateMed(i, f.field, e.target.value)}
                          className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setMedicines([...medicines, { medicineName: "", dosage: "", frequency: "", duration: "", quantity: 1 }])}
              className="w-full border-2 border-dashed border-gray-200 text-gray-400 py-3 rounded-xl text-sm mt-3 hover:border-teal-300 hover:text-teal-500 transition">
              + Medicine যোগ করুন
            </button>
          </div>
        )}

        {/* Step 3 - Notes & Submit */}
        {medicines.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold">3</div>
              <h2 className="font-bold text-gray-900">কোনো বিশেষ নির্দেশনা?</h2>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="যেমন: বাড়িতে deliver করুন, সন্ধ্যার আগে লাগবে..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none h-24 mb-4"
            />
            <button onClick={handleSubmit}
              className="w-full bg-teal-500 text-white py-3 rounded-xl font-bold hover:bg-teal-600 transition">
              Submit করুন →
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 z-10">
        <Link href="/customer/dashboard" className="flex flex-col items-center text-gray-400 text-xs gap-1">
          <span className="text-xl">🏠</span>Home
        </Link>
        <Link href="/customer/prescription/upload" className="flex flex-col items-center text-teal-500 text-xs gap-1">
          <span className="text-xl">📋</span>Prescription
        </Link>
        <Link href="/customer/orders" className="flex flex-col items-center text-gray-400 text-xs gap-1">
          <span className="text-xl">📦</span>Orders
        </Link>
        <Link href="/customer/profile" className="flex flex-col items-center text-gray-400 text-xs gap-1">
          <span className="text-xl">👤</span>Profile
        </Link>
      </div>
    </div>
  );
}