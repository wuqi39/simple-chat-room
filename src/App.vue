<template>
  <div class="chat-container">
    <!-- 聊天标题 -->
    <h1>简单聊天室</h1>
    <!-- 消息显示区域 -->
    <div class="message-list">
      <div v-for="message in messages" :key="message.id" class="message">
        <span class="message-sender">{{ message.sender }}</span>: 
        <span class="message-content">{{ message.content }}</span>
      </div>
    </div>
    <!-- 消息输入框和发送按钮 -->
    <div class="input-area">
      <input 
        v-model="newMessage" 
        type="text" 
        placeholder="输入消息..." 
        @keyup.enter="sendMessage"
      >
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 定义消息列表
const messages = ref([
  { id: 1, sender: '系统', content: '欢迎来到聊天室！' }
]);

// 定义新消息输入框绑定的值
const newMessage = ref('');

// 发送消息的方法
const sendMessage = () => {
  if (newMessage.value.trim() === '') return;
  const newMsg = {
    id: messages.value.length + 1,
    sender: '你',
    content: newMessage.value
  };
  messages.value.push(newMsg);
  newMessage.value = '';
};
</script>

<style scoped>
.chat-container {
  width: 400px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.message-list {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 5px;
}

.message-sender {
  font-weight: bold;
}

.input-area {
  display: flex;
}

.input-area input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-right: 10px;
}

.input-area button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.input-area button:hover {
  background-color: #0056b3;
}
</style>
