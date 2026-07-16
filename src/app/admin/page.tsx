"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";
import { toast } from "sonner";
import {
  getCategories, addCategory, deleteCategory, Category,
  getProjects, addProject, updateProject, deleteProject, Project,
  getSkills, addSkill, updateSkill, deleteSkill, Skill,
  getCertificates, addCertificate, updateCertificate, deleteCertificate, Certificate
} from "@/firebase/db";
import { uploadToStorage, deleteFromStorage } from "@/firebase/storage";
import { compressImageToWebP } from "@/utils/imageCompressor";
import { 
  FolderGit, Award, Briefcase, Plus, Trash2, Edit2, Check, X, 
  Upload, Image as ImageIcon, Link as LinkIcon, Calendar, Sliders, Loader2, Sparkles 
} from "lucide-react";

type Tab = "projects" | "skills" | "certificates";

const adminTranslations = {
  en: {
    tabProjects: "Projects & Categories",
    tabSkills: "Skills Directory",
    tabCertificates: "Certifications",
    editProjectMetadata: "EDIT_PROJECT_METADATA",
    createNewProject: "CREATE_NEW_PROJECT",
    titleEn: "Title (English) *",
    titleAr: "Title (Arabic) *",
    category: "Category *",
    featureOnLanding: "Feature this project on landing page",
    shortDescEn: "Short Description (English) *",
    shortDescAr: "Short Description (Arabic) *",
    detailedContEn: "Detailed Content (English)",
    detailedContAr: "Detailed Content (Arabic)",
    liveDemoUrl: "Live Demo URL",
    githubUrl: "GitHub URL",
    projectMedia: "Project Media Files",
    primaryThumbnail: "Primary Thumbnail",
    chooseFile: "Choose File",
    galleryImages: "Image Gallery / Content Images",
    addGalleryImages: "Add Gallery Images",
    stagedFiles: "files staged for upload",
    statusText: "[status]:",
    cancel: "CANCEL",
    commitChanges: "COMMIT_CHANGES",
    saving: "SAVING...",
    projectsDirectory: "Projects Directory",
    addProject: "ADD_PROJECT",
    noProjects: "No projects registered yet.",
    categories: "Categories",
    addCategory: "Add Category",
    categoryNameEn: "Category Name (English)",
    categoryNameAr: "Category Name (Arabic)",
    categorySlug: "Category Slug",
    addCategoryBtn: "ADD_CATEGORY",
    skillsList: "Skills List",
    addSkill: "ADD_SKILL",
    noSkills: "No skills registered yet.",
    certificatesDirectory: "Certificates Directory",
    addCertificate: "ADD_CERTIFICATE",
    noCertificates: "No certificates registered yet.",
    editSkill: "EDIT_SKILL",
    createNewSkill: "CREATE_NEW_SKILL",
    skillNameEn: "Skill Name (English) *",
    skillNameAr: "Skill Name (Arabic) *",
    proficiency: "Proficiency Level *",
    displayOrder: "Display Sort Order",
    editCertificate: "EDIT_CERTIFICATE",
    createNewCertificate: "CREATE_NEW_CERTIFICATE",
    certTitleEn: "Title (English) *",
    certTitleAr: "Title (Arabic) *",
    issuerEn: "Issuer (English) *",
    issuerAr: "Issuer (Arabic) *",
    issueDate: "Issue Date (YYYY-MM) *",
    credentialUrl: "Credential URL",
    certificateMedia: "Certificate Badge / Image",
    confirmDeleteProj: "Are you sure you want to delete this project?",
    confirmDeleteCat: "Are you sure you want to delete this category?",
    confirmDeleteSkill: "Are you sure you want to delete this skill?",
    confirmDeleteCert: "Are you sure you want to delete this certificate?",
    uploadImage: "Upload Image",
    activeCategories: "Active Categories",
    techSkillsDirectory: "Technical Skills Directory",
    editSkillMetadata: "EDIT_SKILL_METADATA",
    registerNewSkill: "REGISTER_NEW_SKILL",
    committing: "COMMITTING...",
    saveSkill: "SAVE_SKILL",
    editCertMetadata: "EDIT_CERTIFICATE_METADATA",
    registerNewCert: "REGISTER_NEW_CERTIFICATE",
    saveCert: "SAVE_CERTIFICATE",
    certsDigitalRegistry: "Certificates Digital Registry",
    featured: "featured",
    taxonomyCategories: "Taxonomy Categories",
    addNewCategory: "[add_new_category]"
  },
  ar: {
    tabProjects: "المشاريع والتصنيفات",
    tabSkills: "دليل المهارات",
    tabCertificates: "الشهادات",
    editProjectMetadata: "تعديل بيانات المشروع",
    createNewProject: "إنشاء مشروع جديد",
    titleEn: "العنوان (بالإنجليزية) *",
    titleAr: "العنوان (بالعربية) *",
    category: "التصنيف *",
    featureOnLanding: "عرض هذا المشروع في الصفحة الرئيسية",
    shortDescEn: "وصف قصير (بالإنجليزية) *",
    shortDescAr: "وصف قصير (بالعربية) *",
    detailedContEn: "محتوى تفصيلي (بالإنجليزية)",
    detailedContAr: "محتوى تفصيلي (بالعربية)",
    liveDemoUrl: "رابط المعاينة الحية",
    githubUrl: "رابط مستودع GitHub",
    projectMedia: "ملفات وسائط المشروع",
    primaryThumbnail: "الصورة المصغرة الأساسية",
    chooseFile: "اختر ملفاً",
    galleryImages: "معرض الصور / صور المحتوى",
    addGalleryImages: "إضافة صور للمعرض",
    stagedFiles: "ملفات جاهزة للرفع",
    statusText: "[الحالة]:",
    cancel: "إلغاء",
    commitChanges: "حفظ التغييرات",
    saving: "جاري الحفظ...",
    projectsDirectory: "دليل المشاريع",
    addProject: "إضافة مشروع",
    noProjects: "لم يتم تسجيل أي مشاريع بعد.",
    categories: "التصنيفات",
    addCategory: "إضافة تصنيف جديد",
    categoryNameEn: "اسم التصنيف (بالإنجليزية)",
    categoryNameAr: "اسم التصنيف (بالعربية)",
    categorySlug: "الرابط المختصر (Slug)",
    addCategoryBtn: "إضافة تصنيف",
    skillsList: "قائمة المهارات",
    addSkill: "إضافة مهارة",
    noSkills: "لم يتم تسجيل أي مهارات بعد.",
    certificatesDirectory: "دليل الشهادات",
    addCertificate: "إضافة شهادة",
    noCertificates: "لم يتم تسجيل أي شهادات بعد.",
    editSkill: "تعديل المهارة",
    createNewSkill: "إنشاء مهارة جديدة",
    skillNameEn: "اسم المهارة (بالإنجليزية) *",
    skillNameAr: "اسم المهارة (بالعربية) *",
    proficiency: "نسبة الإتقان *",
    displayOrder: "ترتيب العرض",
    editCertificate: "تعديل الشهادة",
    createNewCertificate: "إضافة شهادة جديدة",
    certTitleEn: "العنوان (بالإنجليزية) *",
    certTitleAr: "العنوان (بالعربية) *",
    issuerEn: "الجهة المانحة (بالإنجليزية) *",
    issuerAr: "الجهة المانحة (بالعربية) *",
    issueDate: "تاريخ الإصدار (YYYY-MM) *",
    credentialUrl: "رابط إثبات الشهادة",
    certificateMedia: "صورة الشهادة",
    confirmDeleteProj: "هل أنت متأكد من رغبتك في حذف هذا المشروع؟",
    confirmDeleteCat: "هل أنت متأكد من رغبتك في حذف هذا التصنيف؟",
    confirmDeleteSkill: "هل أنت متأكد من رغبتك في حذف هذه المهارة؟",
    confirmDeleteCert: "هل أنت متأكد من رغبتك في حذف هذه الشهادة؟",
    uploadImage: "رفع صورة",
    activeCategories: "التصنيفات النشطة",
    techSkillsDirectory: "دليل المهارات التقنية",
    editSkillMetadata: "تعديل بيانات المهارة",
    registerNewSkill: "تسجيل مهارة جديدة",
    committing: "جاري الحفظ...",
    saveSkill: "حفظ المهارة",
    editCertMetadata: "تعديل بيانات الشهادة",
    registerNewCert: "تسجيل شهادة جديدة",
    saveCert: "حفظ الشهادة",
    certsDigitalRegistry: "السجل الرقمي للشهادات",
    featured: "مميز",
    taxonomyCategories: "تصنيفات المشاريع",
    addNewCategory: "[إضافة_تصنيف_جديد]"
  }
};

