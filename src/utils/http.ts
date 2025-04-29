import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import CONFIG from '@/config'
import type { IStore } from '@/store'
import { message, notification } from 'antd'
import { logout } from '@/utils'

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
  delete(url: string, config?: AxiosRequestConfig): Promise<Record<string, any>>
  post(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<Record<string, any>>
  put(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<Record<string, any>>
}

const httpInstance: IAxiosInstance & AxiosInstance = axios.create({
  timeout: 60000,
  baseURL: CONFIG.http.baseURL,
})
httpInstance.defaults.headers.common.isLoading = 'true'
httpInstance.defaults.headers.common.errorAlert = 'true'
Object.setPrototypeOf(httpInstance, axios)

// 主要处理防止store未挂载访问
export function setupInterceptor(store: IStore) {
  httpInstance.interceptors.request.use(
    function (config) {
      const method = config.method
      const userState = store.getState().user.userInfo

      if (userState.token) {
        if (config.headers) {
          config.headers.token = userState.token as string
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
      const headers = res.config.headers
      const data: RespData = res.data
      if (headers?.successAlert) {
        message.success(data.message || 'OK')
      }
      return res.data
    },
    function (error) {
      if (error.response?.data?.statusCode === 401 && !exiting) {
        exiting = true
        logout()
      }

      handleError(error)
      return Promise.reject(error)
    },
  )
}

export default httpInstance
