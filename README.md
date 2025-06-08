<p align="center">
  <a href="https://work.xiejiahe.com">
    <img src="public/logo.svg" width="150" />
  </a>
  <br />
  <b>Tomato Work 个人事务管理系统</b>
  <p align="center">
    <a href="https://github.com/xjh22222228/tomato-work-server"><img alt="Server" src="https://img.shields.io/static/v1.svg?label=&message=Server&style=flat-square&color=e8883a" /></a>
    <img alt="React" src="https://img.shields.io/static/v1.svg?label=&message=React&style=flat-square&color=61daeb" />
    <img src="https://img.shields.io/github/license/xjh22222228/tomato-work" />
  </p>
</p>

## Screenshot

![](media/screenshot.png)

## 主要功能

- [x] github 登录
- [x] 提醒事项 - 支持日期和Cron定时，通过企业微信+邮箱推送
- [x] 活动清单
- [x] 今日待办
- [x] 日志管理
- [x] 公司单位
- [x] 账单管理
- [x] 个人中心
- [x] 我的备忘 - 支持 Markdown & WYSIWYG

## 开发

- Node.js >= 22

```bash
$ git clone --depth=1 https://github.com/xjh22222228/tomato-work.git

$ pnpm i

# user: test, password: 123456
$ npm start # 启动本地环境
$ npm run start:prod # 连接作者生产环境，可以用于客户端学习

# 打包
npm run build
```

---

## License

[MIT](https://opensource.org/licenses/MIT)
