/**
 * @file Reducers Entry
 * @since 1.0.0
 * @author xiejiahe <mb06@qq.com>
 */

import { combineReducers } from 'redux';
import user from './user';
import system from './system';

export default combineReducers({
  user,
  system
});
