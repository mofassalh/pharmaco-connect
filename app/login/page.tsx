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
      or: "অথবা",
      googleLogin: "Google দিয়ে লগইন করুন",
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
      or: "or",
      googleLogin: "Continue with Google",
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

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{ color: "#a0aec0", fontSize: 13 }}>{t.or}</span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>

        {/* Google Login Button */}
        
          href="/api/auth/google"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            width: "100%",
            padding: "13px",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            background: "#fff",
            color: "#374151",
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#f9fafb")}
          onMouseOut={e => (e.currentTarget.style.background = "#fff")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t.googleLogin}
        </a>

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