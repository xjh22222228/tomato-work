import React, { useEffect } from 'react';
import PenelGroup from './components/penel-group';
import SystemInfo from './components/system-info';
import MoneyAccessChart from './components/money-access-chart';
import { DispatchProp, connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { getSystemInfo } from '@/store/actions';
import { StoreState } from '@/store';

const mapStateToProps = ({ system }: StoreState) => ({ system });

type ThunkDispatchProps = ThunkDispatch<{}, {}, AnyAction>;
type Props = DispatchProp & ReturnType<typeof mapStateToProps> & { dispatch: ThunkDispatchProps };

const HomeIndex: React.FC<Props> = function ({ system, dispatch }) {
  useEffect(() => {
    dispatch(getSystemInfo());
  }, []);

  return (
    <div className="home-index oya">
      <PenelGroup />
      <SystemInfo systemInfo={system.info} />
      <MoneyAccessChart />
    </div>
  );
};

export default connect(mapStateToProps)(HomeIndex);
