// 加入群组（需提前在腾讯云控制台创建）
function joinGroup() {
  tim.joinGroup({
    groupID: 'your_actual_group_id', // 替换为实际群组ID
    type: TIM.TYPES.GROUP_C2C // 或其他合适的群组类型
  }).catch(e => console.error('入群失败:', e));
}

// 离开群组
function leaveGroup() {
  tim.quitGroup({ groupID: 'your_actual_group_id' });
}