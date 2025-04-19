require('dotenv').config();

const SDKAppID = process.env.SDKAppID;
const SECRETKEY = process.env.SECRETKEY;

// 使用 SDKAppID 和 SECRETKEY 生成 UserSig
function genUserSig(userID) {
    const currTime = Math.floor(Date.now() / 1000);
    const expireTime = 60 * 60 * 24 * 180; // 有效期 180 天
    // 添加 crypto 模块引入
    const crypto = require('crypto');
    
    // 修正签名文档结构（根据腾讯云官方要求）
    const sigDoc = {
        "TLS ver": "2.0",
        "TLS identifier": userID,
        "TLS sdkappid": SDKAppID,
        "TLS time": currTime,
        "TLS expire": expireTime,
        "TLS secret": SECRETKEY  // 需要与腾讯云控制台密钥一致
    };
    
    // 修正加密方式（使用 SHA256）
    const hmac = crypto.createHmac('sha256', SECRETKEY);
    hmac.update(JSON.stringify(sigDoc));
    const sig = hmac.digest('base64');

    return sig;
}