/**
 * @file System reducers
 * @since 1.0.0
 * @author xiejiahe <mb06@qq.com>
 */

import { SYSTEM } from '../constants';
import _ from 'lodash';

const { INFO } = SYSTEM;

export interface SystemState {
  info: {
    mysqlVersion: string;
    currentSystemTime: number;
    freemem: number;
    totalmem: number;
    platform: string;
    type: string;
    hostname: string;
    arch: string;
    nodeVersion: string;
    cpus: any[];
  }
}

const initialState: SystemState = {
  info: {
    mysqlVersion: '',
    currentSystemTime: Date.now(),
    freemem: 0,
    totalmem: 0,
    platform: '',
    type: '',
    hostname: '',
    arch: '',
    nodeVersion: '',
    cpus: []
  }
};
 
function system(state = initialState, action: any): SystemState {
  switch (action.type) {
    case INFO:
      if (_.isEmpty(action.data)) {
        return state;
      }
      return Object.assign({}, state, { info: action.data });
    default:
      return state;
  }
}

export default system;
