import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const navigate = useNavigate() 
  const handleLogout = () => { sessionStorage.removeItem('isLoggedIn') 
    navigate('/login') }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">
          ADHI KARYA UTAMA
        </div>

        {/* Menu */}
        <div className="flex items-center gap-8">

          {/* Home */}
          <a
            href="#"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Dashboard
          </a>

          {/* Products Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 text-gray-700 transition hover:text-blue-600"
            >
              Menu

              <span className="text-xs">
                ▼
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 z-10 mt-3 w-44 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">

                <Link
                  to="/data-customer"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Data Customer
                </Link>

                <Link
                  to="/data-driver"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Data Driver
                </Link>

                <Link
                  to="/data-material"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Data Material
                </Link>

                <Link
                  to="/data-proyek"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Data Proyek
                </Link>

                <Link 
                  to="/surat-jalan"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Input Surat Jalan
                </Link>

              </div>
            )}
          </div>

          {/* About */}
          <Link
            to="/report"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Report
          </Link>

          <button 
            onClick={handleLogout} 
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-red-600" 
            > 
            Logout 
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar