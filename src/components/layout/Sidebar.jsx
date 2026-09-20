import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SidebarButton from './SidebarButton'
import customerIcon from '../../assets/img/icon/customer_icon.png'
import driverIcon from '../../assets/img/icon/driver_icon.png'
import materialIcon from '../../assets/img/icon/material_icon.png'
import proyekIcon from '../../assets/img/icon/proyek_icon.png'
import suratJalanIcon from '../../assets/img/icon/surat_jalan_icon.png'


const Sidebar = () => {
  const [openSection, setOpenSection] = useState(null)
  const navigate = useNavigate()

  const toggleSection = (section) => {
    setOpenSection((currentSection) => (
      currentSection === section ? null : section
    ))
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn')
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-56 flex-col bg-[#6E5CC2] text-white">
      <div className="flex h-38 shrink-0 items-center justify-center bg-gradient-to-br from-[#4c00a8] to-[#32006f] px-6">
        <h1 className="text-[25px] text-center font-bold">ADI KARYA UTAMA</h1>
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto px-3 py-6">
        <SidebarButton to="/dashboard" icon={customerIcon} end>
          Dashboard
        </SidebarButton>

        <SidebarSection
          title="Master"
          isOpen={openSection === 'master'}
          onToggle={() => toggleSection('master')}
        >
          <SidebarButton to="/data-material" icon={materialIcon}>Data Material</SidebarButton>
          <SidebarButton to="/data-driver" icon={driverIcon}>Data Driver</SidebarButton>
          <SidebarButton to="/data-customer" icon={customerIcon}>Data Customer</SidebarButton>
        </SidebarSection>

        <SidebarSection
          title="Transaksi"
          isOpen={openSection === 'transaksi'}
          onToggle={() => toggleSection('transaksi')}
        >
          <SidebarButton to="/data-proyek" icon={proyekIcon}>Data Proyek</SidebarButton>
          <SidebarButton to="/surat-jalan" icon={suratJalanIcon}>Input Surat Jalan</SidebarButton>
          <SidebarButton to="/nota-tagihan">Nota Tagihan</SidebarButton>
          <SidebarButton to="/pembayaran-nota">Pembayaran Nota</SidebarButton>
        </SidebarSection>

        <SidebarSection
          title="Laporan"
          isOpen={openSection === 'laporan'}
          onToggle={() => toggleSection('laporan')}
        >
          <SidebarButton to="/laporan-nota-tagihan">Laporan Nota Tagihan</SidebarButton>
        </SidebarSection>
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

const SidebarSection = ({ title, isOpen, onToggle, children }) => {
  return (
    <section>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center justify-between border-b border-[#9b7bd1]/60 px-4 py-3 text-left text-base text-[#f0e7ff] transition-colors hover:text-white"
      >
        <span>{title}</span>
        <span className={`text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {isOpen && <div className="space-y-2 py-3 pl-2">{children}</div>}
    </section>
  )
}

export default Sidebar