/**
 * @file Global config file
 * @since 1.0.0
 * @author xiejiahe <mb06@qq.com>
 */

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

const CONFIG = {
  isProduction,
  isDevelopment,
  // 路由 basename
  baseURL: '/',
  // 网页标题
  title: 'Tomato Work',
  http: {
    baseURL: '/api'
  },
  github: {
    clientId: isProduction ? '9a6052b7834e7441cb95' : '489b39e1f91d934128c8',
    // callbackURL 不可随意更改, 否则需要与服务端配置文件一同修改
    callbackURL: `${window.location.origin}/api/passport/github/callback`,
    repositoryUrl: 'https://github.com/xjh22222228/tomato-work',
    bug: 'https://github.com/xjh22222228/tomato-work/issues'
  }
};

export default CONFIG;
