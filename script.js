// 初始化 Supabase
const supabaseUrl = 'https://kcuktgoixvxbrllmudvs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjdWt0Z29peHZ4YnJsbG11ZHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTExNDAsImV4cCI6MjA1NTk4NzE0MH0.ZzemYLWDwatGEePs1LXeV8DB8hs_7wbVid6AkG8ZceY';
const supabase = createClient(supabaseUrl, supabaseKey);

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
        const { data, error } = await supabase.auth.signInWithPassword({
            email: username,
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
                        addMessageToUI(payload.new);
                    }
                )
              .subscribe();
        }
    }
});

// 注册功能
registerButton.addEventListener('click', async () => {
    if (validateUsername() && validatePassword()) {
        const username = usernameInput.value;
        const password = passwordInput.value;
        const { data, error } = await supabase.auth.signUp({
            email: username,
            password
        });
        if (error) {
            console.error('注册错误:', error);
            alert('注册失败。请重试。');
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
                        addMessageToUI(payload.new);
                    }
                )
              .subscribe();
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
                addMessageToUI(payload.new);
            }
        )
      .subscribe();
});

// 发送消息
async function sendMessage() {
    // 替换原有的messageInput.value.trim()
    const rawText = messageInput.value;
    const cleanText = DOMPurify.sanitize(rawText.trim());

    if (!cleanText) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ content: cleanText }]);

    messageInput.value = '';
}
sendButton.addEventListener('click', sendMessage);

// 处理输入框按下回车键事件
messageInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// 密码强度实时检测
passwordInput.addEventListener('input', () => {
    const strengthIndicator = document.getElementById('password-strength');
    const password = passwordInput.value;

    let strength = '弱';
    if (password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password)) {
        strength = '强';
    } else if (password.length >= 8) {
        strength = '中';
    }

    strengthIndicator.textContent = `强度：${strength}`;
    strengthIndicator.className = `password-strength strength-${strength}`;
});

// 添加消息到UI并处理滚动
function addMessageToUI(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message.content;
    chatMessages.appendChild(messageElement);

    // 添加滚动逻辑
    const isAtBottom = 
        chatMessages.scrollTop + chatMessages.clientHeight >= 
        chatMessages.scrollHeight - 50;

    if (isAtBottom) {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }
}