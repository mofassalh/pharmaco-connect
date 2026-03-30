"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const router = useRouter();

  const t = {
    bn: {
      title: "নতুন Account",
      sub: "Pharmaco Connect এ Register করুন",
      fullName: "পুরো নাম",
      email: "Email",
      phone: "Phone",
      password: "Password",
      confirmPassword: "Password আবার দিন",
      register: "Register করুন",
      registering: "Register হচ্ছে...",
      hasAccount: "Already account আছে?",
      login: "Login করুন",
      namePlaceholder: "আপনার নাম",
      errorAll: "সব তথ্য দিন",
      errorPassword: "Password মিলছে না",
      errorLength: "Password কমপক্ষে ৬ অক্ষর হতে হবে",
      errorGeneral: "কিছু একটা ভুল হয়েছে",
    },
    en: {
      title: "New Account",
      sub: "Register on Pharmaco Connect",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      password: "Password",
      confirmPassword: "Confirm Password",
      register: "Register",
      registering: "Registering...",
      hasAccount: "Already have an account?",
      login: "Login",
      namePlaceholder: "Your name",
      errorAll: "Fill in all fields",
      errorPassword: "Passwords do not match",
      errorLength: "Password must be at least 6 characters",
      errorGeneral: "Something went wrong",
    },
  }[lang];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.password) {
      setError(t.errorAll);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t.errorPassword);
      return;
    }
    if (form.password.length < 6) {
      setError(t.errorLength);
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || t.errorGeneral);
      setLoading(false);
    } else {
      router.push("/login");
    }
  };

  const fields = [
    { label: t.fullName, name: "fullName", type: "text", placeholder: t.namePlaceholder },
    { label: t.email, name: "email", type: "email", placeholder: "example@email.com" },
    { label: t.phone, name: "phone", type: "tel", placeholder: "01XXXXXXXXX" },
    { label: t.password, name: "password", type: "password", placeholder: "••••••••" },
    { label: t.confirmPassword, name: "confirmPassword", type: "password", placeholder: "••••••••" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0fdfa, #fff)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", fontFamily: "sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 20px rgba(0,0,0,0.08)", padding: 32, width: "100%", maxWidth: 400 }}>

        {/* Language Toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <div style={{ display: "flex", background: "#f7fafc", borderRadius: 10, padding: 3, border: "0.5px solid #e2e8f0" }}>
            <button onClick={() => setLang("bn")}
              style={{ padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: lang === "bn" ? "#0D9488" : "transparent", color: lang === "bn" ? "#fff" : "#718096" }}>
              🇧🇩 বাং
            </button>
            <button onClick={() => setLang("en")}
              style={{ padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: lang === "en" ? "#0D9488" : "transparent", color: lang === "en" ? "#fff" : "#718096" }}>
              🇬🇧 EN
            </button>
          </div>
        </div>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: "#0D9488", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 26 }}>💊</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a202c", margin: 0 }}>{t.title}</h1>
          <p style={{ color: "#718096", fontSize: 14, marginTop: 6 }}>{t.sub}</p>
        </div>

        {error && (
          <div style={{ background: "#FFF5F5", border: "1px solid #FEB2B2", color: "#C53030", fontSize: 13, padding: "10px 14px", borderRadius: 10, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={f.placeholder}
                style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", fontSize: 14, boxSizing: "border-box", outline: "none" }}
              />
            </div>
          ))}

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{ width: "100%", background: loading ? "#a0aec0" : "#0D9488", color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
            {loading ? t.registering : t.register}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <p style={{ fontSize: 13, color: "#718096" }}>
            {t.hasAccount}{" "}
            <Link href="/login" style={{ color: "#0D9488", fontWeight: 700 }}>
              {t.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}