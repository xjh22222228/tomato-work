import { HOME, SETTING } from '@/router/constants';

export const HOME_SIDER_MENU_LIST = [
  {
    path: HOME.HOME_INDEX.path,
    type: 'home',
    name: HOME.HOME_INDEX.name
  },
  {
    path: HOME.REMINDER.path,
    type: 'clock-circle',
    name: HOME.REMINDER.name
  },
  {
    path: HOME.TODO_LIST.path,
    type: 'file-done',
    name: HOME.TODO_LIST.name,
  },
  {
    path: HOME.TODAY_TASK.path,
    type: 'schedule',
    name: HOME.TODAY_TASK.name
  },
  {
    path: '',
    type: 'bar-chart',
    name: '财务管理',
    children: [
      {
        path: HOME.CAPITAL_FLOW.path,
        name: HOME.CAPITAL_FLOW.name,
      },
      {
        path: HOME.CAPITAL_FLOW_TYPE.path,
        name: HOME.CAPITAL_FLOW_TYPE.name,
      }
    ]
  },
  {
    path: HOME.MEMORANDUM.path,
    type: 'form',
    name: '我的备忘',
    children: [
      {
        path: HOME.MEMORANDUM.path,
        name: HOME.MEMORANDUM.name,
      },
      {
        path: HOME.MEMORANDUM_CREATE.path[0],
        name: HOME.MEMORANDUM_CREATE.name,
      }
    ]
  },
  {
    path: SETTING.BASE.path,
    type: 'user',
    name: SETTING.BASE.name
  },
  {
    path: HOME.ABOUT.path,
    type: 'question-circle',
    name: HOME.ABOUT.name
  },
];

export const SETTING_SIDER_MENU_LIST = [
  {
    path: SETTING.BASE.path,
    name: SETTING.BASE.name
  },
  {
    path: SETTING.INNER_MESSAGE.path,
    name: SETTING.INNER_MESSAGE.name
  },
  {
    path: SETTING.NOTIFICATION.path,
    name: SETTING.NOTIFICATION.name
  },
  {
    path: SETTING.CHANGE_PASSWORD.path,
    name: SETTING.CHANGE_PASSWORD.name
  },
];
