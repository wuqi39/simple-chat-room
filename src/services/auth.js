import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kcuktgoixvxbrllmudvs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjdWt0Z29peHZ4YnJsbG11ZHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTExNDAsImV4cCI6MjA1NTk4NzE0MH0.ZzemYLWDwatGEePs1LXeV8DB8hs_7wbVid6AkG8ZceY';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function login(username, password) {
    return supabase.auth.signInWithPassword({
        email: username,
        password
    });
}

export async function register(username, password) {
    return supabase.auth.signUp({
        email: username,
        password
    });
}

export async function guestLogin() {
    // 这里可以根据实际情况添加游客登录逻辑，目前只是占位
    return { data: null, error: null };
}