import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/Approutes'
import RouteLoading from './routes/RouteLoading'

const App = () => {
  return (
    <BrowserRouter>
      <RouteLoading />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App