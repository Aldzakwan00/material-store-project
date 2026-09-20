import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()

    const dummyEmail = 'admin'
    const dummyPassword = '123456'

    if (username === dummyEmail && password === dummyPassword) {
      sessionStorage.setItem('isLoggedIn', 'true')

      navigate('/dashboard')
    } else {
      setError('Username atau password salah')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E4D0FF] font-poppins">
      <div className="rounded-lg bg-white shadow-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#6F00FF]">
            Selamat datang kembali!
          </h1>

          <p className="mt-2 text-sm text-gray-500">
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

            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername (e.target.value)}
              placeholder="Masukkan username"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  )
}

export default Login
