import { supabase } from "@/lib/supabase";

export default async function usePhotos() {
  let { data, error } = await supabase.from("product").select("*");
  if (error) {
    console.log(error.message);
    return [];
  }

  return data;
}
