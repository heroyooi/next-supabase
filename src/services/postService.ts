import { supabase } from '@/lib/supabase';

export async function getPosts() {
  const { data, error } = await supabase.from('posts').select('*');
  if (error) throw error;
  return data;
}

export async function getPostById(id: number) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createPost(title: string, content: string) {
  const { data, error } = await supabase
    .from('posts')
    .insert([{ title, content }]);
  if (error) throw error;
  return data;
}

export async function updatePost(id: number, title: string, content: string) {
  const { data, error } = await supabase
    .from('posts')
    .update({ title, content })
    .eq('id', id);
  if (error) throw error;
  return data;
}

export async function deletePost(id: number) {
  const { data, error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
  return data;
}
