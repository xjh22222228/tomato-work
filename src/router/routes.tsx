import { lazy } from 'react';
import { IRouteProps } from '@/router/types';
import { HOME, SETTING } from './constants';

import Login from '@/views/public/Login';
import NoMatch from '@/views/exception/NoMatch';
import MainEntry from '@/views/home/MainEntry';
import Reminder from '@/views/home/Reminder';
import SettingIndex from '@/views/home/setting/Index';
import About from '@/views/home/About';
import HomeIndex from '@/views/home/Index';
import TodayTask from '@/views/home/TodayTask';
import Memorandum from '@/views/home/Memorandum/index';
import MemorandumCreate from '@/views/home/Memorandum/Create';
import MemorandumDetail from '@/views/home/Memorandum/Detail';
import CapitalFlow from '@/views/home/CapitalFlow/Index';
import CapitalFlowType from '@/views/home/CapitalFlow/Type';
import TodoList from '@/views/home/TodoList/Index';


const routesMap: Array<IRouteProps> = [
  {
    path: HOME.LOGIN.path,
    exact: true,
    component: Login,
    meta: {
      requiresAuth: false,      // 当前页面是否需要登录状态
      title: HOME.LOGIN.name,   // 网页标题
      isLoginToHome: true       // 是否登录后跳转到首页
    }
  },
  {
    path: HOME.HOME.path,
    component: MainEntry,
    childrenRoutes: [
      {
        path: HOME.HOME_INDEX.path,
        component: HomeIndex,
        exact: true,
        meta: {
          title: HOME.HOME_INDEX.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.REMINDER.path,
        component: Reminder,
        exact: true,
        meta: {
          title: HOME.REMINDER.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.SETTING_INDEX.path,
        component: SettingIndex,
        meta: {
          title: HOME.SETTING_INDEX.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.TODAY_TASK.path,
        component: TodayTask,
        meta: {
          title: HOME.TODAY_TASK.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.ABOUT.path,
        component: About,
        exact: true,
        meta: {
          title: HOME.ABOUT.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.MEMORANDUM.path,
        component: Memorandum,
        exact: true,
        meta: {
          title: HOME.MEMORANDUM.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.MEMORANDUM_CREATE.path,
        component: MemorandumCreate,
        exact: true,
        meta: {
          title: HOME.MEMORANDUM_CREATE.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.MEMORANDUM_DETAIL.path,
        component: MemorandumDetail,
        exact: true,
        meta: {
          title: HOME.MEMORANDUM_DETAIL.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.CAPITAL_FLOW.path,
        component: CapitalFlow,
        exact: true,
        meta: {
          title: HOME.CAPITAL_FLOW.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.CAPITAL_FLOW_TYPE.path,
        component: CapitalFlowType,
        exact: true,
        meta: {
          title: HOME.CAPITAL_FLOW_TYPE.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.TODO_LIST.path,
        component: TodoList,
        exact: true,
        meta: {
          title: HOME.TODO_LIST.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.NO_MATCH.path,
        component: NoMatch,
        meta: {
          requiresAuth: true,
          title: HOME.NO_MATCH.name
        }
      },
    ]
  },
  {
    path: HOME.NO_MATCH.path,
    component: NoMatch,
    meta: {
      requiresAuth: false,
      title: HOME.NO_MATCH.name
    }
  },
];

const Base = lazy(() => import('@/views/home/setting/Base'));
const InnerMessage = lazy(() => import('@/views/home/setting/InnerMessage'));
const Notification = lazy(() => import('@/views/home/setting/Notification'));
const ChangePassword = lazy(() => import('@/views/home/setting/ChangePassword'));

export const settingRoutes: Array<IRouteProps> = [
  {
    path: SETTING.BASE.path,
    component: Base,
    meta: {
      requiresAuth: true,
      title: SETTING.BASE.name
    }
  },
  {
    path: SETTING.INNER_MESSAGE.path,
    component: InnerMessage,
    meta: {
      requiresAuth: true,
      title: SETTING.INNER_MESSAGE.name
    }
  },
  {
    path: SETTING.NOTIFICATION.path,
    component: Notification,
    meta: {
      requiresAuth: true,
      title: SETTING.NOTIFICATION.name
    }
  },
  {
    path: SETTING.CHANGE_PASSWORD.path,
    component: ChangePassword,
    meta: {
      requiresAuth: true,
      title: SETTING.CHANGE_PASSWORD.name
    }
  },
];

export default routesMap;
