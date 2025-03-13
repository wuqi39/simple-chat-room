// 加入群组（需提前在腾讯云控制台创建）
function joinGroup() {
    tim.joinGroup({
      groupID: 'group_id', // 替换为实际群组ID
      type: TIM.TYPES.GROUP_C2C // 或GROUP_TYPE_GROUP
    }).catch(e => console.error('入群失败:', e));
  }
  
  // 离开群组
  function leaveGroup() {
    tim.quitGroup({ groupID: 'group_id' });
  }