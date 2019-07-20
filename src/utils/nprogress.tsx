/**
 * @file Customization nprogress
 * @since 1.0.0
 * @author xiejiahe <mb06@qq.com>
 */

import Np from 'nprogress';

Np.configure({
  template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
});

export const NProgress = Np;
