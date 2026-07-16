import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file to a specific path in Supabase Storage and returns its public download URL.
 * Supports an optional progress callback to report upload status.
 * 
 * @param file The file object (ideally compressed WebP)
 * @param path The destination path in the Storage bucket (e.g., 'projects/my-project/thumbnail.webp')
 * @param onProgress Optional callback to receive upload progress percentage (0 to 100)
 * @returns A promise that resolves to the public download URL
 */
export async function uploadToStorage(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (onProgress) onProgress(20); // Initial progress

  const { data, error } = await supabase.storage
    .from("portfolio")
    .upload(path, file, {
      upsert: true,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw error;
  }

  if (onProgress) onProgress(100);

  const { data: publicUrlData } = supabase.storage
    .from("portfolio")
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}

/**
 * Deletes an object from Supabase Storage using its full download URL.
 * 
 * @param fileUrl The full download URL of the file in Storage
 */
export async function deleteFromStorage(fileUrl: string): Promise<void> {
  if (!fileUrl) return;
  try {
    const urlParts = fileUrl.split("/portfolio/");
    if (urlParts.length === 2) {
      const path = urlParts[1];
      const { error } = await supabase.storage.from("portfolio").remove([path]);
      if (error) {
        console.error("Supabase delete error:", error);
      }
    }
  } catch (error) {
    console.error("Failed to delete object from Supabase Storage:", error);
  }
}