export default function AdminDashboard() {
  const { locale } = useI18n();
  const adminT = (key: keyof typeof adminTranslations.en) => {
    return adminTranslations[locale][key] || adminTranslations.en[key] || "";
  };
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [loading, setLoading] = useState(true);

  // Database Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Category Form State
  const [newCatNameEn, setNewCatNameEn] = useState("");
  const [newCatNameAr, setNewCatNameAr] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [savingCat, setSavingCat] = useState(false);

  // Project Form States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjForm, setShowProjForm] = useState(false);
  const [savingProj, setSavingProj] = useState(false);
  const [projTitleEn, setProjTitleEn] = useState("");
  const [projTitleAr, setProjTitleAr] = useState("");
  const [projDescEn, setProjDescEn] = useState("");
  const [projDescAr, setProjDescAr] = useState("");
  const [projContEn, setProjContEn] = useState("");
  const [projContAr, setProjContAr] = useState("");
  const [projCat, setProjCat] = useState("");
  const [projLive, setProjLive] = useState("");
  const [projGit, setProjGit] = useState("");
  const [projFeatured, setProjFeatured] = useState(false);
  
  // Project Image Files
  const [projThumbFile, setProjThumbFile] = useState<File | null>(null);
  const [projThumbUrl, setProjThumbUrl] = useState(""); // Current URL (editing or uploaded)
  const [projGalleryFiles, setProjGalleryFiles] = useState<File[]>([]);
  const [projGalleryUrls, setProjGalleryUrls] = useState<string[]>([]); // Current URLs
  const [uploadProgress, setUploadProgress] = useState("");

  // Skill Form States
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [savingSkill, setSavingSkill] = useState(false);
  const [skillNameEn, setSkillNameEn] = useState("");
  const [skillNameAr, setSkillNameAr] = useState("");
  const [skillCat, setSkillCat] = useState("Frontend");
  const [skillProf, setSkillProf] = useState(80);
  const [skillOrder, setSkillOrder] = useState(0);

  // Certificate Form States
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [showCertForm, setShowCertForm] = useState(false);
  const [savingCert, setSavingCert] = useState(false);
  const [certTitleEn, setCertTitleEn] = useState("");
  const [certTitleAr, setCertTitleAr] = useState("");
  const [certIssuerEn, setCertIssuerEn] = useState("");
  const [certIssuerAr, setCertIssuerAr] = useState("");
  const [certDate, setCertDate] = useState(""); // YYYY-MM
  const [certCredUrl, setCertCredUrl] = useState("");
  const [certImgFile, setCertImgFile] = useState<File | null>(null);
  const [certImgUrl, setCertImgUrl] = useState("");

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [catsData, projsData, skillsData, certsData] = await Promise.all([
          getCategories(),
          getProjects(),
          getSkills(),
          getCertificates(),
        ]);
        setCategories(catsData);
        setProjects(projsData);
        setSkills(skillsData);
        setCertificates(certsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data. Check database permissions.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync category slug automatically
  useEffect(() => {
    if (!editingProject) {
      setNewCatSlug(newCatNameEn.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"));
    }
  }, [newCatNameEn, editingProject]);

  // --- Category Handlers ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameEn || !newCatNameAr || !newCatSlug) {
      toast.error("Please fill in all category fields.");
      return;
    }
    setSavingCat(true);
    try {
      const newCat: Category = {
        id: newCatSlug,
        name_en: newCatNameEn,
        name_ar: newCatNameAr,
        slug: newCatSlug,
      };
      await addCategory(newCat);
      setCategories([...categories, newCat]);
      setNewCatNameEn("");
      setNewCatNameAr("");
      setNewCatSlug("");
      toast.success("Category added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category.");
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(slug);
      setCategories(categories.filter((cat) => cat.slug !== slug));
      toast.success("Category deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category.");
    }
  };

  // --- Project Handlers ---
  const handleOpenNewProject = () => {
    setEditingProject(null);
    setProjTitleEn("");
    setProjTitleAr("");
    setProjDescEn("");
    setProjDescAr("");
    setProjContEn("");
    setProjContAr("");
    setProjCat(categories[0]?.slug || "");
    setProjLive("");
    setProjGit("");
    setProjFeatured(false);
    setProjThumbFile(null);
    setProjThumbUrl("");
    setProjGalleryFiles([]);
    setProjGalleryUrls([]);
    setShowProjForm(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjTitleEn(proj.title_en);
    setProjTitleAr(proj.title_ar);
    setProjDescEn(proj.description_en);
    setProjDescAr(proj.description_ar);
    setProjContEn(proj.content_en);
    setProjContAr(proj.content_ar);
    setProjCat(proj.category_slug);
    setProjLive(proj.live_url || "");
    setProjGit(proj.github_url || "");
    setProjFeatured(proj.is_featured);
    setProjThumbFile(null);
    setProjThumbUrl(proj.thumbnail_url);
    setProjGalleryFiles([]);
    setProjGalleryUrls(proj.gallery_urls || []);
    setShowProjForm(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitleEn || !projTitleAr || !projDescEn || !projDescAr || !projCat) {
      toast.error("Please fill in required fields (Title, Description, Category).");
      return;
    }

    setSavingProj(true);
    setUploadProgress("Compressing and uploading images...");

    try {
      let finalThumbUrl = projThumbUrl;
      const finalGalleryUrls = [...projGalleryUrls];
      const projectSlug = projTitleEn.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

      // 1. Upload thumbnail if exists
      if (projThumbFile) {
        setUploadProgress(locale === "en" ? "Optimizing thumbnail..." : "جاري تحسين الصورة المصغرة...");
        const compressedThumb = await compressImageToWebP(projThumbFile);
        setUploadProgress(locale === "en" ? "Uploading thumbnail: 0%" : "جاري رفع الصورة المصغرة: 0%");
        const thumbPath = `projects/${projectSlug}/thumbnail_${Date.now()}.webp`;
        
        // Delete old thumb if editing
        if (editingProject && projThumbUrl) {
          await deleteFromStorage(projThumbUrl);
        }
        finalThumbUrl = await uploadToStorage(compressedThumb, thumbPath, (p) => {
          setUploadProgress(locale === "en" ? `Uploading thumbnail: ${p}%` : `جاري رفع الصورة المصغرة: ${p}%`);
        });
      }

      // 2. Upload gallery images if exist
      if (projGalleryFiles.length > 0) {
        for (let i = 0; i < projGalleryFiles.length; i++) {
          setUploadProgress(
            locale === "en" 
              ? `Optimizing gallery image ${i + 1}/${projGalleryFiles.length}...` 
              : `جاري تحسين صورة المعرض ${i + 1}/${projGalleryFiles.length}...`
          );
          const file = projGalleryFiles[i];
          const compressed = await compressImageToWebP(file);
          setUploadProgress(
            locale === "en" 
              ? `Uploading gallery image ${i + 1}/${projGalleryFiles.length}: 0%` 
              : `جاري رفع صورة المعرض ${i + 1}/${projGalleryFiles.length}: 0%`
          );
          const galleryPath = `projects/${projectSlug}/gallery/image_${Date.now()}_${i}.webp`;
          const url = await uploadToStorage(compressed, galleryPath, (p) => {
            setUploadProgress(
              locale === "en" 
                ? `Uploading gallery image ${i + 1}/${projGalleryFiles.length}: ${p}%` 
                : `جاري رفع صورة المعرض ${i + 1}/${projGalleryFiles.length}: ${p}%`
            );
          });
          finalGalleryUrls.push(url);
        }
      }

      const projectData = {
        title_en: projTitleEn,
        title_ar: projTitleAr,
        description_en: projDescEn,
        description_ar: projDescAr,
        content_en: projContEn,
        content_ar: projContAr,
        category_slug: projCat,
        live_url: projLive,
        github_url: projGit,
        is_featured: projFeatured,
        thumbnail_url: finalThumbUrl,
        gallery_urls: finalGalleryUrls,
      };

      if (editingProject) {
        await updateProject(editingProject.id, projectData);
        toast.success("Project updated successfully!");
      } else {
        await addProject(projectData);
        toast.success("Project added successfully!");
      }

      // Reload project listings
      const updatedProjs = await getProjects();
      setProjects(updatedProjs);
      setShowProjForm(false);
    } catch (error: any) {
      console.error(error);
      let errorMsg = locale === "en" ? "Failed to save project." : "فشل حفظ المشروع.";
      if (error?.code?.startsWith("storage/")) {
        if (error.code === "storage/unauthorized") {
          errorMsg = locale === "en" 
            ? "Firebase Storage permission denied. Please check your storage rules." 
            : "تم رفض الإذن لـ Firebase Storage. يرجى التحقق من القواعد الأمنية.";
        } else if (error.code === "storage/unknown" || error.status === 404) {
          errorMsg = locale === "en"
            ? "Firebase Storage bucket not found. Please activate Storage in the Firebase Console."
            : "مخزن ملفات الفايربيس (Storage Bucket) غير موجود. يرجى تفعيل الـ Storage من لوحة تحكم Firebase أولاً.";
        } else {
          errorMsg = locale === "en"
            ? `Firebase Storage error: ${error.message}`
            : `خطأ في Firebase Storage: ${error.message}`;
        }
      }
      toast.error(errorMsg);
    } finally {
      setSavingProj(false);
      setUploadProgress("");
    }
  };

  const handleDeleteProject = async (proj: Project) => {
    if (!confirm(`Are you sure you want to delete "${proj.title_en}"?`)) return;
    try {
      // Clear storage
      if (proj.thumbnail_url) await deleteFromStorage(proj.thumbnail_url);
      if (proj.gallery_urls) {
        await Promise.all(proj.gallery_urls.map(url => deleteFromStorage(url)));
      }
      // Clear database
      await deleteProject(proj.id);
      setProjects(projects.filter((p) => p.id !== proj.id));
      toast.success("Project deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project.");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    const updated = [...projGalleryUrls];
    // We could delete the actual file in storage, but keeping it simple for now,
    // we'll update the document on saving.
    updated.splice(index, 1);
    setProjGalleryUrls(updated);
  };

  // --- Skill Handlers ---
  const handleOpenNewSkill = () => {
    setEditingSkill(null);
    setSkillNameEn("");
    setSkillNameAr("");
    setSkillCat("Frontend");
    setSkillProf(80);
    setSkillOrder(skills.length);
    setShowSkillForm(true);
  };

  const handleOpenEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillNameEn(skill.name_en);
    setSkillNameAr(skill.name_ar);
    setSkillCat(skill.category);
    setSkillProf(skill.proficiency);
    setSkillOrder(skill.order);
    setShowSkillForm(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillNameEn || !skillNameAr || !skillCat) {
      toast.error("Please fill in all skill fields.");
      return;
    }
    setSavingSkill(true);
    try {
      const skillData = {
        name_en: skillNameEn,
        name_ar: skillNameAr,
        category: skillCat,
        proficiency: Number(skillProf),
        order: Number(skillOrder),
      };

      if (editingSkill) {
        await updateSkill(editingSkill.id, skillData);
        toast.success("Skill updated.");
      } else {
        await addSkill(skillData);
        toast.success("Skill added.");
      }

      const updatedSkills = await getSkills();
      setSkills(updatedSkills);
      setShowSkillForm(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save skill.");
    } finally {
      setSavingSkill(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await deleteSkill(id);
      setSkills(skills.filter((sk) => sk.id !== id));
      toast.success("Skill deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete skill.");
    }
  };

  // --- Certificate Handlers ---
  const handleOpenNewCert = () => {
    setEditingCert(null);
    setCertTitleEn("");
    setCertTitleAr("");
    setCertIssuerEn("");
    setCertIssuerAr("");
    setCertDate("");
    setCertCredUrl("");
    setCertImgFile(null);
    setCertImgUrl("");
    setShowCertForm(true);
  };

  const handleOpenEditCert = (cert: Certificate) => {
    setEditingCert(cert);
    setCertTitleEn(cert.title_en);
    setCertTitleAr(cert.title_ar);
    setCertIssuerEn(cert.issuer_en);
    setCertIssuerAr(cert.issuer_ar);
    setCertDate(cert.issue_date);
    setCertCredUrl(cert.credential_url || "");
    setCertImgFile(null);
    setCertImgUrl(cert.image_url);
    setShowCertForm(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitleEn || !certTitleAr || !certIssuerEn || !certIssuerAr || !certDate) {
      toast.error("Please fill in all required certificate fields.");
      return;
    }
    setSavingCert(true);
    setUploadProgress("Optimizing and saving certificate...");

    try {
      let finalImgUrl = certImgUrl;

      if (certImgFile) {
        setUploadProgress(locale === "en" ? "Optimizing certificate image..." : "جاري تحسين صورة الشهادة...");
        const compressed = await compressImageToWebP(certImgFile);
        const slug = certTitleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const path = `certificates/${slug}_${Date.now()}.webp`;
        
        if (editingCert && certImgUrl) {
          await deleteFromStorage(certImgUrl);
        }
        setUploadProgress(locale === "en" ? "Uploading certificate: 0%" : "جاري رفع الشهادة: 0%");
        finalImgUrl = await uploadToStorage(compressed, path, (p) => {
          setUploadProgress(locale === "en" ? `Uploading certificate: ${p}%` : `جاري رفع الشهادة: ${p}%`);
        });
      }

      const certData = {
        title_en: certTitleEn,
        title_ar: certTitleAr,
        issuer_en: certIssuerEn,
        issuer_ar: certIssuerAr,
        issue_date: certDate,
        credential_url: certCredUrl,
        image_url: finalImgUrl,
      };

      if (editingCert) {
        await updateCertificate(editingCert.id, certData);
        toast.success("Certificate updated.");
      } else {
        await addCertificate(certData);
        toast.success("Certificate added.");
      }

      const updatedCerts = await getCertificates();
      setCertificates(updatedCerts);
      setShowCertForm(false);
    } catch (error: any) {
      console.error(error);
      let errorMsg = locale === "en" ? "Failed to save certificate." : "فشل حفظ الشهادة.";
      if (error?.code?.startsWith("storage/")) {
        if (error.code === "storage/unauthorized") {
          errorMsg = locale === "en" 
            ? "Firebase Storage permission denied. Please check your storage rules." 
            : "تم رفض الإذن لـ Firebase Storage. يرجى التحقق من القواعد الأمنية.";
        } else if (error.code === "storage/unknown" || error.status === 404) {
          errorMsg = locale === "en"
            ? "Firebase Storage bucket not found. Please activate Storage in the Firebase Console."
            : "مخزن ملفات الفايربيس (Storage Bucket) غير موجود. يرجى تفعيل الـ Storage من لوحة تحكم Firebase أولاً.";
        } else {
          errorMsg = locale === "en"
            ? `Firebase Storage error: ${error.message}`
            : `خطأ في Firebase Storage: ${error.message}`;
        }
      }
      toast.error(errorMsg);
    } finally {
      setSavingCert(false);
      setUploadProgress("");
    }
  };

  const handleDeleteCert = async (cert: Certificate) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      if (cert.image_url) await deleteFromStorage(cert.image_url);
      await deleteCertificate(cert.id);
      setCertificates(certificates.filter((c) => c.id !== cert.id));
      toast.success("Certificate deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete certificate.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-mono">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400 mb-2" />
        <p className="text-slate-500 text-xs">{locale === "en" ? "loading_dashboard_data..." : "جاري تحميل بيانات لوحة التحكم..."}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Tab Navigation header */}
      <div className="flex space-x-1 sm:space-x-2 border-b border-slate-800 pb-px mb-8">
        <button
          onClick={() => { setActiveTab("projects"); setShowProjForm(false); }}
          className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
            activeTab === "projects"
              ? "border-sky-500 text-sky-400 bg-sky-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FolderGit className="h-4 w-4" />
          <span>{adminT("tabProjects")}</span>
        </button>
        <button
          onClick={() => { setActiveTab("skills"); setShowSkillForm(false); }}
          className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
            activeTab === "skills"
              ? "border-sky-500 text-sky-400 bg-sky-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>{adminT("tabSkills")}</span>
        </button>
        <button
          onClick={() => { setActiveTab("certificates"); setShowCertForm(false); }}
          className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
            activeTab === "certificates"
              ? "border-sky-500 text-sky-400 bg-sky-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Award className="h-4 w-4" />
          <span>{adminT("tabCertificates")}</span>
        </button>
      </div>

      {/* ================================== TAB 1: PROJECTS & CATEGORIES ================================== */}
      {activeTab === "projects" && (
        <div className="space-y-10">
          {showProjForm ? (
            /* PROJECT EDIT FORM */
            <div className="glass bg-slate-950/40 p-6 rounded-2xl border border-slate-800 max-w-4xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <h2 className="text-lg font-mono font-bold text-sky-400 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>{editingProject ? adminT("editProjectMetadata") : adminT("createNewProject")}</span>
                </h2>
                <button
                  onClick={() => setShowProjForm(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-6">
                {/* Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-2">{adminT("titleEn")}</label>
                    <input
                      type="text"
                      required
                      value={projTitleEn}
                      onChange={(e) => setProjTitleEn(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3.5 text-sm focus:border-sky-500 outline-none text-white transition-all"
                      placeholder="My Awesome App"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-2">{adminT("titleAr")}</label>
                    <input
                      type="text"
                      required
                      value={projTitleAr}
                      onChange={(e) => setProjTitleAr(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3.5 text-sm focus:border-sky-500 outline-none text-white transition-all text-right"
                      placeholder="مشروعي الرائع"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Category & Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-2">{adminT("category")}</label>
                    <select
                      value={projCat}
                      onChange={(e) => setProjCat(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3.5 text-sm focus:border-sky-500 outline-none text-white transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {locale === "en" ? cat.name_en : cat.name_ar} ({cat.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center h-11 px-1">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projFeatured}
                        onChange={(e) => setProjFeatured(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-sky-500 focus:ring-sky-500 h-5 w-5"
                      />
                      <span className="text-sm font-mono text-slate-300">{adminT("featureOnLanding")}</span>
                    </label>
                  </div>
                </div>

                {/* Short Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-2">{adminT("shortDescEn")}</label>
                    <textarea
                      required
                      rows={3}
                      value={projDescEn}
                      onChange={(e) => setProjDescEn(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all resize-y"
                      placeholder="Brief overview of the project highlights..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-2">{adminT("shortDescAr")}</label>
                    <textarea
                      required
                      rows={3}
                      value={projDescAr}
                      onChange={(e) => setProjDescAr(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all text-right resize-y"
                      placeholder="نبذة مختصرة عن المشروع والمزايا الرئيسية..."
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Detailed Contents (MD or Rich Text) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-2">{adminT("detailedContEn")}</label>
                    <textarea
                      rows={6}
                      value={projContEn}
                      onChange={(e) => setProjContEn(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all font-mono resize-y"
                      placeholder="Detailed architectural notes, design decisions, tech specs..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-2">{adminT("detailedContAr")}</label>
                    <textarea
                      rows={6}
                      value={projContAr}
                      onChange={(e) => setProjContAr(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all text-right font-mono resize-y"
                      placeholder="مواصفات التصميم، الهيكل البرمجي والقرارات التقنية بالتفصيل..."
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* External Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-2">{adminT("liveDemoUrl")}</label>
                    <input
                      type="url"
                      value={projLive}
                      onChange={(e) => setProjLive(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3.5 text-sm focus:border-sky-500 outline-none text-white transition-all font-mono"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-2">{adminT("githubUrl")}</label>
                    <input
                      type="url"
                      value={projGit}
                      onChange={(e) => setProjGit(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3.5 text-sm focus:border-sky-500 outline-none text-white transition-all font-mono"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                {/* Media Upload (Primary Thumbnail Uploader) */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">{adminT("projectMedia")}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thumbnail */}
                    <div className="border border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-950/20">
                      <span className="block text-xs font-mono text-slate-400 mb-2 uppercase">{adminT("primaryThumbnail")}</span>
                      
                      {projThumbUrl && !projThumbFile && (
                        <div className="relative mb-3 border border-slate-800 rounded-lg overflow-hidden h-28 w-44">
                          <img src={projThumbUrl} alt="Thumbnail Preview" className="h-full w-full object-cover" />
                        </div>
                      )}

                      {projThumbFile && (
                        <div className="relative mb-3 border border-sky-900/50 rounded-lg overflow-hidden h-28 w-44 bg-slate-900 flex items-center justify-center">
                          <span className="text-xs font-mono text-sky-400">Selected: {projThumbFile.name}</span>
                        </div>
                      )}

                      <label className="py-1.5 px-3 bg-slate-900 border border-slate-800 hover:border-sky-500 rounded-lg text-xs text-slate-300 hover:text-white cursor-pointer font-mono flex items-center space-x-1.5 transition-all">
                        <Upload className="h-3.5 w-3.5" />
                        <span>{adminT("chooseFile")}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProjThumbFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Gallery Images */}
                    <div className="border border-dashed border-slate-800 rounded-xl p-4 flex flex-col bg-slate-950/20">
                      <span className="block text-xs font-mono text-slate-400 mb-2 uppercase text-center">{adminT("galleryImages")}</span>
                      
                      {/* Current Gallery List */}
                      {projGalleryUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 max-h-24 overflow-y-auto">
                          {projGalleryUrls.map((url, idx) => (
                            <div key={idx} className="relative h-12 w-20 border border-slate-800 rounded overflow-hidden group">
                              <img src={url} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="absolute inset-0 bg-red-950/80 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="text-[10px] font-mono text-slate-500 text-center mb-2">
                        {projGalleryFiles.length} {adminT("stagedFiles")}
                      </span>

                      <label className="py-1.5 px-3 bg-slate-900 border border-slate-800 hover:border-sky-500 rounded-lg text-xs text-slate-300 hover:text-white cursor-pointer font-mono flex items-center justify-center space-x-1.5 transition-all w-fit mx-auto">
                        <Upload className="h-3.5 w-3.5" />
                        <span>{adminT("addGalleryImages")}</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files) {
                              setProjGalleryFiles([...projGalleryFiles, ...Array.from(e.target.files)]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {uploadProgress && (
                  <div className="text-xs font-mono text-sky-400 animate-pulse bg-sky-950/20 py-2 px-3 border border-sky-900/30 rounded-lg">
                    {adminT("statusText")} {uploadProgress}
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex justify-end space-x-3 border-t border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProjForm(false)}
                    className="py-2 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-sm transition-all cursor-pointer font-mono"
                  >
                    {adminT("cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={savingProj}
                    className="py-2 px-4 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-sm transition-all cursor-pointer font-mono flex items-center space-x-2"
                  >
                    {savingProj ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{adminT("saving")}</span>
                      </>
                    ) : (
                      <span>{adminT("commitChanges")}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* PROJECT LISTINGS & CATEGORY ADDER */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Projects List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400">{adminT("projectsDirectory")}</h2>
                  <button
                    onClick={handleOpenNewProject}
                    className="py-1 px-3 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs rounded-md transition-all flex items-center space-x-1 cursor-pointer font-mono"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{adminT("addProject")}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {projects.length === 0 ? (
                    <p className="text-slate-500 font-mono text-xs">{adminT("noProjects")}</p>
                  ) : (
                    projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 bg-slate-950/20 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-16 border border-slate-850 rounded overflow-hidden bg-slate-900 flex-shrink-0">
                            {proj.thumbnail_url ? (
                              <img src={proj.thumbnail_url} alt={proj.title_en} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-650">
                                <ImageIcon className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">{proj.title_en}</h3>
                            <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 mt-1">
                              <span className="px-1.5 py-0.5 border border-slate-800 rounded bg-slate-900">{proj.category_slug}</span>
                              {proj.is_featured && (
                                <span className="px-1.5 py-0.5 border border-amber-900/40 text-amber-500 rounded bg-amber-950/10">{adminT("featured")}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenEditProject(proj)}
                            className="p-2 border border-slate-800 hover:border-sky-500/50 hover:text-sky-400 rounded-lg text-slate-400 transition-all cursor-pointer"
                            title="Edit project"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj)}
                            className="p-2 border border-slate-800 hover:border-red-500/50 hover:text-red-400 rounded-lg text-slate-400 transition-all cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Categories Management Panel */}
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-3">
                  <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400">{adminT("taxonomyCategories")}</h2>
                </div>

                {/* Add Category Form */}
                <form onSubmit={handleAddCategory} className="space-y-4 p-4 border border-slate-800 rounded-xl bg-slate-950/20">
                  <span className="block text-xs font-mono text-slate-400 uppercase">{adminT("addNewCategory")}</span>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 mb-1">{adminT("categoryNameEn")}</label>
                    <input
                      type="text"
                      required
                      value={newCatNameEn}
                      onChange={(e) => setNewCatNameEn(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs outline-none text-white focus:border-sky-500"
                      placeholder="E.g., Web Apps"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 mb-1">{adminT("categoryNameAr")}</label>
                    <input
                      type="text"
                      required
                      value={newCatNameAr}
                      onChange={(e) => setNewCatNameAr(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs outline-none text-white text-right focus:border-sky-500"
                      placeholder="مثال: تطبيقات الويب"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 mb-1">{adminT("categorySlug")}</label>
                    <input
                      type="text"
                      required
                      value={newCatSlug}
                      onChange={(e) => setNewCatSlug(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs outline-none text-slate-400 font-mono focus:border-sky-500"
                      placeholder="web-apps"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingCat}
                    className="w-full py-1.5 bg-slate-900 border border-slate-850 hover:border-sky-500 hover:text-sky-400 text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    {savingCat ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                    <span>{adminT("addCategoryBtn")}</span>
                  </button>
                </form>

                {/* Categories List */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">{adminT("activeCategories")} ({categories.length})</span>
                  {categories.length === 0 ? (
                    <p className="text-slate-500 font-mono text-xs">{locale === "en" ? "No categories created yet." : "لم يتم إنشاء تصنيفات بعد."}</p>
                  ) : (
                    categories.map((cat) => (
                      <div
                        key={cat.slug}
                        className="py-2 px-3 border border-slate-850 bg-slate-950/10 rounded-lg flex items-center justify-between text-xs font-mono"
                      >
                        <div className="truncate pr-2">
                          <span className="text-slate-300 font-semibold">{cat.name_en}</span>
                          <span className="text-slate-500 block text-[10px]">slug: {cat.slug}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(cat.slug)}
                          className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================== TAB 2: SKILLS DIRECTORY ================================== */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400">{adminT("techSkillsDirectory")}</h2>
            {!showSkillForm && (
              <button
                onClick={handleOpenNewSkill}
                className="py-1 px-3 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs rounded-md transition-all flex items-center space-x-1 cursor-pointer font-mono"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{adminT("addSkill")}</span>
              </button>
            )}
          </div>

          {showSkillForm ? (
            /* SKILLS FORM */
            <form onSubmit={handleSaveSkill} className="glass bg-slate-950/40 p-6 rounded-2xl border border-slate-800 max-w-xl space-y-4">
              <span className="block text-xs font-mono text-sky-400 uppercase font-bold">
                {editingSkill ? adminT("editSkillMetadata") : adminT("registerNewSkill")}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">{adminT("skillNameEn")}</label>
                  <input
                    type="text"
                    required
                    value={skillNameEn}
                    onChange={(e) => setSkillNameEn(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all"
                    placeholder="React.js"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">{adminT("skillNameAr")}</label>
                  <input
                    type="text"
                    required
                    value={skillNameAr}
                    onChange={(e) => setSkillNameAr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all text-right"
                    placeholder="رياكت"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">{adminT("category")}</label>
                  <select
                    value={skillCat}
                    onChange={(e) => setSkillCat(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all"
                  >
                    <option value="Frontend">{locale === "en" ? "Frontend Development" : "تطوير واجهات المستخدم"}</option>
                    <option value="Backend">{locale === "en" ? "Backend & Databases" : "تطوير الخوادم وقواعد البيانات"}</option>
                    <option value="Tools">{locale === "en" ? "Developer Tools / Devops" : "أدوات التطوير ونظم التشغيل"}</option>
                    <option value="Design">{locale === "en" ? "UI/UX & Design Assets" : "التصميم وتجربة المستخدم"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">{adminT("displayOrder")}</label>
                  <input
                    type="number"
                    value={skillOrder}
                    onChange={(e) => setSkillOrder(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>{adminT("proficiency")}</span>
                  <span className="text-sky-400">{skillProf}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skillProf}
                  onChange={(e) => setSkillProf(Number(e.target.value))}
                  className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSkillForm(false)}
                  className="py-1.5 px-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono cursor-pointer"
                >
                  {adminT("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={savingSkill}
                  className="py-1.5 px-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs font-mono cursor-pointer"
                >
                  {savingSkill ? adminT("committing") : adminT("saveSkill")}
                </button>
              </div>
            </form>
          ) : (
            /* SKILLS LIST */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.length === 0 ? (
                <p className="text-slate-500 font-mono text-xs col-span-full">{adminT("noSkills")}</p>
              ) : (
                skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 border border-slate-850 bg-slate-950/20 rounded-xl flex items-center justify-between hover:border-slate-850 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white text-sm">{skill.name_en}</span>
                        <span className="text-[9px] px-1 border border-slate-800 rounded text-slate-500 bg-slate-900 uppercase">
                          {skill.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                        <span>{locale === "en" ? "Proficiency" : "الإتقان"}: {skill.proficiency}%</span>
                        <span className="text-slate-600">|</span>
                        <span>{locale === "en" ? "Order" : "الترتيب"}: {skill.order}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEditSkill(skill)}
                        className="p-1.5 border border-slate-800 hover:border-sky-500/50 hover:text-sky-400 rounded-md text-slate-400 transition-all cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-1.5 border border-slate-800 hover:border-red-500/50 hover:text-red-400 rounded-md text-slate-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ================================== TAB 3: CERTIFICATIONS ================================== */}
      {activeTab === "certificates" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400">{adminT("certsDigitalRegistry")}</h2>
            {!showCertForm && (
              <button
                onClick={handleOpenNewCert}
                className="py-1 px-3 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs rounded-md transition-all flex items-center space-x-1 cursor-pointer font-mono"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{adminT("addCertificate")}</span>
              </button>
            )}
          </div>

          {showCertForm ? (
            /* CERTIFICATE FORM */
            <form onSubmit={handleSaveCert} className="glass bg-slate-950/40 p-6 rounded-2xl border border-slate-800 max-w-xl space-y-4">
              <span className="block text-xs font-mono text-sky-400 uppercase font-bold">
                {editingCert ? adminT("editCertMetadata") : adminT("registerNewCert")}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">{adminT("certTitleEn")}</label>
                  <input
                    type="text"
                    required
                    value={certTitleEn}
                    onChange={(e) => setCertTitleEn(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all"
                    placeholder="AWS Solutions Architect"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">{adminT("certTitleAr")}</label>
                  <input
                    type="text"
                    required
                    value={certTitleAr}
                    onChange={(e) => setCertTitleAr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all text-right"
                    placeholder="مهندس حلول AWS"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">{adminT("issuerEn")}</label>
                  <input
                    type="text"
                    required
                    value={certIssuerEn}
                    onChange={(e) => setCertIssuerEn(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all"
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">{adminT("issuerAr")}</label>
                  <input
                    type="text"
                    required
                    value={certIssuerAr}
                    onChange={(e) => setCertIssuerAr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all text-right"
                    placeholder="أمازون لخدمات الويب"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">{adminT("issueDate")}</label>
                  <input
                    type="month"
                    required
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">{adminT("credentialUrl")}</label>
                  <input
                    type="url"
                    value={certCredUrl}
                    onChange={(e) => setCertCredUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:border-sky-500 outline-none text-white transition-all font-mono"
                    placeholder="https://credly.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">{adminT("certificateMedia")}</label>
                <div className="border border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-950/20">
                  {certImgUrl && !certImgFile && (
                    <div className="relative mb-3 border border-slate-800 rounded-lg overflow-hidden h-20 w-20">
                      <img src={certImgUrl} alt="Cert Preview" className="h-full w-full object-cover" />
                    </div>
                  )}

                  {certImgFile && (
                    <div className="relative mb-3 border border-sky-900/50 rounded-lg overflow-hidden h-20 w-20 bg-slate-900 flex items-center justify-center">
                      <span className="text-[9px] font-mono text-sky-400 p-1 truncate max-w-full">{certImgFile.name}</span>
                    </div>
                  )}

                  <label className="py-1 px-2.5 bg-slate-900 border border-slate-800 hover:border-sky-500 rounded-lg text-[10px] text-slate-350 hover:text-white cursor-pointer font-mono flex items-center space-x-1 transition-all">
                    <Upload className="h-3 w-3" />
                    <span>{adminT("uploadImage")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCertImgFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {uploadProgress && (
                <div className="text-xs font-mono text-sky-400 animate-pulse bg-sky-950/20 py-2 px-3 border border-sky-900/30 rounded-lg">
                  [status]: {uploadProgress}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCertForm(false)}
                  className="py-1.5 px-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono cursor-pointer"
                >
                  {adminT("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={savingCert}
                  className="py-1.5 px-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs font-mono cursor-pointer"
                >
                  {savingCert ? adminT("committing") : adminT("saveCert")}
                </button>
              </div>
            </form>
          ) : (
            /* CERTIFICATES LIST */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.length === 0 ? (
                <p className="text-slate-500 font-mono text-xs col-span-full">{adminT("noCertificates")}</p>
              ) : (
                certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 border border-slate-850 bg-slate-950/20 rounded-xl flex items-center justify-between hover:border-slate-800 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 border border-slate-800 rounded bg-slate-900 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {cert.image_url ? (
                          <img src={cert.image_url} alt={cert.title_en} className="h-full w-full object-cover" />
                        ) : (
                          <Award className="h-5 w-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{cert.title_en}</h3>
                        <p className="text-[10px] text-slate-450 mt-0.5">{cert.issuer_en}</p>
                        <div className="flex items-center space-x-2 text-[9px] font-mono text-slate-500 mt-1">
                          <span className="flex items-center space-x-0.5">
                            <Calendar className="h-2.5 w-2.5" />
                            <span>{cert.issue_date}</span>
                          </span>
                          {cert.credential_url && (
                            <span className="flex items-center space-x-0.5">
                              <LinkIcon className="h-2.5 w-2.5" />
                              <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">Link</a>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEditCert(cert)}
                        className="p-1.5 border border-slate-800 hover:border-sky-500/50 hover:text-sky-400 rounded-md text-slate-400 transition-all cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert)}
                        className="p-1.5 border border-slate-800 hover:border-red-500/50 hover:text-red-400 rounded-md text-slate-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

