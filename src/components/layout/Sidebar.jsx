import { useNavigate } from 'react-router-dom'
import SidebarButton from './SidebarButton'

const Sidebar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn')
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-56 flex-col bg-[#19002f] text-white">
      <div className="flex h-38 shrink-0 items-center justify-center bg-gradient-to-br from-[#4c00a8] to-[#32006f] px-6">
        <h1 className="text-[25px] text-center font-bold">Toko Material</h1>
      </div>

      <nav className="flex-1 space-y-3 px-4 py-6">
        <SidebarButton to="/dashboard" icon="" end>Data customer</SidebarButton>
        <SidebarButton to="/data-driver" icon="">Data driver</SidebarButton>
        <SidebarButton to="/data-material" icon="">Data material</SidebarButton>
        <SidebarButton to="/data-proyek" icon="">Data proyek</SidebarButton>
        <SidebarButton to="/surat-jalan" icon="">Surat Jalan</SidebarButton>
      </nav>

      <div className="p-3">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg px-4 py-3 text-left text-sm text-[#c6a2f3] transition hover:bg-[#26004c] hover:text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar