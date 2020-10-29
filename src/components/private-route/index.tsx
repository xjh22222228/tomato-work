import React from 'react'
import CONFIG from '@/config'
import qs from 'query-string'
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom'
import { IRouteProps } from '@/router/types'
import { connect } from 'react-redux'
import { StoreState } from '@/store/index'
import { HOME } from '@/router/constants'

type Props = IRouteProps & ReturnType<typeof mapStateToProps> & RouteComponentProps

const PrivateRoute: React.FC<Props> = function ({
  component: Component,
  childrenRoutes,
  isLogin,
  location,
  ...rest
}) {

  // 取消不是当前页面的所有http请求
  if (Array.isArray(window.axiosCancelTokenStore)) {
    window.axiosCancelTokenStore.forEach(store => {
      if (store.pathname !== location.pathname) {
        store.cancel()
      }
    })
    window.axiosCancelTokenStore = []
  }

  const { meta } = rest
  if (meta) {
    if (meta.title) {
      document.title = `${meta.title} - ${CONFIG.title}`
    } else {
      document.title = CONFIG.title
    }
  }

  // 验证权限
  const auth = function () {
    if (meta?.requiresAuth) {
      if (isLogin) {
        return true
      }
      return false
    }
    return true
  }()

  if (meta?.isLoginToHome && isLogin) {
    const redirectUrl = qs.parse(location.search).redirectUrl as string
    const url = redirectUrl || HOME.HOME_INDEX.path
    return <Redirect to={url} />
  }

  return (
    <Route render={props => {
      return (
        auth ? (
          <Component {...props} {...rest}>
            {Array.isArray(childrenRoutes) ? (
              <Switch>
                {childrenRoutes.map((route, idx: number) => (
                  <PrivateRouteComponent {...route} key={idx} />
                ))}
              </Switch>
            ) : null}
          </Component>
        ) : (
          <Redirect to={{
            pathname: '/',
            search: `?redirectUrl=${props.location.pathname}`
          }} />
        )
      )
    }} />
  )
}

const mapStateToProps = (state: StoreState) => {
  return {
    isLogin: state.user.isLogin
  }
}

export const PrivateRouteComponent = connect(mapStateToProps)(withRouter(PrivateRoute))

export default PrivateRouteComponent
