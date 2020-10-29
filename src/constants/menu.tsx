import React from 'react'
import { HOME, SETTING } from '@/router/constants'
import {
  HomeOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  FormOutlined,
  UserOutlined
} from '@ant-design/icons'

export const HOME_SIDER_MENU_LIST = [
  {
    path: HOME.HOME_INDEX.path,
    icon: <HomeOutlined />,
    name: HOME.HOME_INDEX.name
  },
  {
    path: HOME.REMINDER.path,
    icon: <ClockCircleOutlined />,
    name: HOME.REMINDER.name
  },
  {
    path: HOME.TODO_LIST.path,
    icon: <FileDoneOutlined />,
    name: HOME.TODO_LIST.name,
  },
  {
    path: HOME.TODAY_TASK.path,
    icon: <ScheduleOutlined />,
    name: HOME.TODAY_TASK.name
  },
  {
    path: '',
    icon: <BarChartOutlined />,
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
    icon: <FormOutlined />,
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
    icon: <UserOutlined />,
    name: SETTING.BASE.name
  }
]

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
    path: SETTING.ACCOUNT.path,
    name: SETTING.ACCOUNT.name
  },
]
