import { useNavigate } from 'react-router-dom'
import SidebarButton from './SidebarButton'
import customerIcon from '../../assets/img/icon/customer_icon.png'
import driverIcon from '../../assets/img/icon/driver_icon.png'
import materialIcon from '../../assets/img/icon/material_icon.png'
import proyekIcon from '../../assets/img/icon/proyek_icon.png'
import suratJalanIcon from '../../assets/img/icon/surat_jalan_icon.png'


const Sidebar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn')
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-56 flex-col bg-[#19002f] text-white">
      <div className="flex h-38 shrink-0 items-center justify-center bg-gradient-to-br from-[#4c00a8] to-[#32006f] px-6">
        <h1 className="text-[25px] text-center font-bold">ADI KARYA UTAMA</h1>
      </div>

      <nav className="flex-1 space-y-4 px-3 py-6">
        <SidebarButton to="/dashboard" end>
          Dashboard
        </SidebarButton>

        <div>
          <p className="px-4 pb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#8d5bc4]">
            Menu
          </p>
          <div className="space-y-3 pl-2">
            <SidebarButton to="/data-customer" icon={customerIcon}>
              Data customer
            </SidebarButton>
            <SidebarButton to="/data-driver" icon={driverIcon}>
              Data driver
            </SidebarButton>
            <SidebarButton to="/data-material" icon={materialIcon}>
              Data material
            </SidebarButton>
            <SidebarButton to="/data-proyek" icon={proyekIcon}>
              Data proyek
            </SidebarButton>
            <SidebarButton to="/not-found" icon={suratJalanIcon}>
              Surat Jalan
            </SidebarButton>
          </div>
        </div>
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