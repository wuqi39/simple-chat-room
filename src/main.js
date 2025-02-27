import { toggleAuthContainer } from './auth.js';
import { sendMessage, addMessageToUI } from './message.js';
import { togglePasswordVisibility } from './password.js';
import './imageUpload.js';

// 初始化时以游客身份进入聊天室
window.addEventListener('load', async () => {
    const authContainer = document.getElementById('auth-container');
    const chatContainer = document.getElementById('chat-container');
    authContainer.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    let currentPage = 1;
    const { data: messages } = await loadMessages(currentPage);
    messages.reverse().forEach(msg => addMessageToUI(msg));
});
