import React from 'react'
import CONFIG from '@/config'
import { MainRoutes } from './routes'
import { BrowserRouter as Router } from 'react-router-dom'

export default function () {
  return (
    <Router basename={CONFIG.baseURL}>
      <MainRoutes />
    </Router>
  )
}
