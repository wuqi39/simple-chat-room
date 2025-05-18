// 修改导入语句
import { tim, isTIMInitialized } from './main.js';

const messageInput = document.getElementById('message-input');
const imageUpload = document.getElementById('image-upload');

// 在发送消息前检查SDK状态
export const sendMessage = async () => {
    if (!isTIMInitialized) {
        alert('TIMM SDK 还未初始化，请稍后再试。');
        return;
    }

    const text = messageInput.value.trim();
    if (!text) return;

    const textMsg = tim.createTextMessage({
        to: '@TGS#165X5DTQ6',
        conversationType: tim.TYPES.CONV_GROUP,
        payload: { text }
    });

    // 发送文本消息
    const { error } = await tim.sendMessage(textMsg);
    if (!error) {
        addMessageToUI({
            type: 'text',
            sender: '我',
            content: text
        });
        messageInput.value = '';
    }
}

// 图片上传处理函数
export async function handleImageUpload(e) {
    if (!isTIMInitialized) {
        alert('TIM SDK 还未初始化，请稍后再试。');
        return;
    }

    if (e.target.files && e.target.files[0]) {
        const imageMsg = tim.createImageMessage({
            to: '@TGS#165X5DTQ6', // 🔧 需保持与群组ID一致
            payload: {
                file: e.target.files[0],
                imageFormat: 1 // 1-原图，2-大图，3-缩略图
            }
        });

        const { error } = await tim.sendMessage(imageMsg);
        if (!error) {
            const reader = new FileReader();
            reader.onload = function (e) {
                addMessageToUI({
                    type: 'image',
                    sender: '我',
                    content: `<img src="${e.target.result}" class="max-w-full h-auto rounded-lg shadow-md">`
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }
}

// 添加消息到UI
const addMessageToUI = ({ type, sender, content }) => {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    const isSelf = sender === '我';
    messageDiv.className = `flex ${isSelf ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`;

    let avatarHtml = '';
    if (!isSelf) {
        avatarHtml = `
            <div class="mr-3 flex-shrink-0">
                <img src="https://picsum.photos/seed/${sender}/200" alt="${sender}" class="w-10 h-10 rounded-full shadow-md object-cover">
                <div class="text-xs text-center text-gray-500 mt-1">${sender}</div>
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