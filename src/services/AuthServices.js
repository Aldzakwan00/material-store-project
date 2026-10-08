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

  let data = {}

  try {
    data = await response.json()
  } catch {
    data = {}
  }

  // Password lama salah
  if (response.status === 401) {
    throw new Error(
      data.message || data.detail || 'Password lama salah'
    )
  }

  // Validation error dari backend
  if (response.status === 422) {
    let message = 'Data password tidak valid'

    if (data.detail) {
      if (Array.isArray(data.detail)) {
        message = data.detail
          .map((item) => item.msg || item.message)
          .filter(Boolean)
          .join(', ')
      } else if (typeof data.detail === 'string') {
        message = data.detail
      }
    }

    if (data.message) {
      message = data.message
    }

    throw new Error(message)
  }

  // Error lainnya
  if (!response.ok) {
    throw new Error(
      data.message ||
        data.detail ||
        'Gagal mengubah password'
    )
  }

  return data
}
