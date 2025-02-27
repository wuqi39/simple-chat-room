import supabase from '../supabase.js';

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
  // 实现游客登录逻辑
}
