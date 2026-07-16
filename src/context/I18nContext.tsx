"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "ar";

interface I18nContextType {
  locale: Locale;
  t: (key: keyof typeof translations.en) => string;
  setLocale: (locale: Locale) => void;
  isRtl: boolean;
}

const translations = {
  en: {
    navHome: "Home",
    navProjects: "Projects",
    navSkills: "Skills",
    navCertificates: "Certificates",
    navContact: "Contact",
    navAdmin: "Admin",
    heroIntro: "Hi, I am",
    heroTitle: "Ben H.",
    heroSubtitle: "Elite Full-Stack Web Developer & UI/UX Expert",
    heroDesc: "Crafting ultra-fast, cyber-minimalist digital experiences with React, Next.js, and Firebase.",
    downloadCV: "Download CV",
    contactMe: "Contact Me",
    featuredProjects: "Featured Projects",
    viewDetails: "View Details",
    viewLive: "View Live",
    viewAllProjects: "View All Projects",
    skillsTitle: "Technical Expertise",
    certificatesTitle: "Professional Certifications",
    contactTitle: "Get In Touch",
    contactSubtitle: "Have a project in mind? Let's build something exceptional together.",
    contactName: "Your Name",
    contactEmail: "Your Email",
    contactSubject: "Subject",
    contactMessage: "Your Message",
    contactSend: "Send Message",
    contactSending: "Sending...",
    contactSuccess: "Message sent successfully!",
    contactError: "Failed to send message. Please try again.",
    allProjects: "Portfolio Projects",
    allProjectsSubtitle: "A curated collection of my professional work and side projects",
    filterAll: "All",
    adminPanel: "Admin Dashboard",
    logout: "Logout",
    login: "Admin Login",
    loginBtn: "Login",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    loading: "Loading...",
    errorOccurred: "An error occurred",
    backToHome: "Back to Home",
    projectDetails: "Project Details",
    aboutProject: "About the Project",
    liveDemo: "Live Demo",
    githubRepo: "GitHub Repository",
    categoryLabel: "Category",
    dateLabel: "Date Created",
    noProjects: "No projects found.",
    noCertificates: "No certificates found.",
    noSkills: "No skills found.",
  },
  ar: {
    navHome: "الرئيسية",
    navProjects: "المشاريع",
    navSkills: "المهارات",
    navCertificates: "الشهادات",
    navContact: "اتصل بي",
    navAdmin: "لوحة التحكم",
    heroIntro: "مرحباً، أنا",
    heroTitle: "بن هـ.",
    heroSubtitle: "مطور ويب متكامل وخبير تجربة واجهات المستخدم",
    heroDesc: "أقوم بابتكار تجارب رقمية فائقة السرعة وذات طابع تبسيطي سيبراني باستخدام React و Next.js و Firebase.",
    downloadCV: "تحميل السيرة الذاتية",
    contactMe: "تواصل معي",
    featuredProjects: "المشاريع المميزة",
    viewDetails: "عرض التفاصيل",
    viewLive: "المعاينة المباشرة",
    viewAllProjects: "عرض جميع المشاريع",
    skillsTitle: "الخبرات التقنية",
    certificatesTitle: "الشهادات المهنية",
    contactTitle: "تواصل معي",
    contactSubtitle: "لديك مشروع في ذهنك؟ دعنا نبني شيئاً استثنائياً معاً.",
    contactName: "الاسم",
    contactEmail: "البريد الإلكتروني",
    contactSubject: "الموضوع",
    contactMessage: "نص الرسالة",
    contactSend: "إرسال الرسالة",
    contactSending: "جاري الإرسال...",
    contactSuccess: "تم إرسال الرسالة بنجاح!",
    contactError: "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.",
    allProjects: "مشاريع المعرض",
    allProjectsSubtitle: "مجموعة منسقة من أعمالي المهنية ومشاريعي الجانبية",
    filterAll: "الكل",
    adminPanel: "لوحة التحكم للمسؤول",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول للمسؤول",
    loginBtn: "تسجيل الدخول",
    emailLabel: "البريد الإلكتروني",
    passwordLabel: "كلمة المرور",
    loading: "جاري التحميل...",
    errorOccurred: "حدث خطأ ما",
    backToHome: "العودة للرئيسية",
    projectDetails: "تفاصيل المشروع",
    aboutProject: "حول المشروع",
    liveDemo: "المعاينة المباشرة",
    githubRepo: "مستودع GitHub",
    categoryLabel: "التصنيف",
    dateLabel: "تاريخ الإنشاء",
    noProjects: "لم يتم العثور على مشاريع.",
    noCertificates: "لم يتم العثور على شهادات.",
    noSkills: "لم يتم العثور على مهارات.",
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale === "en" || savedLocale === "ar") {
      setLocaleState(savedLocale);
    } else {
      // Check system language
      const isArabic = navigator.language.startsWith("ar");
      setLocaleState(isArabic ? "ar" : "en");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    root.setAttribute("lang", locale);
    root.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    localStorage.setItem("locale", locale);
  }, [locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[locale][key] || translations.en[key] || "";
  };

  const isRtl = locale === "ar";

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, isRtl }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
