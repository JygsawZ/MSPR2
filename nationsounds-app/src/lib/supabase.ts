import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from("artists-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) {
    throw error;
  }

  return data.path;
}

export function getImageUrl(path: string) {
  return `${
    supabase.storage.from("artists-images").getPublicUrl(path).data.publicUrl
  }`;
}
