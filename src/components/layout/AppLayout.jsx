import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const AppLayout = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#f7f5fb]">
      <Sidebar />
      <div key={location.pathname} className="page-transition">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
