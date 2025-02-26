import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kcuktgoixvxbrllmudvs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjdWt0Z29peHZ4YnJsbG11ZHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTExNDAsImV4cCI6MjA1NTk4NzE0MH0.ZzemYLWDwatGEePs1LXeV8DB8hs_7wbVid6AkG8ZceY';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImage(file) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-images')
      .upload(`images/${Date.now()}_${file.name}`, file);

    if (uploadError) {
        console.error('图片上传错误:', uploadError);
        return null;
    }

    const { data: urlData } = supabase.storage
      .from('chat-images')
      .getPublicUrl(uploadData.path);

    return urlData.publicUrl;
}