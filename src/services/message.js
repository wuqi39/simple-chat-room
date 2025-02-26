import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kcuktgoixvxbrllmudvs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjdWt0Z29peHZ4YnJsbG11ZHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTExNDAsImV4cCI6MjA1NTk4NzE0MH0.ZzemYLWDwatGEePs1LXeV8DB8hs_7wbVid6AkG8ZceY';
const supabase = createClient(supabaseUrl, supabaseKey);
const PAGE_SIZE = 20;

export async function sendTextMessage(content) {
    return supabase
      .from('messages')
      .insert([{ content, type: 'text' }]);
}

export async function sendImageMessage(url) {
    return supabase
      .from('messages')
      .insert([{ content: url, type: 'image' }]);
}

export async function loadMessages(page = 1) {
    return supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
}