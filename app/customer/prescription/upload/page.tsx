"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Medicine {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
}

export default function PrescriptionUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setMedicines([]);
    setSubmitted(false);
  };

  const handleAI = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // Cloudinary তে upload করুন
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "pharmaco_upload");

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/dl9qpcfe1/image/upload`, {
        method: "POST",
        body: formData,
      });
      const cloudData = await cloudRes.json();
      const imageUrl = cloudData.secure_url;
      setUploadedUrl(imageUrl);

      // AI দিয়ে prescription পড়ুন
      const aiRes = await fetch("/api/prescriptions/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const aiData = await aiRes.json();

      if (aiData.medicines) {
        setMedicines(aiData.medicines);
      }
    } catch {
      alert("কিছু একটা ভুল হয়েছে");
    }
    setLoading(false);
  };

  const updateMed = (i: number, field: string, value: string) => {
    const updated = [...medicines];
    updated[i] = { ...updated[i], [field]: value };
    setMedicines(updated);
  };

  const removeMed = (i: number) => setMedicines(medicines.filter((_, j) => j !== i));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const prescRes = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadedUrl || preview || "",
          imageKey: "cloudinary",
          status: "SUBMITTED",
          submittedAt: new Date().toISOString(),
          customerNotes: notes,
        }),
      });
      const prescription = await prescRes.json();

      if (medicines.length > 0 && prescription.id) {
        await Promise.all(medicines.map(med =>
          fetch(`/api/prescriptions/${prescription.id}/medicines`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...med, isAiExtracted: true }),
          })
        ));
      }
      setSubmitted(true);
    } catch {
      alert("কিছু একটা ভুল হয়েছে");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f8fa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, maxWidth: 320, width: "100%", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a202c", marginBottom: 8 }}>Submit হয়েছে!</h2>
          <p style={{ color: "#718096", fontSize: 14, marginBottom: 24 }}>Admin review করবেন এবং আপনাকে জানানো হবে।</p>
          <button onClick={() => router.push("/customer/dashboard")}
            style={{ width: "100%", background: "#0D9488", color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Dashboard এ যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: 32 }}>

      {/* Sub Header */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 48, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 56, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#a0aec0" }}>←</button>
        <span style={{ fontWeight: 700, color: "#1a202c", fontSize: 15 }}>📋 Prescription Upload</span>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>

        {/* Step 1 */}
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0D9488", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>1</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1a202c" }}>Prescription এর ছবি তুলুন</span>
          </div>

          {!preview ? (
            <label style={{ border: "2px dashed #b2f5ea", borderRadius: 14, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", background: "#f0fdf9" }}>
              <span style={{ fontSize: 48, marginBottom: 12 }}>📷</span>
              <span style={{ fontWeight: 600, color: "#1a202c", fontSize: 15 }}>ছবি select করুন</span>
              <span style={{ color: "#a0aec0", fontSize: 12, marginTop: 4 }}>JPG, PNG — সর্বোচ্চ 10MB</span>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
            </label>
          ) : (
            <div>
              <img src={preview} alt="prescription" style={{ width: "100%", borderRadius: 12, border: "0.5px solid #e2e8f0", maxHeight: 280, objectFit: "contain", marginBottom: 12 }} />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleAI} disabled={loading}
                  style={{ flex: 1, background: loading ? "#a0aec0" : "#0D9488", color: "#fff", border: "none", padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "AI পড়ছে... ⏳" : "✨ AI দিয়ে পড়ুন"}
                </button>
                <label style={{ padding: "12px 16px", border: "0.5px solid #e2e8f0", borderRadius: 10, color: "#4a5568", cursor: "pointer", fontSize: 13, fontWeight: 500, background: "#fff" }}>
                  পরিবর্তন
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Step 2 - Medicine List */}
        {medicines.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0D9488", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>2</div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1a202c" }}>Medicine তালিকা চেক করুন</span>
            </div>
            <p style={{ fontSize: 12, color: "#a0aec0", marginBottom: 16 }}>AI এই তালিকা তৈরি করেছে — ভুল থাকলে edit করুন</p>

            {medicines.map((med, i) => (
              <div key={i} style={{ border: "0.5px solid #e2e8f0", borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <input value={med.medicineName} onChange={e => updateMed(i, "medicineName", e.target.value)}
                    style={{ fontWeight: 700, fontSize: 14, color: "#1a202c", border: "none", borderBottom: "1px solid #e2e8f0", flex: 1, marginRight: 10, padding: "4px 0", outline: "none", background: "transparent" }} />
                  <button onClick={() => removeMed(i)} style={{ background: "none", border: "none", color: "#FC8181", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>✕</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Dosage", field: "dosage" },
                    { label: "Frequency", field: "frequency" },
                    { label: "Duration", field: "duration" },
                    { label: "Quantity", field: "quantity" },
                  ].map((f, j) => (
                    <div key={j}>
                      <div style={{ fontSize: 11, color: "#a0aec0", marginBottom: 4 }}>{f.label}</div>
                      <input value={String(med[f.field as keyof Medicine])} onChange={e => updateMed(i, f.field, e.target.value)}
                        style={{ width: "100%", fontSize: 13, border: "0.5px solid #e2e8f0", borderRadius: 8, padding: "7px 10px", boxSizing: "border-box", outline: "none" }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={() => setMedicines([...medicines, { medicineName: "", dosage: "", frequency: "", duration: "", quantity: 1 }])}
              style={{ width: "100%", border: "2px dashed #e2e8f0", background: "transparent", color: "#a0aec0", padding: "12px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
              + Medicine যোগ করুন
            </button>
          </div>
        )}

        {/* Step 3 */}
        {medicines.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0D9488", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>3</div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1a202c" }}>বিশেষ নির্দেশনা</span>
            </div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="যেমন: বাড়িতে deliver করুন, সন্ধ্যার আগে লাগবে..."
              rows={3}
              style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", fontSize: 14, resize: "none", boxSizing: "border-box", outline: "none", marginBottom: 16 }} />
            <button onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", background: loading ? "#a0aec0" : "#0D9488", color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Submit হচ্ছে..." : "Submit করুন →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}