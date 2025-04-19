// 修改前
import TIM from 'tim-js-sdk'
window.tim = TIM.create({ 
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
document.getElementById('login-button').addEventListener('click', async () => {
  const userID = `user_${Math.floor(Math.random() * 10000)}`;
  // 临时生成测试用 userSig（生产环境必须由后端生成）
  const userSig = tim.genTestUserSig(userID).userSig;
  
  await loginAsGuest(userID, userSig);
});

// 修改登录函数接收参数
async function loginAsGuest(userID, userSig) {
  if (tim.isLogin()) return;
  
  try {
    await tim.login({ userID, userSig });
    console.log('登录成功，当前用户:', userID);
    await joinGroup();
    // 登录成功后自动隐藏登录框
    document.getElementById('auth-container').classList.add('hidden');
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

// 在文件末尾添加导出
// 在 TIM 实例化部分需要确认的配置
// 在文件顶部添加配置导入
import config from '../config.js';

// 修改 TIM 初始化部分
const tim = TIM.create({
  SDKAppID: config.SDKAppID, // 使用配置中的应用ID
  overrides: { 
    region: 'ap-xian' // ✔️ 确认地域代码正确性
  }
});

// 在群组操作部分需要添加实际群组ID
async function joinGroup() {
  await tim.joinGroup({
    groupID: '@TGS#165X5DTQ6', // 🔧 需替换为控制台创建的真实群组ID
    type: TIM.TYPES.GROUP_AVCHATROOM // 根据群组类型调整
  });
}

// 消息发送事件需要确认接收方
document.getElementById('send-button').addEventListener('click', () => {
  tim.sendMessage({
    to: '@TGS#165X5DTQ6', // 🔧 需与群组ID保持一致
    conversationType: TIM.TYPES.CONV_GROUP
  });
});

document.getElementById('send-button').addEventListener('click', () => {
  import('./message.js').then(module => module.sendMessage());
});