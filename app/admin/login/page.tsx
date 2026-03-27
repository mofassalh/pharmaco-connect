"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email ও Password দিন");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Email বা Password ভুল");
      setLoading(false);
    } else if (data.role !== "ADMIN" && data.role !== "SUPER_ADMIN" && data.role !== "DELIVERY_STAFF") {
      setError("আপনার Admin access নেই");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#efefef", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, border: "0.5px solid #e2e8f0", padding: 32, width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: "#0D9488", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 22 }}>💊</div>
          <div style={{ fontWeight: 700, fontSize: 20, color: "#1a202c" }}>Pharmaco Connect</div>
          <div style={{ fontSize: 13, color: "#718096", marginTop: 4 }}>Admin Panel Login</div>
          <div style={{ background: "#EDE9FE", color: "#6D28D9", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, display: "inline-block", marginTop: 8 }}>Admin Only</div>
        </div>

        {error && (
          <div style={{ background: "#FFF5F5", border: "0.5px solid #FEB2B2", color: "#C53030", fontSize: 13, padding: "10px 14px", borderRadius: 10, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#4a5568", display: "block", marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@pharmaco.com"
              style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "11px 14px", fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#4a5568", display: "block", marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "11px 14px", fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <button onClick={handleLogin} disabled={loading}
            style={{ background: "#0D9488", color: "#fff", border: "none", padding: 14, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1, marginTop: 4 }}>
            {loading ? "Login হচ্ছে..." : "Admin Login করুন"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <a href="/login" style={{ fontSize: 12, color: "#a0aec0", textDecoration: "none" }}>← Customer Login এ যান</a>
        </div>
      </div>
    </div>
  );
}