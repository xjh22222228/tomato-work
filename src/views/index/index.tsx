import React, { useEffect } from 'react'
import './style.scss'
import PenelGroup from './PenelGroup'
import SystemInfo from './SystemInfo'
import AmountChart from './AmountChart'
import { getSystemInfo } from '@/store/systemSlice'
import { useAppSelector, useAppDispatch } from '@/hooks'

const HomeIndexPage: React.FC = function () {
  const systemInfo = useAppSelector((state) => state.system.info)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getSystemInfo())
  }, [])

  return (
    <div className="home-index oya">
      <PenelGroup />
      <SystemInfo systemInfo={systemInfo} />
      <AmountChart />
    </div>
  )
}

export default HomeIndexPage
