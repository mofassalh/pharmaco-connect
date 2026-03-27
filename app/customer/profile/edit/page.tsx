"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    area: "",
    city: "",
  });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(data => {
        setForm({
          fullName: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          area: data.area || "",
          city: data.city || "",
        });
        setPhotoUrl(data.photoUrl || null);
        setLoading(false);
      });
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pharmaco_upload");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dl9qpcfe1";
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.secure_url) {
      setPhotoUrl(data.secure_url);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, photoUrl }),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/customer/profile"), 1500);
    } else {
      alert("কিছু একটা ভুল হয়েছে");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#a0aec0" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#efefef", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 52, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 52, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#a0aec0" }}>←</button>
        <span style={{ fontWeight: 700, color: "#1a202c" }}>Profile Edit করুন</span>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>

        {/* Photo Upload */}
        <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e2e8f0", padding: 24, marginBottom: 16, textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid #0D9488" }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#E6FFFA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto" }}>👤</div>
            )}
          </div>
          <div>
            <label style={{ cursor: "pointer", color: "#0D9488", fontWeight: 600, fontSize: 14 }}>
              {uploading ? "Upload হচ্ছে..." : "📷 ছবি পরিবর্তন করুন"}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e2e8f0", padding: 16, marginBottom: 16 }}>
          {[
            { label: "পুরো নাম", key: "fullName", type: "text", placeholder: "আপনার নাম" },
            { label: "Phone নম্বর", key: "phone", type: "tel", placeholder: "01XXXXXXXXX" },
            { label: "ঠিকানা", key: "address", type: "text", placeholder: "বাড়ি, রোড নম্বর" },
            { label: "এলাকা", key: "area", type: "text", placeholder: "যেমন: Mirpur" },
            { label: "শহর", key: "city", type: "text", placeholder: "যেমন: Dhaka" },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#4a5568", display: "block", marginBottom: 6 }}>{f.label}</label>
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
          ))}
        </div>

        {success && (
          <div style={{ background: "#E6FFFA", border: "0.5px solid #0D9488", color: "#0D9488", padding: "12px 16px", borderRadius: 10, marginBottom: 16, textAlign: "center", fontWeight: 600 }}>
            ✅ Profile update হয়েছে!
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || uploading}
          style={{ width: "100%", background: saving ? "#a0aec0" : "#0D9488", color: "#fff", border: "none", padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Save হচ্ছে..." : "✓ Save করুন"}
        </button>
      </div>
    </div>
  );
}