import TIM from 'tim-js-sdk';
//import { LogLevel } from 'tim-js-sdk';
import { joinGroup } from './group.js';
import { addMessageToUI } from './ui.js';
// 初始化IM（请替换成你的配置）
const tim = TIM.create({
  SDKAppID: 1600076969, // 腾讯云控制台获取
  logLevel: 0 // 直接使用 DEBUG 对应的常量值
});

// 消息接收监听（保持UI更新逻辑）
tim.on(TIM.EVENT.MESSAGE_RECEIVED, (event) => {
  event.data.forEach(msg => {
    const message = {
      type: msg.type === TIM.TYPES.MSG_TEXT ? 'text' : 'image',
      content: msg.type === TIM.TYPES.MSG_TEXT ? msg.payload.text : msg.payload.imageInfoArray[0].url,
      timestamp: new Date().toLocaleTimeString()
    };
    addMessageToUI(message); // 保留原UI函数
  });
});

// 简化版游客登录（生产环境需后端签发userSig）
async function loginAsGuest() {
  const userID = `guest_${Date.now()}`;
  const userSig = 'your_generated_user_sig'; // 需后端生成，此处仅演示
  try {
    await tim.login({ userID, userSig });
    joinGroup(); // 加入群组
  } catch (e) {
    console.error('登录失败:', e);
  }
}
/**
 * 切换认证容器的显示状态,通过切换 CSS 类 'hidden' 控制登录/注册界面的显隐
 * 通常绑定到登录按钮的点击事件
 */
function toggleAuthContainer() {
  // 获取认证容器 DOM 元素
  const authContainer = document.getElementById('auth-container');
  // 切换隐藏类（依赖样式表中 .hidden 的 display: none 定义）
  authContainer.classList.toggle('hidden');
}