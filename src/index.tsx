import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/global.scss';
import Routes from './router';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import store from '@/store';

moment.locale('zh-cn');

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zh_CN}>
      <Routes />
    </LocaleProvider>
  </Provider>,
document.getElementById('tomato-work') as HTMLDivElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
