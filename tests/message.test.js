import { sendTextMessage } from '../src/services/message.js';

describe('Message Service', () => {
    test('发送文本消息', async () => {
        const response = await sendTextMessage('测试消息');
        expect(response.error).toBeNull();
    });
});