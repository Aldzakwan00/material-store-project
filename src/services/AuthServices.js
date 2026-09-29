import API_URL from './API'

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })

  const data = await response.json()

  if (response.status === 401) {
    throw new Error('Username atau password salah')
  }

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan saat login')
  }

  return data
}

export const changePassword = async (passwordLama, passwordBaru) => {
  const token = sessionStorage.getItem('token')

  const response = await fetch(`${API_URL}/auth/ganti-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      password_lama: passwordLama,
      password_baru: passwordBaru,
    }),
  })

  const data = await response.json()

  if (response.status === 401) {
    throw new Error('Password lama salah')
  }

  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengubah password')
  }

  return data
}