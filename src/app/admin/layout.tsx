"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { toast } from "sonner";
import { Loader2, LogOut, LayoutDashboard, Home, Globe } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const isLoginPath = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPath) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Clear the cookie if not logged in
        document.cookie = "admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        setUser(null);
        router.push("/admin/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isLoginPath, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear the cookie
      document.cookie = "admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    }
  };

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  if (isLoginPath) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white font-mono">
        <Loader2 className="h-10 w-10 animate-spin text-sky-400 mb-4" />
        <p className="text-slate-400 animate-pulse text-sm">securing_session_credentials...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      {/* Admin Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Dashboard Title */}
            <div className="flex items-center space-x-2 font-mono font-bold text-lg">
              <LayoutDashboard className="h-5 w-5 text-sky-400" />
              <span>
                ADMIN<span className="text-sky-400">_PANEL</span>
              </span>
            </div>

            {/* Quick Stats/Email and Actions */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline-block text-xs font-mono text-slate-500 max-w-[180px] truncate">
                {user.email}
              </span>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center space-x-1"
                title="Switch Language"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">{locale === "en" ? "AR" : "EN"}</span>
              </button>

              {/* Back to Site */}
              <Link
                href="/"
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                title="View Website"
              >
                <Home className="h-4 w-4" />
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-900/50 transition-all cursor-pointer flex items-center space-x-1 text-sm font-mono"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t("logout")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
