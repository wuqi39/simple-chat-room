// group.js
import { tim } from '/src/main.js';

// 加入群组（需提前在腾讯云控制台创建）
function joinGroup() {
    tim.joinGroup({
        groupID: '@TGS#165X5DTQ6',
        type: TIM.TYPES.GROUP_C2C
    });
}

// 离开群组
function leaveGroup() {
    tim.quitGroup({ groupID: '@TGS#165X5DTQ6' });
}

// 创建群组
async function createGroup() {
    try {
        const { error } = await tim.createGroup({
            type: TIM.TYPES.GROUP_C2C,
            name: 'New Group',
            memberList: []
        });
        if (!error) {
            console.log('群组创建成功');
        } else {
            console.error('群组创建失败:', error);
        }
    } catch (e) {
        console.error('群组创建出错:', e);
    }
}

// 查看群成员
async function getGroupMembers() {
    try {
        const { error, data } = await tim.getGroupMemberList({
            groupID: '@TGS#165X5DTQ6',
            filter: TIM.TYPES.GRP_MBR_FILTER_ALL
        });
        if (!error) {
            console.log('群成员列表:', data.memberList);
        } else {
            console.error('获取群成员列表失败:', error);
        }
    } catch (e) {
        console.error('获取群成员列表出错:', e);
    }
}

export { joinGroup, leaveGroup, createGroup, getGroupMembers };