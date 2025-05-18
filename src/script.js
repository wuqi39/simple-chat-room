// 切换登录/注册窗口的显示状态
const toggleAuthContainer = () => {
    const authContainer = document.getElementById('auth-container');
    authContainer.classList.toggle('opacity-0');
    authContainer.classList.toggle('scale-95');
    authContainer.classList.toggle('pointer-events-none');
};

// 切换密码可见性
const togglePasswordVisibility = (targetId) => {
    const passwordInput = document.getElementById(targetId);
    const icon = document.querySelector(`[data-target="${targetId}"] i`);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
};

// 初始化聊天界面
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');

    // 添加欢迎消息
    setTimeout(() => {
        addSystemMessage('👋 欢迎来到Kwin聊天室！请登录或注册以开始聊天。');
    }, 500);

    // 模拟历史消息
    const users = [
        { id: 1, name: 'Alice', avatar: 'https://picsum.photos/seed/alice/200' },
        { id: 2, name: 'Bob', avatar: 'https://picsum.photos/seed/bob/200' },
        { id: 3, name: 'Charlie', avatar: 'https://picsum.photos/seed/charlie/200' },
        { id: 4, name: 'David', avatar: 'https://picsum.photos/seed/david/200' }
    ];
    const sampleMessages = [
        '嗨，大家好！',
        '今天天气怎么样？',
        '有人在吗？',
        '我刚完成一个项目，感觉不错！',
        '这个聊天室的界面真漂亮！',
        '有没有推荐的电影？',
        '哈哈，我今天遇到了一件有趣的事情',
        '大家周末有什么计划？',
        '我正在学习前端开发，有什么好的资源吗？',
        '这是一张我最近旅行的照片',
        '希望大家都过得愉快！',
        '早上好！',
        '有人试过新出的游戏吗？'
    ];
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
            addMessage(randomUser, randomMessage);
        }, 500 + i * 1000);
    }

    // 发送消息按钮事件
    const sendButton = document.getElementById('send-button');
    sendButton.addEventListener('click', async () => {
        const { sendMessage } = await import('./message.js');
        await sendMessage();
    });

    // 输入框回车发送
    const messageInput = document.getElementById('message-input');
    messageInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const { sendMessage } = await import('./message.js');
            await sendMessage();
        }
    });

    // 图片上传事件
    const imageUpload = document.getElementById('image-upload');
    imageUpload.addEventListener('change', async (e) => {
        const { handleImageUpload } = await import('./message.js');
        await handleImageUpload(e);
    });

    // 模拟用户正在输入
    let typingTimer;
    messageInput.addEventListener('input', function () {
        const typingIndicator = document.getElementById('typing-indicator');

        clearTimeout(typingTimer);

        if (this.value.trim().length > 0) {
            typingIndicator.classList.remove('hidden');

            typingTimer = setTimeout(() => {
                typingIndicator.classList.add('hidden');
            }, 2000);
        } else {
            typingIndicator.classList.add('hidden');
        }
    });

    // 登录/注册窗口切换按钮
    const toggleAuth = document.getElementById('toggle-auth');
    const closeAuth = document.getElementById('close-auth');
    toggleAuth.addEventListener('click', toggleAuthContainer);
    closeAuth.addEventListener('click', toggleAuthContainer);

    // 密码可见性切换
    const passwordToggles = document.querySelectorAll('.password-toggle, .register-password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            togglePasswordVisibility(toggle.dataset.target);
        });
    });

    // 访客登录函数
    // 添加访客登录函数
    const loginAsGuest = () => {
        const guestUser = {
            id: 0,
            name: '访客',
            avatar: 'https://picsum.photos/seed/guest/200'
        };
        
        // 隐藏登录窗口
        toggleAuthContainer();
        
        // 添加欢迎消息
        addSystemMessage(`👋 欢迎 ${guestUser.name} 进入聊天室！`);
        
        // 设置当前用户
        window.currentUser = guestUser;
    };
    
    // 在DOMContentLoaded事件监听器中添加访客登录按钮事件
    document.addEventListener('DOMContentLoaded', () => {
        // 游客登录按钮事件
        const guestButton = document.getElementById('guest-button');
        guestButton.addEventListener('click', async () => {
            const { loginAsGuest } = await import('./main.js');
            await loginAsGuest();
            toggleAuthContainer(); // 隐藏登录注册面板
        });
    });
});
     
// 添加系统消息
const addSystemMessage = (content) => {
    const chatMessages = document.getElementById('chat-messages');

    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex justify-center items-center py-2 animate-fade-in';

    messageDiv.innerHTML = `
        <div class="bg-gray-800/50 text-gray-300 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            ${content}
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// 添加消息到聊天窗口
const addMessage = (user, content) => {
    const chatMessages = document.getElementById('chat-messages');
    const isSelf = user.id === 0;

    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${isSelf ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`;

    let avatarHtml = '';
    if (!isSelf) {
        avatarHtml = `
            <div class="mr-3 flex-shrink-0">
                <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full shadow-md object-cover">
                <div class="text-xs text-center text-gray-500 mt-1">${user.name}</div>
            </div>
        `;
    }

    messageDiv.innerHTML = `
        ${avatarHtml}
        <div class="max-w-[80%] ${isSelf ? 'message-bubble-right' : 'message-bubble-left'}">
            <div class="rounded-lg p-3 ${isSelf ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'} shadow-sm message-bubble">
                <p>${content}</p>
            </div>
            <div class="text-xs text-gray-500 mt-1 ${isSelf ? 'text-right' : 'text-left'}">
                ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};