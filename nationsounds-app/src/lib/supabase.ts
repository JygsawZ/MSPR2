import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

// Helper function to generate a unique file name
export const generateUniqueFileName = (originalName: string) => {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop()?.toLowerCase();
  return `${timestamp}-${random}.${extension}`;
};

// Helper function to extract filename from URL
export const getFilenameFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/');
    return parts[parts.length - 1];
  } catch (e) {
    console.error('Error extracting filename from URL:', e);
    return null;
  }
};

// Helper function to delete image
export const deleteImage = async (imageUrl: string): Promise<void> => {
  const filename = getFilenameFromUrl(imageUrl);
  if (!filename) {
    console.warn('Could not extract filename from URL:', imageUrl);
    return;
  }

  const { error } = await supabase.storage
    .from('artists-images')
    .remove([filename]);

  if (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Helper function to upload image
export const uploadImage = async (file: File, oldImageUrl?: string): Promise<string> => {
  // If there's an old image, delete it first
  if (oldImageUrl) {
    try {
      await deleteImage(oldImageUrl);
    } catch (error) {
      console.warn('Failed to delete old image:', error);
      // Continue with upload even if delete fails
    }
  }

  const fileName = generateUniqueFileName(file.name);
  
  console.log('Starting upload...', {
    fileName,
    fileSize: file.size,
    fileType: file.type
  });

  const { data, error } = await supabase.storage
    .from('artists-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });

  if (error) {
    console.error('Upload error:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from upload');
  }

  console.log('Upload successful:', data);

  const { data: urlData } = supabase.storage
    .from('artists-images')
    .getPublicUrl(fileName);

  if (!urlData.publicUrl) {
    throw new Error('Could not get public URL');
  }

  console.log('Public URL:', urlData.publicUrl);
  return urlData.publicUrl;
};

export function getImageUrl(path: string) {
  return `${
    supabase.storage.from("artists-images").getPublicUrl(path).data.publicUrl
  }`;
}
