import { login, register, guestLogin } from './auth.js';
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
const sendButton = document.getElementById('send-button');
console.log('sendButton:', sendButton);

const messageInput = document.getElementById('message-input');
console.log('messageInput:', messageInput);

const usernameError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');
const imageUpload = document.getElementById('image-upload');
const loadMoreButton = document.getElementById('load-more');
const avatarButton = document.getElementById('avatar-button');

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

// 显示或隐藏登录注册弹窗
function toggleAuthContainer() {
    authContainer.classList.toggle('hidden');
}

// 统一的错误处理函数
function handleError(error, message) {
    console.error(message, error);
    alert(message);
}

// 发送消息
async function sendMessage() {
    const rawText = messageInput.value;
    const cleanText = DOMPurify.sanitize(rawText.trim());

    if (!cleanText) return;

    const { error } = await sendTextMessage(cleanText);
    if (error) {
        handleError(error, '消息发送失败，请重试。');
    }
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

// 初始化时以游客身份进入聊天室
window.addEventListener('load', async () => {
    authContainer.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    let currentPage = 1;
    const { data: messages } = await loadMessages(currentPage);
    messages.reverse().forEach(msg => addMessageToUI(msg));
});