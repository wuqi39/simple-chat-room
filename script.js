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
const imageUpload = document.getElementById('image-upload');
const loadMoreButton = document.getElementById('load-more');

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
            // 初始化加载消息
            currentPage = 1;
            loadMessages();
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
            // 初始化加载消息
            currentPage = 1;
            loadMessages();
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
    // 初始化加载消息
    currentPage = 1;
    loadMessages();
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
      .insert([{ content: cleanText, type: 'text' }]);

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
    const container = document.createElement('div');

    if (message.type === 'image') {
        const img = document.createElement('img');
        img.src = message.content;
        img.style.maxWidth = '200px';
        container.appendChild(img);
    } else {
        container.textContent = message.content;
    }

    chatMessages.appendChild(container);

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

// 消息分页加载
let currentPage = 1;
const PAGE_SIZE = 20;

async function loadMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

    data.reverse().forEach(msg => addMessageToUI(msg));

    if (data.length < PAGE_SIZE) {
        loadMoreButton.classList.add('hidden');
    } else {
        loadMoreButton.classList.remove('hidden');
    }
}

loadMoreButton.addEventListener('click', () => {
    currentPage++;
    loadMessages();
});

// 图片消息上传逻辑
imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];

    // 上传到Supabase存储
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-images')
      .upload(`images/${Date.now()}_${file.name}`, file);

    if (uploadError) {
        console.error('图片上传错误:', uploadError);
        return;
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from('chat-images')
      .getPublicUrl(uploadData.path);

    // 插入消息记录
    await supabase
      .from('messages')
      .insert([{
          content: urlData.publicUrl,
          type: 'image'
      }]);
});