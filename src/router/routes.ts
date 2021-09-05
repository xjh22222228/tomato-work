import { lazy } from 'react'
import { IRouteProps } from '@/router/types'
import { HOME, SETTING } from './constants'
import Login from '@/views/login/index'
import NoMatch from '@/views/exception/404'
import MainEntry from '@/views/main'
import Reminder from '@/views/reminder'
import SettingIndex from '@/views/setting/index'
import HomeIndex from '@/views/index'
import TodayTask from '@/views/today-task'
import Memorandum from '@/views/memorandum'
import MemorandumCreate from '@/views/memorandum/CreatePage'
import MemorandumDetail from '@/views/memorandum/DetailPage'
import CapitalFlow from '@/views/capital-flow'
import CapitalFlowType from '@/views/capital-flow/TypeList'
import TodoList from '@/views/todo-list'
import Company from '@/views/company'
import Log from '@/views/log'
import CreateLog from '@/views/log/CreateLog'

const routesMap: IRouteProps[] = [
  {
    path: HOME.LOGIN.path,
    exact: true,
    component: Login,
    meta: {
      // 当前页面是否需要登录状态
      requiresAuth: false,
      // 网页标题
      title: HOME.LOGIN.name,
      // 如果当前登录状态跳转到后台首页
      isLoginToHome: true
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
        path: HOME.LOG.path,
        component: Log,
        exact: true,
        meta: {
          title: HOME.LOG.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.LOG_CREATE.path,
        component: CreateLog,
        exact: true,
        meta: {
          title: HOME.LOG_CREATE.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.LOG_DETAIL.path,
        component: CreateLog,
        exact: true,
        meta: {
          title: HOME.LOG_DETAIL.name,
          requiresAuth: true,
        }
      },
      {
        path: HOME.COMPANY.path,
        component: Company,
        exact: true,
        meta: {
          title: HOME.COMPANY.name,
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
]

const Base = lazy(() => import('@/views/setting/base'))
const InnerMessage = lazy(() => import('@/views/setting/inner-message'))
const Notification = lazy(() => import('@/views/setting/notification'))
const Account = lazy(() => import('@/views/setting/account'))

export const settingRoutes: IRouteProps[] = [
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
]

export default routesMap
