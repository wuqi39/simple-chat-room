// 添加CSS导入
import './styles.css';
import config from '../config.js';  // 新路径（src目录下）

// 动态加载腾讯云SDK
const loadTIM = async () => {
    try {
        const { default: TIM } = await import('tim-js-sdk');
        return TIM;
    } catch (error) {
        console.error('腾讯云 SDK 加载失败:', error);
        // 可以在这里给用户一个更友好的提示，例如弹出一个模态框
        alert('腾讯云 SDK 加载失败，请稍后重试。');
        return null;
    }
};

export let tim;
export let isTIMInitialized = false;


// 登录函数
// 修改登录函数，确保正确设置初始化状态
export const login = async (id, sig) => {
    const TIM = await loadTIM();
    if (TIM) {
        try {
            tim = TIM.create({
                SDKAppID: config.SDKAppID,
                logLevel: TIM.TYPES.LOG_DEBUG,
                overrides: {
                    region: 'ap-xian'
                }
            });
            console.log('TIM SDK 初始化成功');

            userID = id;
            userSig = sig;

            const loginResult = await tim.login({ userID, userSig });
            if (loginResult.code === 0) {
                console.log('登录成功');
                // 返回一个Promise，等待SDK_READY事件
                return new Promise((resolve) => {
                    tim.on(TIM.EVENT.SDK_READY, async () => {
                        console.log('SDK 已准备好');
                        isTIMInitialized = true;
                        await joinGroup();
                        tim.on(TIM.EVENT.MESSAGE_RECEIVED, handleMessageReceived);
                        resolve(true);
                    });
                });
            } else {
                if (loginResult.code === 60020) {
                    alert('您未购买套餐包，或套餐包已过期，请登录 即时通信 IM 购买页面 重新购买套餐包。');
                } else if (loginResult.code === 2801) {
                    alert('请检查小程序受信域名配置。');
                } else {
                    console.error('登录失败:', loginResult);
                    alert('登录失败，请稍后重试。');
                }
            }
        } catch (e) {
            console.error('TIM SDK 初始化或登录失败:', e);
            alert('TIM SDK 初始化或登录失败，请稍后重试。');
        }
    }
    return false;
};


// main.js
// 游客登录函数
export const loginAsGuest = async () => {
    console.log('loginAsGuest 函数开始执行');
    await login(config.guestUserID, config.guestUserSig);
    console.log('loginAsGuest 函数执行结束');
};

// 加入群组
const joinGroup = async () => {
    try {
        const result = await tim.joinGroup({
            groupID: '@TGS#165X5DTQ6', // 需替换为实际创建的群组ID
            type: TIM.TYPES.GROUP_C2C
        });
        if (result.code === 0) {
            console.log('加入群组成功');
        } else {
            console.error('加入群组失败:', result);
        }
    } catch (error) {
        console.error('加入群组出错:', error);
    }
};

// 处理接收到的消息
const handleMessageReceived = (event) => {
    event.data.forEach((message) => {
        if (message.conversationID === `GROUP@TGS#165X5DTQ6`) {
            const sender = message.from;
            const content = message.payload.text;
            addMessageToUI({
                type: 'text',
                sender,
                content
            });
        }
    });
};

// 添加消息到UI
const addMessageToUI = ({ type, sender, content }) => {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    const isSelf = sender === userID;
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

// 登出函数
export const logout = async () => {
    try {
        const result = await tim.logout();
        if (result.code === 0) {
            console.log('登出成功');
        } else {
            console.error('登出失败:', result);
        }
    } catch (error) {
        console.error('登出出错:', error);
    }
};

// 销毁 SDK 实例
export const destroy = async () => {
    try {
        const result = await tim.destroy();
        if (result.code === 0) {
            console.log('SDK 实例销毁成功');
        } else {
            console.error('SDK 实例销毁失败:', result);
        }
    } catch (error) {
        console.error('SDK 实例销毁出错:', error);
    }
};

// 监听被踢下线事件
if (tim) {
    tim.on(TIM.EVENT.KICKED_OUT, (event) => {
        console.log('用户被踢下线:', event.data.type);
        // 可以在这里跳转到登录页或给出提示
        alert('您已被踢下线，请重新登录。');
        // 可以添加登出逻辑
        logout();
    });
}

// 新增模块导入
import { sendMessage, handleImageUpload } from './message.js';

// 绑定发送按钮事件
document.getElementById('send-button').addEventListener('click', sendMessage);

// 绑定图片上传事件
document.getElementById('image-upload').addEventListener('change', handleImageUpload);