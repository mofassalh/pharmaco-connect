"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    console.log("Login clicked", email, password);
    if (!email || !password) {
      setError("Email ও Password দিন");
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
      console.log("Login response:", data);

      if (!res.ok) {
        setError(data.error || "কিছু একটা ভুল হয়েছে");
        setLoading(false);
      } else {
        if (data.role === "ADMIN" || data.role === "SUPER_ADMIN" || data.role === "DELIVERY_STAFF") {
          router.push("/admin/dashboard");
        } else {
          router.push("/customer/profile");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error হয়েছে");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0fdfa, #fff)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 20px rgba(0,0,0,0.08)", padding: 32, width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: "#0D9488", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>💊</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a202c", margin: 0 }}>Pharmaco Connect</h1>
          <p style={{ color: "#718096", fontSize: 14, marginTop: 6 }}>আপনার account এ login করুন</p>
        </div>

        {error && (
          <div style={{ background: "#FFF5F5", border: "1px solid #FEB2B2", color: "#C53030", fontSize: 13, padding: "10px 14px", borderRadius: 10, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#4a5568", display: "block", marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", fontSize: 14, boxSizing: "border-box", outline: "none" }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#4a5568", display: "block", marginBottom: 6 }}>Password</label>
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
          {loading ? "Login হচ্ছে..." : "Login করুন"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <p style={{ fontSize: 13, color: "#718096" }}>
            নতুন user?{" "}
            <Link href="/register" style={{ color: "#0D9488", fontWeight: 600 }}>
              Register করুন
            </Link>
          </p>
          <Link href="/admin/login" style={{ fontSize: 12, color: "#a0aec0", textDecoration: "none" }}>Admin Login →</Link>
        </div>
      </div>
    </div>
  );
}