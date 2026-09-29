import API_URL from './API'

export const getCustomers = async () => {
  const token = sessionStorage.getItem('token')

  const response = await fetch(`${API_URL}/customer`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 401) {
    throw new Error('Sesi login telah berakhir')
  }

  if (!response.ok) {
    throw new Error('Gagal mengambil data customer')
  }

  return await response.json()
}

export const createCustomer = async (customerData) => {
  const token = sessionStorage.getItem('token')

  const response = await fetch(`${API_URL}/customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nama_customer: customerData.nama_customer,
      no_npwp: customerData.no_npwp,
      alamat: customerData.alamat,
    }),
  })

  const data = await response.json()

  if (response.status === 401) {
    throw new Error('Sesi login telah berakhir')
  }

  if (!response.ok) {
    throw new Error(data.message || 'Gagal menambahkan customer')
  }

  return data
}

export const updateCustomer = async (customerId, customerData) => {
  const token = sessionStorage.getItem('token')

  const response = await fetch(`${API_URL}/customer/${customerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: customerData.id,
      kode: customerData.kode,
      nama_customer: customerData.nama_customer,
      no_npwp: customerData.no_npwp,
      alamat: customerData.alamat,
    }),
  })

  const data = await response.json()

  if (response.status === 401) {
    throw new Error('Sesi login telah berakhir')
  }

  if (!response.ok) {
    throw new Error(data.message || 'Gagal memperbarui customer')
  }

  return data
}

export const deleteCustomer = async (customerId) => {
  const token = sessionStorage.getItem('token')

  const response = await fetch(`${API_URL}/customer/${customerId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 401) {
    throw new Error('Sesi login telah berakhir')
  }

  if (!response.ok) {
    let data = {}

    try {
      data = await response.json()
    } catch {
      data = {}
    }

    throw new Error(data.message || 'Gagal menghapus customer')
  }

  return true
}
