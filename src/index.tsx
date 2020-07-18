import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/global.scss';
import Routes from './router';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import store from '@/store';

moment.locale('zh-cn');

ReactDOM.render(
  // <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={zh_CN}>
        <Routes />
      </ConfigProvider>
    </Provider>
  // </React.StrictMode>
  ,
  document.getElementById('tomato-work-root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
