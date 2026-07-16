"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/context/I18nContext";
import { getFeaturedProjects, getSkills, getCertificates, addContactMessage, Project, Skill, Certificate } from "@/firebase/db";
import { motion } from "framer-motion";
import { 
  ArrowRight, Download, Mail, Phone, MapPin, 
  Send, Sparkles, FolderGit, Award, CheckCircle, 
  ExternalLink, Terminal, Code, Cpu, Settings, Palette, Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function HomePage() {
  const { locale, t, isRtl } = useI18n();

  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [projData, skillData, certData] = await Promise.all([
          getFeaturedProjects(),
          getSkills(),
          getCertificates()
        ]);
        setProjects(projData);
        setSkills(skillData);
        setCertificates(certData);
      } catch (error) {
        console.error("Error loading home page data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error(isRtl ? "يرجى ملء جميع الحقول." : "Please fill out all fields.");
      return;
    }

    setSending(true);
    try {
      await addContactMessage({ name, email, subject, message });
      toast.success(t("contactSuccess"));
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t("contactError"));
    } finally {
      setSending(false);
    }
  };

  const handleDownloadCV = () => {
    toast.success(isRtl ? "بدء تحميل السيرة الذاتية..." : "Downloading CV...");
    // Trigger download of placeholder CV
    const link = document.createElement("a");
    link.href = "/cv.pdf";
    link.download = "Anis_Benhamida_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleScrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  // Group skills by category
  const skillCategories = {
    Frontend: skills.filter(s => s.category === "Frontend"),
    Backend: skills.filter(s => s.category === "Backend"),
    Tools: skills.filter(s => s.category === "Tools"),
    Design: skills.filter(s => s.category === "Design"),
  };

  const categoryIcons = {
    Frontend: <Code className="h-5 w-5 text-sky-400" />,
    Backend: <Cpu className="h-5 w-5 text-sky-400" />,
    Tools: <Settings className="h-5 w-5 text-sky-400" />,
    Design: <Palette className="h-5 w-5 text-sky-400" />,
  };

  return (
    <div className="relative overflow-hidden cyber-grid bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      
      {/* ================= HERO SECTION ================= */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl text-center space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass border border-slate-200 dark:border-slate-800 text-xs font-mono text-sky-600 dark:text-sky-400 bg-white/40 dark:bg-slate-900/40 uppercase tracking-widest"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>{t("heroIntro")} {t("heroTitle")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            {locale === "en" ? (
              <>
                Digital Product <span className="text-sky-500 neon-glow-text">Designer</span> & Developer
              </>
            ) : (
              <>
                مطور و <span className="text-sky-500 neon-glow-text">مصمم</span> منتجات رقمية
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-650 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            {t("heroDesc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={handleScrollToContact}
              className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-sky-500/20 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>{t("contactMe")}</span>
              <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRtl ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
            </button>
            <button
              onClick={handleDownloadCV}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-350 dark:border-slate-800 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-500/5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <Download className="h-4 w-4" />
              <span>{t("downloadCV")}</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-900 bg-white/20 dark:bg-gray-950/20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t("featuredProjects")}
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">
              {locale === "en" ? "A showcase of exactly 6 selected portfolios" : "معرض يحتوي على 6 مشاريع مختارة بدقة"}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 border border-slate-200 dark:border-slate-800 rounded-2xl shimmer-placeholder" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <p className="text-center text-slate-500 font-mono text-sm">{t("noProjects")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((proj) => (
                <motion.article
                  key={proj.id}
                  whileHover={{ y: -6 }}
                  className="glass rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-850 hover:border-sky-500/50 neon-border flex flex-col h-full bg-white dark:bg-slate-950/40"
                >
                  {/* Image wrapper */}
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

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {locale === "en" ? proj.title_en : proj.title_ar}
                      </h3>
                      <p className="text-sm text-slate-650 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {locale === "en" ? proj.description_en : proj.description_ar}
                      </p>
                    </div>

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
            </div>
          )}

          <div className="text-center pt-8">
            <Link
              href="/projects"
              className="inline-flex items-center space-x-2 py-3 px-6 rounded-xl border border-slate-350 dark:border-slate-800 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-500/5 transition-all text-sm font-mono font-bold text-slate-700 dark:text-slate-300"
            >
              <span>{t("viewAllProjects")}</span>
              <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SKILLS SECTION ================= */}
      <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-900 bg-white/10 dark:bg-slate-950/10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t("skillsTitle")}
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">
              {locale === "en" ? "My technical toolkit and proficiency levels" : "أدواتي البرمجية ومستوى التمكين المهني فيها"}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 border border-slate-200 dark:border-slate-800 rounded-2xl shimmer-placeholder" />
              ))}
            </div>
          ) : skills.length === 0 ? (
            <p className="text-center text-slate-500 font-mono text-sm">{t("noSkills")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(Object.keys(skillCategories) as Array<keyof typeof skillCategories>).map((catName) => {
                const list = skillCategories[catName];
                if (list.length === 0) return null;
                return (
                  <div key={catName} className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-850 space-y-6 bg-white dark:bg-slate-950/30">
                    <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-850 pb-3">
                      {categoryIcons[catName]}
                      <h3 className="font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        {catName} Development
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {list.map((skill) => (
                        <div key={skill.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {locale === "en" ? skill.name_en : skill.name_ar}
                            </span>
                            <span className="font-mono text-xs text-sky-500">{skill.proficiency}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="bg-sky-500 h-full rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= CERTIFICATIONS SECTION ================= */}
      <section id="certificates" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-900 bg-white/20 dark:bg-gray-950/20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t("certificatesTitle")}
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">
              {locale === "en" ? "Digital credentials validating professional competence" : "الشهادات الرقمية المعتمدة التي تؤكد الكفاءة الفنية والمهنية"}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 border border-slate-200 dark:border-slate-800 rounded-2xl shimmer-placeholder" />
              ))}
            </div>
          ) : certificates.length === 0 ? (
            <p className="text-center text-slate-500 font-mono text-sm">{t("noCertificates")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 border border-slate-200 dark:border-slate-850 hover:border-sky-500/50 bg-white dark:bg-slate-950/30 rounded-2xl flex items-center space-x-4 transition-all"
                >
                  <div className="relative h-16 w-16 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex-shrink-0 overflow-hidden">
                    {cert.image_url ? (
                      <Image src={cert.image_url} alt={cert.title_en} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-slate-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {locale === "en" ? cert.title_en : cert.title_ar}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-450 truncate">
                      {locale === "en" ? cert.issuer_en : cert.issuer_ar}
                    </p>
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400 pt-1">
                      <span>{cert.issue_date}</span>
                      {cert.credential_url && (
                        <>
                          <span className="text-slate-300 dark:text-slate-700">|</span>
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-500 hover:underline flex items-center space-x-0.5"
                          >
                            <span>Verify</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-900 bg-white/10 dark:bg-slate-950/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t("contactTitle")}
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">
              {t("contactSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Info Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-850 space-y-6 bg-white dark:bg-slate-950/30">
                <h3 className="font-mono text-sm uppercase tracking-wider text-slate-400">Direct Channels</h3>
                
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-sky-500 bg-slate-50 dark:bg-slate-900">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">EMAIL_ADDRESS</span>
                      <a href={`mailto:${t("contactEmailValue")}`} className="text-slate-700 dark:text-slate-200 hover:text-sky-500">{t("contactEmailValue")}</a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-sky-500 bg-slate-50 dark:bg-slate-900">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">TELEPHONE_NO</span>
                      <a href={t("contactPhoneHref")} className="text-slate-700 dark:text-slate-200 hover:text-sky-500">{t("contactPhoneValue")}</a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-sky-500 bg-slate-50 dark:bg-slate-900">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">CURRENT_LOC</span>
                      <span className="text-slate-700 dark:text-slate-200">{t("contactLocationValue")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-3">
              <form onSubmit={handleContactSubmit} className="glass p-8 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950/30 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-slate-450 uppercase mb-2">{t("contactName")}</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-sky-500 rounded-xl py-3 px-4 text-sm outline-none transition-all text-slate-900 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-455 uppercase mb-2">{t("contactEmail")}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-sky-500 rounded-xl py-3 px-4 text-sm outline-none transition-all text-slate-900 dark:text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-460 uppercase mb-2">{t("contactSubject")}</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-sky-500 rounded-xl py-3 px-4 text-sm outline-none transition-all text-slate-900 dark:text-white"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-465 uppercase mb-2">{t("contactMessage")}</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-sky-500 rounded-xl py-3 px-4 text-sm outline-none transition-all text-slate-900 dark:text-white resize-y"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto px-8 py-3 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-sky-500/25 flex items-center justify-center space-x-2 uppercase font-mono text-xs tracking-wider"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t("contactSending")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("contactSend")}</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
