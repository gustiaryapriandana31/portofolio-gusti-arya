"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuLock, LuUser, LuTriangleAlert, LuArrowRight } from "react-icons/lu";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Semua kolom harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk.");
      }

      // Successful login
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="force-dark min-h-screen flex items-center justify-center bg-background px-6 relative">
      {/* Background blobs for aesthetics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-radial-gradient from-accent/5 to-transparent filter blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-md glow-card p-8 md:p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4 text-accent text-glow">
            <LuLock size={22} />
          </div>
          <h1 className="text-2xl font-audiowide font-bold text-white tracking-wide">
            PORTFOLIO ADMIN
          </h1>
          <p className="text-xs font-poppins text-slate-400 mt-2">
            Silakan masuk untuk mengelola isi portofolio
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 text-sm font-poppins mb-6">
            <LuTriangleAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-ibm-plex-mono text-slate-300 uppercase tracking-wider block">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-slate-400">
                <LuUser size={16} />
              </span>
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-poppins placeholder-slate-500 focus:outline-none focus:border-accent transition-all text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-ibm-plex-mono text-slate-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-slate-400">
                <LuLock size={16} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-poppins placeholder-slate-500 focus:outline-none focus:border-accent transition-all text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-poppins font-bold text-sm tracking-wide transition-all bg-accent text-slate-950 hover:bg-accent-hover border-2 border-slate-950 dark:border-transparent shadow-[3px_3px_0px_#000000] dark:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000000] dark:hover:translate-x-0 dark:hover:translate-y-0 disabled:opacity-50 disabled:pointer-events-none mt-6"
          >
            <span>{loading ? "Menghubungkan..." : "Masuk"}</span>
            <LuArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
