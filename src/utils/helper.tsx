import { Modal, message } from 'antd';


/**
 * 计算百分比
 * @example
 * totalPercentage(8589934592, 225492992);  // => 98
 */
export function totalPercentage(totalmem: number, freemem: number) {
  return Math.floor((totalmem - freemem) / totalmem * 100);
}

/**
 * 删除模态对话框
 * @return Promise
 */
export function modalConfirmDelete(object = {}) {
  return new Promise(resolve => {
    Modal.confirm({
      title: '确定要删除吗？',
      okType: 'danger',
      onOk() {
        resolve(true);
      },
      ...object
    });
  });
}


// 全屏浏览器
export function fullscreen() {
  try {
    const docElm = document.documentElement as any;
    if (docElm.requestFullscreen) {  
      docElm.requestFullscreen();  
    } else if (docElm.webkitRequestFullScreen) {  
      docElm.webkitRequestFullScreen();  
    } else if (docElm.mozRequestFullScreen) {  
      docElm.mozRequestFullScreen();  
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
    }
  } catch (_) {
    message.warn('您所使用的浏览器不支持全屏');
  }
}

// 退出全屏浏览器
export function exitFullscreen() {
  try {
    const doc = document as any;
    if (doc.exitFullscreen) {  
      doc.exitFullscreen();  
    }  
    else if (doc.mozCancelFullScreen) {  
      doc.mozCancelFullScreen();  
    }  
    else if (doc.webkitCancelFullScreen) {  
      doc.webkitCancelFullScreen();  
    }
    else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  } catch (_) {
    message.warn('您所使用的浏览器不支持退出全屏, 请按ESC');
  }
}
