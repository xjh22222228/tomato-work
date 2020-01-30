/**
 * @file Reducers Entry
 * @since 1.0.0
 * @author xiejiahe <mb06@qq.com>
 */

import user from './user';
import system from './system';
import { combineReducers } from 'redux';

export default combineReducers({
  user,
  system
});
