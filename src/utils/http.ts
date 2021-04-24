import axios, { AxiosError } from 'axios'
import CONFIG from '@/config'
import store from '@/store'
import { message, notification } from 'antd'
import { logout } from '@/store/actions'

interface RespData {
  success: boolean
  errorCode: number
  msg?: string
  data?: any
  [key: string]: any
}

let exiting = false

function handleError(error: AxiosError) {
  if (axios.isCancel(error)) {
    console.log(error)
  } else {
    const response = error.response
    notification.error({
      message: `Error Code: ${response?.status ?? -1}`,
      description: response?.statusText ?? '服务器出小差'
    })
  }
}

const httpInstance = axios.create({
  timeout: 60000,
  baseURL: CONFIG.http.baseURL
})

httpInstance.defaults.headers.common.isLoading = true
httpInstance.defaults.headers.common.successAlert = false
httpInstance.defaults.headers.common.errorAlert = true
Object.setPrototypeOf(httpInstance, axios)

httpInstance.interceptors.request.use(function (config) {
  const method = config.method
  const userState = store.getState().user.userInfo

  config.headers.token = userState.token

  const data: { [k: string]: any } = {}

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
}, function (error) {
  handleError(error)
  return Promise.reject(error)
})


httpInstance.interceptors.response.use(function (res) {
  const headers = res.config.headers
  const data: RespData = res.data

  if (!data.success && headers.errorAlert) {
    notification.error({
      message: `错误码: ${data.errorCode ?? -1}`,
      description: data.msg ?? '服务器出小差'
    })
  }

  if (data.success && headers.successAlert) {
    message.success(data.msg ?? 'Success')
  }

  if (data.errorCode === 401 && !exiting) {
    exiting = true
    setTimeout(logout, 2000)
  }
  return res
}, function (error) {
  handleError(error)
  return Promise.reject(error)
})

export default httpInstance
