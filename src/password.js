// 密码可见切换函数
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

// 密码强度实时检测
const passwordInput = document.getElementById('password');
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

export { togglePasswordVisibility };
