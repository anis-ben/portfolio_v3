"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";
import { getCategories, getProjects, Category, Project } from "@/firebase/db";
import { motion, AnimatePresence } from "framer-motion";
import { FolderGit, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProjectsPage() {
  const { locale, t } = useI18n();

  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catsData, projsData] = await Promise.all([
          getCategories(),
          getProjects(),
        ]);
        setCategories(catsData);
        setProjects(projsData);
        setFilteredProjects(projsData);
      } catch (error) {
        console.error("Error loading projects page data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle category change
  const handleCategoryFilter = (slug: string) => {
    setActiveCategory(slug);
    if (slug === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category_slug === slug));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400 mb-2" />
        <p className="text-slate-500 text-xs">loading_portfolio_gallery...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 min-h-[80vh]">
      {/* Header */}
      <div className="space-y-4 mb-12">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-sky-500 transition-colors font-mono"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("backToHome")}</span>
        </Link>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("allProjects")}
        </h1>
        <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
          {t("allProjectsSubtitle")}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-slate-200 dark:border-slate-900 pb-6">
        <button
          onClick={() => handleCategoryFilter("all")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg font-mono transition-all cursor-pointer ${
            activeCategory === "all"
              ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10"
              : "bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-400 hover:text-sky-500 hover:bg-sky-500/5 border border-transparent hover:border-sky-500/10"
          }`}
        >
          {t("filterAll")}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryFilter(cat.slug)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg font-mono transition-all cursor-pointer uppercase ${
              activeCategory === cat.slug
                ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10"
                : "bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-400 hover:text-sky-500 hover:bg-sky-500/5 border border-transparent hover:border-sky-500/10"
            }`}
          >
            {locale === "en" ? cat.name_en : cat.name_ar}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-500 font-mono text-sm">{t("noProjects")}</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.article
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-850 hover:border-sky-500/50 neon-border flex flex-col h-full bg-white dark:bg-slate-950/40"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-video w-full border-b border-slate-200 dark:border-slate-850 bg-slate-900 overflow-hidden">
                  {proj.thumbnail_url ? (
                    <Image
                      src={proj.thumbnail_url}
                      alt={locale === "en" ? proj.title_en : proj.title_ar}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-600">
                      <FolderGit className="h-8 w-8" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-mono border border-sky-900/30 rounded-full text-sky-400 bg-sky-950/80 uppercase">
                    {proj.category_slug}
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {locale === "en" ? proj.title_en : proj.title_ar}
                    </h3>
                    <p className="text-sm text-slate-650 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {locale === "en" ? proj.description_en : proj.description_ar}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-850">
                    <Link
                      href={`/projects/${proj.id}`}
                      className="flex-1 py-2 px-3 text-center rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-sky-500/10 text-slate-700 dark:text-slate-300 hover:text-sky-400 border border-transparent hover:border-sky-500/20 text-xs font-mono font-bold transition-all"
                    >
                      {t("viewDetails")}
                    </Link>
                    {proj.live_url && (
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-white hover:bg-sky-500 hover:border-sky-500 text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1"
                      >
                        <span>{t("viewLive")}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
}
