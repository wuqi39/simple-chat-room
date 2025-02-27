import { uploadImage } from './services/storage.js';
import { sendImageMessage } from './services/message.js';

// 获取 DOM 元素
const imageUpload = document.getElementById('image-upload');

// 图片消息上传逻辑
imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const url = await uploadImage(file);
    if (url) {
        await sendImageMessage(url);
    }
});
