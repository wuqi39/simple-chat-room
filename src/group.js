import { tim } from './main.js'

// 加入群组（需提前在腾讯云控制台创建）
function joinGroup() {
  tim.joinGroup({
    groupID: '@TGS#165X5DTQ6', // 需替换为实际创建的群组ID
    type: TIM.TYPES.GROUP_C2C 
  });
}

// 离开群组
function leaveGroup() {
  tim.quitGroup({ groupID: 'your_actual_group_id' });
}