import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SidebarButton from './SidebarButton'
import customerIcon from '../../assets/img/icon/customer_icon.png'
import driverIcon from '../../assets/img/icon/driver_icon.png'
import materialIcon from '../../assets/img/icon/material_icon.png'
import proyekIcon from '../../assets/img/icon/proyek_icon.png'
import suratJalanIcon from '../../assets/img/icon/surat_jalan_icon.png'
import notaTagihanIcon from '../../assets/img/icon/NotaIcon.png'
import reportIcon from '../../assets/img/icon/ReportIcon.png'

const Sidebar = () => {
  const [openSection, setOpenSection] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const toggleSection = (section) => {
    setOpenSection((currentSection) => (
      currentSection === section ? null : section
    ))
  }

  const handleChangePassword = () => {
    navigate('/change-password')
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-4 top-4 z-40 rounded-lg bg-[#51448C] p-2.5 text-white shadow-md transition hover:bg-[#433878] lg:hidden"
          aria-label="Buka menu"
        >
          <span className="block h-0.5 w-5 bg-white" />
          <span className="my-1.5 block h-0.5 w-5 bg-white" />
          <span className="block h-0.5 w-5 bg-white" />
        </button>
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#51448C] text-white transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute right-4 top-4 text-2xl leading-none text-white lg:hidden"
          aria-label="Tutup menu"
        >
          ×
        </button>

        <div className="flex h-38 shrink-0 items-center justify-center bg-[#51448C] px-6">
          <h1 className="text-center text-[25px] font-bold">
            ADI KARYA UTAMA
          </h1>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto rounded-t-lg bg-[#6E5CC2] px-3 py-6">
          <SidebarButton to="/dashboard" icon={customerIcon} end>
            Dashboard
          </SidebarButton>

          <SidebarSection
            title="Master"
            isOpen={openSection === 'master'}
            onToggle={() => toggleSection('master')}
          >
            <SidebarButton to="/data-material" icon={materialIcon}>
              Data Material
            </SidebarButton>

            <SidebarButton to="/data-driver" icon={driverIcon}>
              Data Driver
            </SidebarButton>

            <SidebarButton to="/data-customer" icon={customerIcon}>
              Data Customer
            </SidebarButton>

            <SidebarButton to="/data-project" icon={proyekIcon}>
              Data Proyek
            </SidebarButton>
          </SidebarSection>

          <SidebarSection
            title="Transaksi"
            isOpen={openSection === 'transaksi'}
            onToggle={() => toggleSection('transaksi')}
          >
            <SidebarButton to="/surat-jalan" icon={suratJalanIcon}>
              Input Surat Jalan
            </SidebarButton>

            <SidebarButton to="/nota-tagihan" icon={notaTagihanIcon}>
              Nota Tagihan
            </SidebarButton>

          </SidebarSection>

          <SidebarSection
            title="Laporan"
            isOpen={openSection === 'laporan'}
            onToggle={() => toggleSection('laporan')}
          >
            <SidebarButton to="/laporan-nota-tagihan" icon={reportIcon}>
              Laporan
            </SidebarButton>
          </SidebarSection>
        </nav>

        {/* Account Menu */}
        <div className="shrink-0 bg-[#6E5CC2] px-3 pb-4 pt-3">
          <div className="mb-2 border-t border-white/20 pt-2">
            <button
              type="button"
              onClick={handleChangePassword}
              className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-colors group-hover:bg-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V7a4.5 4.5 0 0 0-9 0v3.5"
                  />
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />
                  <path
                    strokeLinecap="round"
                    d="M12 14v2"
                  />
                </svg>
              </span>

              <span>Ganti Password</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-white/90 transition-all duration-200 hover:bg-red-500/15 hover:text-red-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-colors group-hover:bg-red-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H9"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 8l4 4-4 4"
                  />
                  <path
                    strokeLinecap="round"
                    d="M17 12H9"
                  />
                </svg>
              </span>

              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

const SidebarSection = ({ title, isOpen, onToggle, children }) => {
  return (
    <section>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center justify-between border-b border-white/90 px-4 py-3 text-left text-base text-white transition-colors hover:text-white"
      >
        <span>{title}</span>

        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 border-b-2 border-r-2 border-current transition-transform ${
            isOpen ? 'rotate-45' : '-rotate-45'
          }`}
        />
      </button>

      {isOpen && (
        <div className="space-y-2 py-3 pl-2">
          {children}
        </div>
      )}
    </section>
  )
}

export default Sidebar
