// 引入 Supabase 的 createClient 函数
const { createClient } = supabase;
// 初始化 Supabase
const supabaseUrl = 'https://kcuktgoixvxbrllmudvs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjdWt0Z29peHZ4YnJsbG11ZHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTExNDAsImV4cCI6MjA1NTk4NzE0MH0.ZzemYLWDwatGEePs1LXeV8DB8hs_7wbVid6AkG8ZceY';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);
// 获取 DOM 元素
const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const guestButton = document.getElementById('guest-button');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const usernameError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');

// 表单验证函数
function validateUsername() {
    const username = usernameInput.value;
    if (username === '') {
        usernameError.textContent = '用户名不能为空';
        return false;
    } else {
        usernameError.textContent = '';
        return true;
    }
}

function validatePassword() {
    const password = passwordInput.value;
    if (password === '') {
        passwordError.textContent = '密码不能为空';
        return false;
    } else if (password.length < 6) {
        passwordError.textContent = '密码至少需要 6 个字符';
        return false;
    } else {
        passwordError.textContent = '';
        return true;
    }
}

// 密码可见切换函数
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

// 登录功能
loginButton.addEventListener('click', async () => {
    if (validateUsername() && validatePassword()) {
        const username = usernameInput.value;
        const password = passwordInput.value;

        // 先根据用户名查找对应的用户信息
        const { data: userProfileData, error: userProfileError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('username', username)
          .single();

        if (userProfileError) {
            console.error('查找用户信息错误:', userProfileError);
            alert('登录失败。请检查你的用户名和密码。');
        } else {
            const userId = userProfileData.id;
            const { data, error } = await supabase.auth.signInWithPassword({
                email: userId, // 这里假设使用用户 ID 作为邮箱，实际应用中需根据情况调整
                password
            });
            if (error) {
                console.error('登录错误:', error);
                alert('登录失败。请检查你的用户名和密码。');
            } else {
                authContainer.classList.add('hidden');
                chatContainer.classList.remove('hidden');
                // 监听新消息
                const realtime = supabase
                  .channel('chat-channel')
                  .on(
                        'postgres_changes',
                        { event: 'INSERT', schema: 'public', table: 'messages' },
                        (payload) => {
                            const messageElement = document.createElement('p');
                            messageElement.textContent = payload.new.message;
                            chatMessages.appendChild(messageElement);
                        }
                    )
                  .subscribe();
            }
        }
    }
});

// 注册功能
registerButton.addEventListener('click', async () => {
    if (validateUsername() && validatePassword()) {
        const username = usernameInput.value;
        const password = passwordInput.value;

        // 先注册用户
        const { data, error } = await supabase.auth.signUp({
            email: username, // 这里简单假设邮箱和用户名相同，实际应用中可能需要分开处理
            password
        });
        if (error) {
            console.error('注册错误:', error);
            alert('注册失败。请重试。');
        } else {
            const userId = data.user.id;
            // 将用户名插入 user_profiles 表
            const { error: profileError } = await supabase.from('user_profiles').insert([{ id: userId, username }]);
            if (profileError) {
                console.error('插入用户信息错误:', profileError);
            } else {
                authContainer.classList.add('hidden');
                chatContainer.classList.remove('hidden');
                // 监听新消息
                const realtime = supabase
                  .channel('chat-channel')
                  .on(
                        'postgres_changes',
                        { event: 'INSERT', schema: 'public', table: 'messages' },
                        (payload) => {
                            const messageElement = document.createElement('p');
                            messageElement.textContent = payload.new.message;
                            chatMessages.appendChild(messageElement);
                        }
                    )
                  .subscribe();
            }
        }
    }
});

// 游客登录功能
guestButton.addEventListener('click', () => {
    authContainer.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    // 监听新消息
    const realtime = supabase
      .channel('chat-channel')
      .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages' },
            (payload) => {
                const messageElement = document.createElement('p');
                messageElement.textContent = payload.new.message;
                chatMessages.appendChild(messageElement);
            }
        )
      .subscribe();
});

// 发送消息
sendButton.addEventListener('click', async () => {
    const message = messageInput.value;
    if (message) {
        const { error } = await supabase.from('messages').insert([{ message }]);
        if (error) {
            console.error('发送消息错误:', error);
        } else {
            messageInput.value = '';
        }
    }
});

// 处理输入框按下回车键事件
messageInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const message = messageInput.value;
        if (message) {
            const { error } = await supabase.from('messages').insert([{ message }]);
            if (error) {
                console.error('发送消息错误:', error);
            } else {
                messageInput.value = '';
            }
        }
    }
});