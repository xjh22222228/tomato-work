import axios from 'axios'
import NProgress from 'nprogress'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import CONFIG from '@/config'
import { message, notification } from 'antd'
import { logout } from '@/utils'
import { LOCAL_STORAGE } from '@/constants/storage'

interface RespData {
  statusCode: number
  error?: string
  message?: string
  [key: string]: any
}

let exiting = false

function handleError(error: any) {
  const status =
    error.status || error.response?.data?.status || error.code || ''
  const errorMsg = error.response?.data?.message || error.message || ''
  notification.error({
    message: 'Error：' + status,
    description: errorMsg,
  })
}

interface IAxiosInstance {
  get(url: string, config?: AxiosRequestConfig): Promise<Record<string, any>>
  post(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<Record<string, any>>
}

const httpInstance: IAxiosInstance & AxiosInstance = axios.create({
  timeout: 60000,
  baseURL: CONFIG.http.baseURL,
})

// 主要处理防止store未挂载访问
httpInstance.interceptors.request.use(
  function (config) {
    NProgress.start()
    const method = config.method
    const token = localStorage.getItem(LOCAL_STORAGE.TOKEN)

    if (token) {
      if (config.headers) {
        config.headers.token = token
      }
    }

    const data: Record<string, any> = {}

    if (method === 'post' || method === 'put') {
      if (config.data instanceof FormData) {
        for (let key in data) {
          config.data.append(key, data[key])
        }
      } else {
        config.data = Object.assign(data, config.data)
      }
    }

    return config
  },
  function (error) {
    handleError(error)
    return Promise.reject(error)
  },
)

httpInstance.interceptors.response.use(
  function (res) {
    NProgress.done()
    const headers = res.config.headers
    const data: RespData = res.data
    if (headers?.successAlert) {
      message.success(data.message || 'OK')
    }
    return res.data
  },
  function (error) {
    NProgress.done()
    if (error.response?.data?.statusCode === 401 && !exiting) {
      exiting = true
      logout()
    }

    handleError(error)
    return Promise.reject(error)
  },
)

export default httpInstance
