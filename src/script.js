import { login, register, guestLogin } from './services/auth.js';
import { sendTextMessage, sendImageMessage, loadMessages } from './services/message.js';
import { uploadImage } from './services/storage.js';
import DOMPurify from 'dompurify';

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
        const { data, error } = await login(username, password);
        if (error) {
            console.error('登录错误:', error);
            alert('登录失败。请检查你的用户名和密码。');
        } else {
            authContainer.classList.add('hidden');
            chatContainer.classList.remove('hidden');
            // 初始化加载消息
            let currentPage = 1;
            const { data: messages } = await loadMessages(currentPage);
            messages.reverse().forEach(msg => addMessageToUI(msg));
            // 监听新消息
            // 这里暂时省略实时监听逻辑，可根据之前代码添加
        }
    }
});

// 注册功能
registerButton.addEventListener('click', async () => {
    if (validateUsername() && validatePassword()) {
        const username = usernameInput.value;
        const password = passwordInput.value;
        const { data, error } = await register(username, password);
        if (error) {
            console.error('注册错误:', error);
            alert('注册失败。请重试。');
        } else {
            authContainer.classList.add('hidden');
            chatContainer.classList.remove('hidden');
            // 初始化加载消息
            let currentPage = 1;
            const { data: messages } = await loadMessages(currentPage);
            messages.reverse().forEach(msg => addMessageToUI(msg));
            // 监听新消息
            // 这里暂时省略实时监听逻辑，可根据之前代码添加
        }
    }
});

// 游客登录功能
guestButton.addEventListener('click', async () => {
    authContainer.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    // 初始化加载消息
    let currentPage = 1;
    const { data: messages } = await loadMessages(currentPage);
    messages.reverse().forEach(msg => addMessageToUI(msg));
    // 监听新消息
    // 这里暂时省略实时监听逻辑，可根据之前代码添加
});

// 发送消息
async function sendMessage() {
    const rawText = messageInput.value;
    const cleanText = DOMPurify.sanitize(rawText.trim());

    if (!cleanText) return;

    const { error } = await sendTextMessage(cleanText);
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

loadMoreButton.addEventListener('click', async () => {
    currentPage++;
    const { data: messages } = await loadMessages(currentPage);
    messages.reverse().forEach(msg => addMessageToUI(msg));

    if (messages.length < PAGE_SIZE) {
        loadMoreButton.classList.add('hidden');
    } else {
        loadMoreButton.classList.remove('hidden');
    }
});

// 图片消息上传逻辑
imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const url = await uploadImage(file);
    if (url) {
        await sendImageMessage(url);
    }
});