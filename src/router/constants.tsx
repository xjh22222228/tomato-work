// 路由常量配置信息

export const SETTING = {
  BASE: { name: '个人中心', path: '/home/setting/base' },

  INNER_MESSAGE: { name: '消息中心', path: '/home/setting/innerMessage' },

  NOTIFICATION: { name: '消息通知', path: '/home/setting/notification' },
  
  ACCOUNT: { name: '账号设置', path: '/home/setting/account' },
};

export const HOME = {
  LOGIN: { name: '登录', path: ['/', '/login'] },

  HOME: { name: '', path: '/home' },

  HOME_INDEX: { name: '后台首页', path: '/home/index' },

  REMINDER: { name: '提醒事项', path: '/home/reminder' },

  SETTING_INDEX: { name: '个人中心', path: '/home/setting' },

  TODAY_TASK: { name: '今日待办', path: '/home/todayTask' },

  MEMORANDUM: { name: '备忘录列表', path: '/home/memorandum' },
  MEMORANDUM_CREATE: { name: '备忘录创建', path: [
    '/home/memorandum/create', '/home/memorandum/update/:id'
  ] },
  MEMORANDUM_DETAIL: { name: '*', path: '/home/memorandum/detail/:id' },

  CAPITAL_FLOW: { name: '资金流动', path: '/home/capitalFlow' },
  CAPITAL_FLOW_TYPE: { name: '创建类型', path: '/home/capitalFlow/type' },

  TODO_LIST: { name: '活动清单', path: '/home/todoList' },

  NO_MATCH: { name: '404 Not Found', path: '*' },
};
