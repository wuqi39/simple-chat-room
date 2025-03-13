// 原sendMessage函数改造
export async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
  
    // 创建文本消息
    const msg = tim.createTextMessage({
      to: 'group_id', // 腾讯云创建的群组ID
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: { text }
    });
  
    // 发送消息（保留UI反馈）
    const { error } = await tim.sendMessage(msg);
    if (!error) {
      addMessageToUI({ type: 'text', content: text }); // 保持UI一致
      messageInput.value = '';
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