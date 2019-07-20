import React from 'react';
import './style.scss';

const About: React.FC = function () {
  
  return (
    <div className="about overflow-y_auto">
      <div className="block-item">
        <h2>Tomato Work</h2>
        <p>
          <span>tomato-work  个人事务管理系统, 为自己精心打造的一个系统，并开源分享。本项目搭配服务端, 具体查看 =>  </span>
          <a href="https://github.com/xjh22222228/tomato-work-server" target="_blank">tomato-work-server</a> 
        </p>
        <p> tomato-work 的命名来源于《番茄工作法》，由于与本项目非常的贴近，所以因此而来。</p>
      </div>
      <div className="block-item suupport">
        <h2>支持作者</h2>
        <p>您的支持就是我开源的动力</p>
        <div className="pay-wrapper">
          <img 
            src="https://raw.githubusercontent.com/xjh22222228/statics/master/images/2018/32.png"
            alt="" 
            className="pay-img"
          />
        </div>
      </div>
      <div className="block-item">
        <h2>License</h2>
        <p><a href="https://opensource.org/licenses/MIT" target="_blank">MIT</a></p>
        <p>只要注明原作者许可声明，您可以自由地复制、分享、和修改。</p>
        <p>Copyright (c) 2019-present, <a href="https://github.com/xjh22222228/" target="_blank">xiejiahe</a></p>
      </div>
    </div>
  )
};

export default About;
