"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import { Github, Linkedin, Twitter, Terminal, ArrowUp } from "lucide-react";

export default function Footer() {
  const { t } = useI18n();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-950 transition-colors duration-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 font-mono font-bold text-slate-800 dark:text-slate-200">
            <Terminal className="h-4 w-4 text-sky-500" />
            <span>
              BEN_H<span className="text-sky-500">.DEV</span>
            </span>
          </div>

          {/* Copyrights */}
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-mono">
            &copy; {new Date().getFullYear()} Ben H. All rights reserved.
          </p>

          {/* Social and Top Nav */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-sky-500 hover:text-sky-500 hover:shadow-[0_0_10px_rgba(56,189,248,0.15)] transition-all cursor-pointer"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-sky-500 hover:text-sky-500 hover:shadow-[0_0_10px_rgba(56,189,248,0.15)] transition-all cursor-pointer"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-sky-500 hover:text-sky-500 hover:shadow-[0_0_10px_rgba(56,189,248,0.15)] transition-all cursor-pointer"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>

            {/* Scroll Top Button */}
            <button
              onClick={handleScrollTop}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-sky-500 hover:text-sky-500 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
