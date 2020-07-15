/**
 * @file Reducers Entry
 * @since 1.0.0
 * @author xiejiahe <xjh22222228@gmail.com>
 */

import user from './user';
import system from './system';
import { combineReducers } from 'redux';

export default combineReducers({
  user,
  system
});
