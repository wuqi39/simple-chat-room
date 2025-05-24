import { getTIM, isInitialized } from './timUtils.js';
import { sendMessage } from './message.js';

// 初始化IM SDK
export const initTIM = async () => {
    // 初始化 TIM 实例
    const tim = TIM.create({
        SDKAppID: config.SDKAppID,
        logLevel: TIM.TYPES.LOG_DEBUG
    });

    setTIM(tim);

    // 监听关键事件
    tim.on(TIM.EVENT.SDK_READY, onSDKReady);
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
    tim.on(TIM.EVENT.KICKED_OUT, onKickedOut);

    try {
        const res = await tim.login({
            userID: config.guestUserID,
            userSig: config.guestUserSig
        });
        if (res.code === 0) {
            console.log('登录成功');
        } else {
            console.error('登录失败，错误码:', res.code, '错误信息:', res.message);
            alert('登录失败，请检查配置信息或稍后再试');
        }
    } catch (error) {
        console.error('登录出错:', error);
        alert('登录出错，请检查网络或稍后再试');
    }

    return tim;
};

// SDK准备完成
const onSDKReady = async () => {
    setInitialized(true);
    console.log('IM SDK 初始化完成');
    try {
        await joinGroup(config.groupID);
    } catch (error) {
        console.error('加入群组失败:', error);
    }
};

// 加入群组
const joinGroup = async (groupID) => {
    const tim = getTIM();
    const res = await tim.joinGroup({
        groupID,
        type: TIM.TYPES.GROUP_C2C
    });
    if (res.code === 0) {
        console.log('加入群组成功');
    } else {
        console.error('加入群组失败，错误码:', res.code, '错误信息:', res.message);
    }
};

// 接收消息
const onMessageReceived = (event) => {
    const tim = getTIM();
    event.data.forEach(msg => {
        if (msg.conversationID === `GROUP${config.groupID}`) {
            const message = {
                sender: msg.from,
                content: msg.payload.text,
                isSelf: msg.from === tim.getLoginUser()
            };
            addMessageToUI(message);
        }
    });
};

// 游客登录逻辑
export const guestLogin = async () => {
    try {
        // 模拟游客登录逻辑
        console.log('游客登录成功');
        // 这里可以添加实际的登录逻辑，如发送请求等
    } catch (error) {
        throw new Error('游客登录失败: ' + error.message);
    }
};

export const toggleAuthContainer = () => {
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        authContainer.style.display = authContainer.style.display === 'none' ? 'block' : 'none';
    }
};

// 监听被踢下线事件
const tim = getTIM();
if (tim) {
    tim.on(TIM.EVENT.KICKED_OUT, (event) => {
        console.log('用户被踢下线:', event.data.type);
        alert('您已被踢下线，请重新登录。');
        logout();
    });
}

// 绑定发送按钮事件
document.getElementById('send-button').addEventListener('click', sendMessage);

// 绑定图片上传事件
document.getElementById('image-upload').addEventListener('change', handleImageUpload);

// 发送文本消息
export const sendTextMessage = async (text) => {
    const tim = getTIM();
    const isInit = isInitialized();
    if (!isInit || !text.trim()) return;
    
    const msg = tim.createTextMessage({
        to: config.groupID,
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: { text }
    });

    const res = await tim.sendMessage(msg);
    if (res.code === 0) {
        addMessageToUI({
            content: text,
            isSelf: true,
            sender: tim.getLoginUser()
        });
    }
};

// 发送图片消息（简化版）
export const sendImageMessage = async (file) => {
    const tim = getTIM();
    const isInit = isInitialized();
    if (!isInit || !file) return;
    
    const msg = tim.createImageMessage({
        to: config.groupID,
        payload: { file }
    });

    const res = await tim.sendMessage(msg);
    if (res.code === 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
            addMessageToUI({
                content: `<img src="${e.target.result}" class="message-image">`,
                isSelf: true,
                sender: tim.getLoginUser()
            });
        };
        reader.readAsDataURL(file);
    }
};

// 添加消息到UI（优化后支持多消息类型）
const addMessageToUI = ({ type, sender, content }) => {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    const tim = getTIM();
    const isSelf = sender === tim.getLoginUser();
    messageDiv.className = `flex ${isSelf ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`;

    let avatarHtml = '';
    // 非自己发送的消息显示头像
    if (!isSelf) {
        avatarHtml = `
            <div class="mr-3 flex-shrink-0">
                <img src="https://picsum.photos/seed/${sender}/200" alt="${sender}" class="w-10 h-10 rounded-full shadow-md object-cover">
                <div class="text-xs text-center text-gray-500 mt-1">${sender}</div>
            </div>
        `;
    }

    // 根据消息类型渲染内容（扩展支持图片）
    let contentHtml;
    switch (type) {
        case 'text':
            contentHtml = `<p>${content}</p>`;
            break;
        case 'image':
            contentHtml = `<img src="${content}" alt="图片" class="max-w-full rounded-lg">`;
            break;
        default:
            contentHtml = `<p>[不支持的消息类型]</p>`;
    }

    messageDiv.innerHTML = `
        ${avatarHtml}
        <div class="max-w-[80%] ${isSelf ? 'message-bubble-right' : 'message-bubble-left'}">
            <div class="rounded-lg p-3 ${isSelf ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'} shadow-sm message-bubble">
                ${contentHtml}
            </div>
            <div class="text-xs text-gray-500 mt-1 ${isSelf ? 'text-right' : 'text-left'}">
                ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // 自动滚动到最新消息
};

// 登出函数（优化后增加实例检查）
export const logout = async () => {
    const tim = getTIM();
    // 检查tim实例是否存在
    if (!tim) {
        console.warn('未检测到TIM实例，无需登出');
        return;
    }

    try {
        const result = await tim.logout();
        if (result.code === 0) {
            console.log('登出成功');
            setInitialized(false);
        } else {
            console.error('登出失败:', result);
        }
    } catch (error) {
        console.error('登出出错:', error);
    }
};