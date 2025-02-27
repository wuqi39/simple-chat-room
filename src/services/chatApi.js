import axios from 'axios';

const baseURL = 'https://your-api-url.com';

const chatApi = axios.create({
  baseURL,
});

export const getMsgList = (roomId) => {
  return chatApi.get(`/chat/msg/page?roomId=${roomId}`);
};

export const sendMsg = (data) => {
  return chatApi.post('/chat/msg', data);
};
