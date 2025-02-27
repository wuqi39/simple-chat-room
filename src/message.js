import { sendTextMessage, sendImageMessage, loadMessages } from './message.js';
import DOMPurify from 'dompurify';

// 获取 DOM 元素
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const loadMoreButton = document.getElementById('load-more');

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

export { sendMessage, addMessageToUI };
