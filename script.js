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
        usernameError.textContent = 'Username cannot be empty';
        return false;
    } else {
        usernameError.textContent = '';
        return true;
    }
}

function validatePassword() {
    const password = passwordInput.value;
    if (password === '') {
        passwordError.textContent = 'Password cannot be empty';
        return false;
    } else if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters long';
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
            console.error('Login error:', error);
            alert('Login failed. Please check your username and password.');
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
            console.error('Register error:', error);
            alert('Registration failed. Please try again.');
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
            console.error('Error sending message:', error);
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
                console.error('Error sending message:', error);
            } else {
                messageInput.value = '';
            }
        }
    }
});