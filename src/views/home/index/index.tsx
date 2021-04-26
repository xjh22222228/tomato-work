import React, { useEffect } from 'react'
import './style.scss'
import PenelGroup from './PenelGroup'
import SystemInfo from './SystemInfo'
import MoneyAccessChart from './AmountChart'
import { DispatchProp, connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { getSystemInfo } from '@/store/actions'
import { StoreState } from '@/store'

const mapStateToProps = ({ system }: StoreState) => ({ system })

type ThunkDispatchProps = ThunkDispatch<{}, {}, AnyAction>

type Props = DispatchProp & ReturnType<typeof mapStateToProps> & { dispatch: ThunkDispatchProps }

const HomeIndexPage: React.FC<Props> = function ({ system, dispatch }) {
  useEffect(() => {
    dispatch(getSystemInfo())
  }, [])

  return (
    <div className="home-index oya">
      <PenelGroup />
      <SystemInfo systemInfo={system.info} />
      <MoneyAccessChart />
    </div>
  )
}

export default connect(mapStateToProps)(HomeIndexPage)
