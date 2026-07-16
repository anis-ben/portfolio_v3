import { db } from "./config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  setDoc
} from "firebase/firestore";

// Interfaces
export interface Category {
  id: string; // matches the slug
  name_en: string;
  name_ar: string;
  slug: string;
}

export interface Project {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  content_en: string;
  content_ar: string;
  thumbnail_url: string;
  gallery_urls: string[];
  category_slug: string;
  live_url: string;
  github_url: string;
  is_featured: boolean;
  created_at: any; // Timestamp
}

export interface Skill {
  id: string;
  name_en: string;
  name_ar: string;
  category: string; // Frontend, Backend, Tools, Design, etc.
  proficiency: number; // 0-100
  order: number;
}

export interface Certificate {
  id: string;
  title_en: string;
  title_ar: string;
  issuer_en: string;
  issuer_ar: string;
  issue_date: string; // YYYY-MM
  credential_url: string;
  image_url: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: any;
}

// --- Category CRUD ---
export async function getCategories(): Promise<Category[]> {
  const colRef = collection(db, "categories");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Category[];
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<void> {
  const docRef = doc(db, "categories", category.slug);
  await setDoc(docRef, category);
}

export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, "categories", id);
  await deleteDoc(docRef);
}

// --- Project CRUD ---
export async function getProjects(): Promise<Project[]> {
  const colRef = collection(db, "projects");
  const q = query(colRef, orderBy("created_at", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      created_at: data.created_at ? (data.created_at as Timestamp).toDate().toISOString() : null
    };
  }) as unknown as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const colRef = collection(db, "projects");
  const q = query(
    colRef,
    where("is_featured", "==", true),
    orderBy("created_at", "desc"),
    limit(6)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      created_at: data.created_at ? (data.created_at as Timestamp).toDate().toISOString() : null
    };
  }) as unknown as Project[];
}

export async function getProject(id: string): Promise<Project | null> {
  const docRef = doc(db, "projects", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    created_at: data.created_at ? (data.created_at as Timestamp).toDate().toISOString() : null
  } as unknown as Project;
}

export async function addProject(project: Omit<Project, "id" | "created_at">): Promise<string> {
  const colRef = collection(db, "projects");
  const docRef = await addDoc(colRef, {
    ...project,
    created_at: serverTimestamp()
  });
  return docRef.id;
}

export async function updateProject(id: string, project: Partial<Omit<Project, "id" | "created_at">>): Promise<void> {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, project);
}

export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
}

// --- Skill CRUD ---
export async function getSkills(): Promise<Skill[]> {
  const colRef = collection(db, "skills");
  const q = query(colRef, orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Skill[];
}

export async function addSkill(skill: Omit<Skill, "id">): Promise<string> {
  const colRef = collection(db, "skills");
  const docRef = await addDoc(colRef, skill);
  return docRef.id;
}

export async function updateSkill(id: string, skill: Partial<Omit<Skill, "id">>): Promise<void> {
  const docRef = doc(db, "skills", id);
  await updateDoc(docRef, skill);
}

export async function deleteSkill(id: string): Promise<void> {
  const docRef = doc(db, "skills", id);
  await deleteDoc(docRef);
}

// --- Certificate CRUD ---
export async function getCertificates(): Promise<Certificate[]> {
  const colRef = collection(db, "certificates");
  const q = query(colRef, orderBy("issue_date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Certificate[];
}

export async function addCertificate(cert: Omit<Certificate, "id">): Promise<string> {
  const colRef = collection(db, "certificates");
  const docRef = await addDoc(colRef, cert);
  return docRef.id;
}

export async function updateCertificate(id: string, cert: Partial<Omit<Certificate, "id">>): Promise<void> {
  const docRef = doc(db, "certificates", id);
  await updateDoc(docRef, cert);
}

export async function deleteCertificate(id: string): Promise<void> {
  const docRef = doc(db, "certificates", id);
  await deleteDoc(docRef);
}

// --- Contact Form Submission ---
export async function addContactMessage(message: ContactMessage): Promise<string> {
  const colRef = collection(db, "messages");
  const docRef = await addDoc(colRef, {
    ...message,
    created_at: serverTimestamp()
  });
  return docRef.id;
}
