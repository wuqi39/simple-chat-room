class MessageQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(message) {
    this.queue.push(message);
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    const message = this.queue.shift();

    try {
      await this.sendMessage(message);
    } catch (error) {
      console.error('消息发送失败:', error);
      // 可以在这里实现重试逻辑
      this.queue.unshift(message);
    } finally {
      this.isProcessing = false;
      this.processQueue();
    }
  }

  async sendMessage(message) {
    // 这里可以调用实际的发送消息 API
    console.log('发送消息:', message);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }
}

export const messageQueue = new MessageQueue();
