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

// Helper function to upload image
export const uploadImage = async (file: File): Promise<string> => {
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
