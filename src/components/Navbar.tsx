"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useI18n } from "@/context/I18nContext";
import { Sun, Moon, Menu, X, Globe, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to add shadow/glass styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("navHome"), path: "/#home" },
    { name: t("navProjects"), path: "/projects" },
    { name: t("navSkills"), path: "/#skills" },
    { name: t("navCertificates"), path: "/#certificates" },
    { name: t("navContact"), path: "/#contact" },
  ];

  // Check if link is active
  const isActive = (path: string) => {
    if (path.startsWith("/#")) {
      return pathname === "/" && typeof window !== "undefined" && window.location.hash === path.substring(1);
    }
    return pathname === path;
  };

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    setIsOpen(false);
    if (path.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const id = path.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "glass shadow-md py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo Branding */}
          <Link 
            href="/"
            className="flex items-center space-x-2 text-slate-900 dark:text-white font-mono font-bold text-lg tracking-wider"
          >
            <Terminal className="h-5 w-5 text-sky-500 neon-glow-text" />
            <span className="hover:text-sky-500 transition-colors">
              BEN_H<span className="text-sky-500">.DEV</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-sky-500 ${
                  isActive(link.path)
                    ? "text-sky-500"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Admin link */}
            <Link
              href="/admin"
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-sky-500 ${
                pathname.startsWith("/admin")
                  ? "text-sky-500"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {t("navAdmin")}
            </Link>
          </nav>

          {/* Quick Actions (Theme/Language) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-sky-500 hover:text-sky-500 transition-all text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label="Toggle language"
            >
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">{locale === "en" ? "AR" : "EN"}</span>
              </div>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-sky-500 hover:text-sky-500 transition-all text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu Controls */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Switcher for mobile */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300"
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5" />
            </button>

            {/* Theme Switcher for mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
            </button>

            {/* Hamburger toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-sky-500"
              aria-label="Open menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-sky-500/10 text-sky-500"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname.startsWith("/admin")
                    ? "bg-sky-500/10 text-sky-500"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                {t("navAdmin")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
