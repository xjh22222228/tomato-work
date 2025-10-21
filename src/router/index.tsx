import React from 'react'
import CONFIG from '@/config'
import { MainRoutes } from './routes'
import { BrowserRouter as Router } from 'react-router'

export default function () {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? (
    <Router basename={CONFIG.baseURL}>
      <MainRoutes />
    </Router>
  ) : null
}
