
const API = Object.freeze({
  // 验证码
  getCaptcha: '/api/captcha?code=',
  // 账号密码登录
  login: '/passport/local',
  // 使用token登录
  loginByToken: '/accessToken',
  // 退出登录
  logout: '/logout',
  // 获取系统信息
  getSystemInfo: '/system/info',
  // 更新用户
  updateUser: '/user/update',
  // 获取用户配置
  getUserConfig: '/userConfig',
  // 提醒事项
  reminder: '/reminder',
  // 今日待办
  todayTask: '/task',
  // 资金流动类型
  capitalFlowType: '/capitalFlowType',
  // 资金流动
  capitalFlow: '/capitalFlow',
  // 获取资金流动金额
  getCapitalFlowPrice: '/capitalFlow/price',
  // 备忘录
  memorandum: '/memorandum',
  // 站内消息
  innerMessage: '/innerMessage',
  // 活动清单
  todoList: '/todoList',
  // 获取首页面板数据
  getPanelData: '/panel'
});

export default API;
