require('dotenv').config();

const SDKAppID = process.env.SDKAppID;
const SECRETKEY = process.env.SECRETKEY;

// 使用 SDKAppID 和 SECRETKEY 生成 UserSig
function genUserSig(userID) {
    const currTime = Math.floor(Date.now() / 1000);
    const expireTime = 60 * 60 * 24 * 180; // 有效期 180 天
    const sigDoc = {
        TlsVersion: '2020010200',
        SDKAppID: SDKAppID,
        UserID: userID,
        ExpireTime: currTime + expireTime,
        Base64UserBuf: ''
    };

    const sigDocStr = JSON.stringify(sigDoc);
    const hmac = crypto.createHmac('sha256', SECRETKEY);
    hmac.update(sigDocStr);
    const sig = hmac.digest('base64');

    return sig;
}