"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const router = useRouter();

  const t = {
    bn: {
      title: "Pharmaco Connect",
      sub: "আপনার account এ login করুন",
      email: "Email",
      password: "Password",
      login: "Login করুন",
      logging: "Login হচ্ছে...",
      newUser: "নতুন user?",
      register: "Register করুন",
    },
    en: {
      title: "Pharmaco Connect",
      sub: "Login to your account",
      email: "Email",
      password: "Password",
      login: "Login",
      logging: "Logging in...",
      newUser: "New user?",
      register: "Register",
    },
  }[lang];

  const handleLogin = async () => {
    if (!email || !password) {
      setError(lang === "bn" ? "Email ও Password দিন" : "Enter email and password");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (lang === "bn" ? "কিছু একটা ভুল হয়েছে" : "Something went wrong"));
        setLoading(false);
      } else {
        if (data.role === "ADMIN" || data.role === "SUPER_ADMIN" || data.role === "DELIVERY_STAFF") {
          router.push("/admin/dashboard");
        } else {
          router.push("/customer/dashboard");
        }
      }
    } catch {
      setError(lang === "bn" ? "Network error হয়েছে" : "Network error");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0fdfa, #fff)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "sans-serif" }}>
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

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>{t.email}</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", fontSize: 14, boxSizing: "border-box", outline: "none" }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>{t.password}</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", fontSize: 14, boxSizing: "border-box", outline: "none" }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", background: loading ? "#a0aec0" : "#0D9488", color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? t.logging : t.login}
        </button>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <p style={{ fontSize: 13, color: "#718096" }}>
            {t.newUser}{" "}
            <Link href="/register" style={{ color: "#0D9488", fontWeight: 700 }}>
              {t.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}