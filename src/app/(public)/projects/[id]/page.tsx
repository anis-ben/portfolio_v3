"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/context/I18nContext";
import { getProject, Project } from "@/firebase/db";
import { 
  ArrowLeft, ExternalLink, Github, FolderGit, 
  Calendar, Link as LinkIcon, Loader2, ImageIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { locale, t } = useI18n();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (!id) return;
    
    async function loadProject() {
      try {
        const data = await getProject(id as string);
        if (!data) {
          router.push("/projects");
          return;
        }
        setProject(data);
        setActiveImage(data.thumbnail_url || "");
      } catch (error) {
        console.error("Error loading project detail:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProject();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400 mb-2" />
        <p className="text-slate-500 text-xs">fetching_project_specifications...</p>
      </div>
    );
  }

  if (!project) return null;

  const allImages = [project.thumbnail_url, ...(project.gallery_urls || [])].filter(Boolean);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 min-h-[85vh]">
      {/* Back button */}
      <Link
        href="/projects"
        className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-sky-500 transition-colors font-mono mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t("navProjects")}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Media Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-slate-200 dark:border-slate-850 bg-slate-900 rounded-2xl aspect-video overflow-hidden relative shadow-lg">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={locale === "en" ? project.title_en : project.title_ar}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 58vw"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-650">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
            <span className="absolute top-4 left-4 px-3 py-1 text-xs font-mono border border-sky-900/30 rounded-full text-sky-400 bg-sky-950/80 uppercase">
              {project.category_slug}
            </span>
          </div>

          {/* Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-16 w-24 rounded-lg overflow-hidden border transition-all relative bg-slate-900 cursor-pointer ${
                    activeImage === img
                      ? "border-sky-500 shadow-md shadow-sky-500/10 scale-95"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Preview ${idx}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Spec Sheet & Detail Texts */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {locale === "en" ? project.title_en : project.title_ar}
            </h1>
            <p className="text-slate-500 font-mono text-xs flex items-center space-x-2">
              <FolderGit className="h-4 w-4 text-sky-500" />
              <span>CATEGORY: <span className="uppercase text-sky-500">{project.category_slug}</span></span>
            </p>
          </div>

          {/* Quick Specifications list */}
          <div className="border-t border-b border-slate-200 dark:border-slate-850 py-6 space-y-4 font-mono text-xs">
            {project.created_at && (
              <div className="flex items-center justify-between">
                <span className="text-slate-450 flex items-center space-x-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{t("dateLabel")}</span>
                </span>
                <span className="text-slate-800 dark:text-slate-200">{project.created_at.split("T")[0]}</span>
              </div>
            )}

            {project.live_url && (
              <div className="flex items-center justify-between">
                <span className="text-slate-450 flex items-center space-x-1">
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>{t("liveDemo")}</span>
                </span>
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-500 hover:underline flex items-center space-x-1"
                >
                  <span>launch_demo</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {project.github_url && (
              <div className="flex items-center justify-between">
                <span className="text-slate-450 flex items-center space-x-1">
                  <Github className="h-3.5 w-3.5" />
                  <span>{t("githubRepo")}</span>
                </span>
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 dark:text-slate-350 hover:text-sky-500 hover:underline flex items-center space-x-1"
                >
                  <span>view_source</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* Project Content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-base font-mono uppercase tracking-wider text-slate-450">{t("aboutProject")}</h2>
              <p className="text-slate-650 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {locale === "en" ? project.description_en : project.description_ar}
              </p>
            </div>

            {/* Detailed Content field (Renders if available) */}
            {(project.content_en || project.content_ar) && (
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-850">
                <h2 className="text-base font-mono uppercase tracking-wider text-slate-455">
                  {locale === "en" ? "Technical breakdown" : "التفاصيل الفنية"}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-mono whitespace-pre-line bg-slate-100/50 dark:bg-slate-900/40 p-4 border border-slate-200 dark:border-slate-850 rounded-xl">
                  {locale === "en" ? project.content_en : project.content_ar}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
