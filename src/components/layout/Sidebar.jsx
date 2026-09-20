import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn')
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">

      {/* Logo */}
      <div className="border-b border-gray-200 px-6 py-6">
        <h1 className="text-xl font-bold text-blue-600">
          ADHI KARYA UTAMA
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6">

        {/* Dashboard */}
        <Link
          to="/"
          className="mb-2 block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
        >
          Dashboard
        </Link>

        {/* Menu Dropdown */}
        <div className="mb-2">

          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <span>Menu</span>

            <span className={`text-xs transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}>
              ▼
            </span>
          </button>

          {isDropdownOpen && (
            <div className="mt-1 space-y-1 pl-4">

              <Link
                to="/data-customer"
                className="block rounded-lg px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
              >
                Data Customer
              </Link>

              <Link
                to="/data-driver"
                className="block rounded-lg px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
              >
                Data Driver
              </Link>

              <Link
                to="/data-material"
                className="block rounded-lg px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
              >
                Data Material
              </Link>

              <Link
                to="/data-proyek"
                className="block rounded-lg px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
              >
                Data Proyek
              </Link>

              <Link
                to="/surat-jalan"
                className="block rounded-lg px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
              >
                Input Surat Jalan
              </Link>

            </div>
          )}

        </div>

        {/* Report */}
        <Link
          to="/report"
          className="mb-2 block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
        >
          Report
        </Link>

      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4">

        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </aside>
  )
}

export default Sidebar