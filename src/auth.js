import { login, register, guestLogin } from './auth.js';

// 获取 DOM 元素
const authContainer = document.getElementById('auth-container');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const guestButton = document.getElementById('guest-button');
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

// 显示或隐藏登录注册弹窗
function toggleAuthContainer() {
    authContainer.classList.toggle('hidden');
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
    // 初始化加载消息
    let currentPage = 1;
    const { data: messages } = await loadMessages(currentPage);
    messages.reverse().forEach(msg => addMessageToUI(msg));
    // 监听新消息
    // 这里暂时省略实时监听逻辑，可根据之前代码添加
});

export { toggleAuthContainer };
