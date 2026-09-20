import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7f5fb]">
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default AppLayout
