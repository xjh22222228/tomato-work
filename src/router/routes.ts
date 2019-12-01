import { lazy } from 'react';
import { IRouteProps } from '@/router/types';
import { HOME, SETTING } from './constants';

import Login from '@/views/login/index';
import NoMatch from '@/views/exception/no-match';
import MainEntry from '@/views/home/main-entry';
import Reminder from '@/views/home/reminder';
import SettingIndex from '@/views/home/setting/index';
import HomeIndex from '@/views/home/index';
import TodayTask from '@/views/home/today-task';
import Memorandum from '@/views/home/memorandum/index';
import MemorandumCreate from '@/views/home/memorandum/create';
import MemorandumDetail from '@/views/home/memorandum/detail';
import CapitalFlow from '@/views/home/capital-flow/index';
import CapitalFlowType from '@/views/home/capital-flow/type';
import TodoList from '@/views/home/todo-list/index';


const routesMap: Array<IRouteProps> = [
  {
    path: HOME.LOGIN.path,
    exact: true,
    component: Login,
    meta: {
      requiresAuth: false,      // 当前页面是否需要登录状态
      title: HOME.LOGIN.name,   // 网页标题
      isLoginToHome: true       // 如果当前登录状态跳转到后台首页
    }
  },
  {
    path: HOME.HOME.path,
    component: MainEntry,
    meta: {
      requiresAuth: true,
    },
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

const Base = lazy(() => import('@/views/home/setting/base'));
const InnerMessage = lazy(() => import('@/views/home/setting/inner-message'));
const Notification = lazy(() => import('@/views/home/setting/notification'));
const Account = lazy(() => import('@/views/home/setting/account'));

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
    path: SETTING.ACCOUNT.path,
    component: Account,
    meta: {
      requiresAuth: true,
      title: SETTING.ACCOUNT.name
    }
  },
];

export default routesMap;
