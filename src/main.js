import TIM from 'tim-js-sdk';
//import { LogLevel } from 'tim-js-sdk';
import { joinGroup } from './group.js';
import { addMessageToUI } from './ui.js';
// 初始化IM（请替换成你的配置）
// 初始化优化建议（修复匿名函数警告）
const tim = TIM.create({
  SDKAppID: 1600076969,
  logLevel: LogLevel.DEBUG,
  // 新增地域配置（根据用户群体选择）
  overrides: { 
    region: 'ap-xian' // 可选地区：
                           // ap-beijing(华北-北京)
                           // ap-shanghai(华东-上海)
                           // ap-guangzhou(华南-广州)
                           // ap-chengdu(西南-成都)
                           // ap-xian(西北-西安)
                           // ap-hongkong(中国香港)
                           // ap-singapore(东南亚-新加坡)
  }
});

// 具名函数处理消息（修复 SDK 警告）
function handleMessageReceived(event) {
  event.data.forEach(msg => {
    const message = {
      type: msg.type === TIM.TYPES.MSG_TEXT ? 'text' : 'image',
      content: msg.type === TIM.TYPES.MSG_TEXT ? msg.payload.text : msg.payload.imageInfoArray[0].url,
      timestamp: new Date().toLocaleTimeString()
    };
    addMessageToUI(message); // 保留原UI函数
  });
}

// 使用具名函数注册监听
tim.on(TIM.EVENT.MESSAGE_RECEIVED, handleMessageReceived);

// 简化版游客登录（生产环境需后端签发userSig）
async function loginAsGuest() {
  // 添加登录状态检查
  if (tim.isLogin()) return;

  // 原有登录逻辑...
  try {
    await tim.login({ userID, userSig });
    console.log('登录成功，当前用户:', userID);
    joinGroup();
  } catch (e) {
    console.error('登录失败:', e);
  }
}

function toggleAuthContainer() {
  const authContainer = document.getElementById('auth-container');
  authContainer.classList.toggle('hidden');
}

// 确保全局挂载（新增 IIFE 包装）
(function() {
  window.toggleAuthContainer = toggleAuthContainer;
})();