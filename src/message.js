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
    if (!text) return;  // 空内容拦截
  
    // 创建文本消息（群组类型）
    const msg = tim.createTextMessage({
      to: 'group_id', // TODO: 需替换为实际的群组ID (从腾讯云控制台获取)
      conversationType: TIM.TYPES.CONV_GROUP, // 会话类型设为群组
      payload: { text } // 消息载体包含处理后的文本
    });
  
    // 发送消息（异步等待发送结果）
    const { error } = await tim.sendMessage(msg);
    if (!error) {
      // UI 更新（模拟成功状态）
      addMessageToUI({ 
        type: 'text', 
        content: text 
      });
      messageInput.value = ''; // 清空输入框
    }
  }
  
  // 图片上传（保留原按钮交互）
  imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const msg = tim.createImageMessage({
        to: 'group_id',
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: { file }
      });
      const { error, message } = await tim.sendMessage(msg);
      if (!error) {
        addMessageToUI({ type: 'image', content: message.payload.imageInfoArray[0].url });
      }
    }
  });