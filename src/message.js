const messageInput = document.getElementById('message-input');
const imageUpload = document.getElementById('image-upload');

/**
 * 发送文本消息到群组
 * 1. 获取并验证输入内容
 * 2. 创建群聊文本消息体
 * 3. 发送消息并处理结果
 * 4. 成功时更新UI并清空输入框
 */
export async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // 修复文本消息结构
    const textMsg = tim.createTextMessage({
      to: '@TGS#165X5DTQ6',
      conversationType: TIM.TYPES.CONV_GROUP, // 补全会话类型
      payload: { text } // 补全消息载体
    });

    // 发送文本消息
    const { error } = await tim.sendMessage(textMsg);
    if (!error) {
      addMessageToUI({ 
        type: 'text', 
        content: text 
      });
      messageInput.value = '';
    }
}

// 修复图片消息结构
imageUpload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const imageMsg = tim.createImageMessage({
      to: '@TGS#165X5DTQ6',
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: { file }
    });
    
    const { error } = await tim.sendMessage(imageMsg);
    if (!error) {
      addMessageToUI({ 
        type: 'image', 
        content: imageMsg.payload.imageInfoArray[0].url 
      });
    }
  }
});