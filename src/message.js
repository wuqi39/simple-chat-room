// 修复：将导入语句移到文件顶部
import { tim } from './main.js'

const messageInput = document.getElementById('message-input');
const imageUpload = document.getElementById('image-upload');

export async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // 修复：移除函数内的重复导入
    const textMsg = tim.createTextMessage({
      to: '@TGS#165X5DTQ6',
      conversationType: tim.TYPES.CONV_GROUP, // 使用小写 tim 引用
      payload: { text }
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

// 图片上传部分也需要修改
// 需要补充图片上传处理
imageUpload.addEventListener('change', async (e) => {
  const imageMsg = tim.createImageMessage({
    to: '@TGS#165X5DTQ6', // 🔧 需保持与群组ID一致
    payload: {
      file: e.target.files[0],
      imageFormat: 1 // 1-原图，2-大图，3-缩略图
    }
  });
});