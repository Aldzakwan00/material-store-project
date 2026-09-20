import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userIcon from '../../../assets/img/icon/username.png'
import keyPassword from '../../../assets/img/icon/key-password.png'
import warningLogin from '../../../assets/img/icon/warning.png'
import visibilityIcon from '../../../assets/img/icon/visibility.png'
import invisibilityIcon from '../../../assets/img/icon/invisibility.png'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()

    const dummyEmail = 'admin'
    const dummyPassword = '123456'

    if (!username && !password) {
      setError('Username dan password wajib diisi')
    } else if (!username) {
      setError('Username wajib diisi')
    } else if (!password) {
      setError('Password wajib diisi')
    } else if (username !== dummyEmail) {
      setError('Username salah')
    } else if (password !== dummyPassword) {
      setError('Password salah')
    } else {
      sessionStorage.setItem('isLoggedIn', 'true')
      navigate('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E4D0FF] px-4 font-poppins">
      <div className="w-full max-w-96 rounded-lg bg-white p-6 shadow-md sm:p-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[#6F00FF]">
            Selamat datang kembali!
          </h1>

          <p className="mt-1 text-xs text-black">
            Silahkan  masukkan username dan password          
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username
            </label>

            <div className="relative">
              <img
                src={userIcon}
                alt=""
                className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2"
              />

              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-[#E2E2E2]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              {/* Icon password kiri */}
              <img
                src={keyPassword}
                alt=""
                className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2"
              />

              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full rounded-lg border border-gray-300 bg-[#E2E2E2] py-2.5 pl-12 pr-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {/* Icon mata kanan */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2"
              >
                <img
                  src={showPassword ? invisibilityIcon : visibilityIcon}
                  alt={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="h-5 w-5"
                />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center text-sm text-red-500">
              <img src={warningLogin} alt="Warning" className="mr-2 h-3 w-3" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-[#6F00FF] py-2.5 font-medium text-white transition hover:bg-[#5A00CC] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  )
}

export default Login
