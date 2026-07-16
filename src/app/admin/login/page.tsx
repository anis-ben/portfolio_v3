"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useI18n } from "@/context/I18nContext";
import { toast } from "sonner";
import { Terminal, Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const sessionCookie =
  typeof window !== "undefined" && window.location.protocol === "https:"
    ? "admin_session=true; path=/; max-age=86400; secure; samesite=strict"
    : "admin_session=true; path=/; max-age=86400; samesite=lax";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already authenticated in firebase client, double check session cookie
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Ensure cookie is set
        document.cookie = sessionCookie;
        router.push("/admin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Set the Edge middleware session cookie (lasts 1 day)
      document.cookie = sessionCookie;
      
      toast.success("Successfully logged in!");
      router.push("/admin");
    } catch (error: unknown) {
      console.error("Login error:", error);
      let errMsg = "Authentication failed. Please verify credentials.";
      if (
        error instanceof FirebaseError &&
        (error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/invalid-credential")
      ) {
        errMsg = "Invalid email or password.";
      }
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 cyber-grid relative px-4">
      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center space-x-2 text-slate-400 hover:text-sky-400 transition-colors text-sm font-mono"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t("backToHome")}</span>
      </Link>

      <div className="w-full max-w-md glass border border-slate-800 bg-slate-950/80 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-4">
            <Terminal className="h-6 w-6 text-sky-400 neon-glow-text" />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-tight">
            {t("login")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            secure_admin_gateway_v3.0
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
              {t("emailLabel")}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@domain.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-white transition-all text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
              {t("passwordLabel")}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-white transition-all text-sm font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-sky-500/25 flex items-center justify-center space-x-2 text-sm uppercase font-mono"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("loading")}</span>
              </>
            ) : (
              <span>{t("loginBtn")}</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
