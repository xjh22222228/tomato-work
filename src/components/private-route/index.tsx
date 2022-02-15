import React from 'react'
import CONFIG from '@/config'
import qs from 'query-string'
import { useLocation, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

type Props = {
  element: React.FC|React.ComponentClass
  meta?: Record<string, any>
}

const o = Object.create(null)

const PrivateRoute: React.FC<Props> = function ({
  element: Component,
  meta = o,
  ...rest
}) {
  const { pathname, search } = useLocation()
  const { isLogin } = useAppSelector(state => state.user)
  const isLoginPage = pathname === '/' || pathname === '/login'

  React.useEffect(() => {
    if (meta.title) {
      document.title = `${meta.title} - ${CONFIG.title}`
    } else {
      document.title = CONFIG.title
    }
  }, [meta])

  if (isLoginPage && isLogin) {
    const redirectUrl = qs.parse(search).redirectUrl as string
    const url = redirectUrl || ('/home/index' + search)
    return <Navigate to={url} replace />
  }

  if (meta.requiresAuth) {
    if (isLogin) {
      return <Component {...rest} />
    } else {
      if (!isLoginPage) {
        return <Navigate to={`/?redirectUrl=${pathname}${search}`} replace />
      }
    }
  }

  return <Component {...rest} />
}

export default PrivateRoute
