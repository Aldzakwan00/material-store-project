import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import keyPassword from '../../../assets/img/icon/key-password.png'
import warningLogin from '../../../assets/img/icon/warning.png'
import visibilityIcon from '../../../assets/img/icon/visibility.png'
import invisibilityIcon from '../../../assets/img/icon/invisibility.png'
import { changePassword } from '../../../services/AuthServices'

const ChangePassword = () => {
  const navigate = useNavigate()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordLama, setPasswordLama] = useState('')
  const [passwordBaru, setPasswordBaru] = useState('')
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!passwordLama || !passwordBaru || !konfirmasiPassword) {
      setError('Semua password wajib diisi')
      return
    }

    if (passwordBaru !== konfirmasiPassword) {
      setError('Konfirmasi password tidak cocok')
      return
    }

    if (passwordLama === passwordBaru) {
      setError('Password baru tidak boleh sama dengan password lama')
      return
    }

    try {
      setIsLoading(true)

      await changePassword(passwordLama, passwordBaru)

      setSuccess('Password berhasil diubah')

      setPasswordLama('')
      setPasswordBaru('')
      setKonfirmasiPassword('')
    } catch (error) {
      setError(error.message || 'Gagal mengubah password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 font-poppins sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#51448C]">
            Ganti Password
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Ubah password akun Anda untuk menjaga keamanan akun.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Lama */}
            <div>
              <label
                htmlFor="passwordLama"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password Lama
              </label>

              <div className="relative">
                <img
                  src={keyPassword}
                  alt=""
                  className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2"
                />

                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="passwordLama"
                  value={passwordLama}
                  onChange={(e) => setPasswordLama(e.target.value)}
                  placeholder="Masukkan password lama"
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 bg-[#E2E2E2] py-2.5 pl-12 pr-12 outline-none transition focus:border-[#6F00FF] focus:ring-2 focus:ring-[#E4D0FF] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  disabled={isLoading}
                  className="absolute right-5 top-1/2 -translate-y-1/2 disabled:opacity-50"
                >
                  <img
                    src={
                      showCurrentPassword
                        ? invisibilityIcon
                        : visibilityIcon
                    }
                    alt=""
                    className="h-5 w-5"
                  />
                </button>
              </div>
            </div>

            {/* Password Baru */}
            <div>
              <label
                htmlFor="passwordBaru"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password Baru
              </label>

              <div className="relative">
                <img
                  src={keyPassword}
                  alt=""
                  className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2"
                />

                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="passwordBaru"
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  placeholder="Masukkan password baru"
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 bg-[#E2E2E2] py-2.5 pl-12 pr-12 outline-none transition focus:border-[#6F00FF] focus:ring-2 focus:ring-[#E4D0FF] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                  className="absolute right-5 top-1/2 -translate-y-1/2 disabled:opacity-50"
                >
                  <img
                    src={
                      showNewPassword
                        ? invisibilityIcon
                        : visibilityIcon
                    }
                    alt=""
                    className="h-5 w-5"
                  />
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label
                htmlFor="konfirmasiPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Konfirmasi Password Baru
              </label>

              <div className="relative">
                <img
                  src={keyPassword}
                  alt=""
                  className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2"
                />

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="konfirmasiPassword"
                  value={konfirmasiPassword}
                  onChange={(e) =>
                    setKonfirmasiPassword(e.target.value)
                  }
                  placeholder="Masukkan kembali password baru"
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 bg-[#E2E2E2] py-2.5 pl-12 pr-12 outline-none transition focus:border-[#6F00FF] focus:ring-2 focus:ring-[#E4D0FF] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  disabled={isLoading}
                  className="absolute right-5 top-1/2 -translate-y-1/2 disabled:opacity-50"
                >
                  <img
                    src={
                      showConfirmPassword
                        ? invisibilityIcon
                        : visibilityIcon
                    }
                    alt=""
                    className="h-5 w-5"
                  />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center text-sm text-red-500">
                <img
                  src={warningLogin}
                  alt="Warning"
                  className="mr-2 h-3 w-3"
                />

                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Kembali
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-[#6F00FF] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5A00CC] focus:outline-none focus:ring-2 focus:ring-[#E4D0FF] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword