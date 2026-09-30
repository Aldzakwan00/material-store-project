import API_URL from './API'

const getToken = () => {
  return sessionStorage.getItem('token')
}

const handleResponse = async (response, defaultMessage) => {
  let result = null

  try {
    result = await response.json()
  } catch {
    result = null
  }

  if (response.status === 401) {
    const error = new Error('Sesi login telah berakhir')
    error.status = response.status
    throw error
  }

  if (!response.ok) {
    let errorMessage =
      result?.message ||
      result?.error

    if (!errorMessage && result?.errors) {
      errorMessage = Object.values(result.errors)
        .flat()
        .join('\n')
    }

    const error = new Error(
      errorMessage || defaultMessage
    )

    error.status = response.status

    throw error
  }

  return result
}

// =========================
// GET PROJECT
// =========================
export const getProject = async () => {
  const token = getToken()

  const response = await fetch(`${API_URL}/proyek`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return await handleResponse(
    response,
    'Gagal mengambil data proyek'
  )
}

// =========================
// CREATE PROJECT
// =========================
export const createProject = async (projectData) => {
  const token = getToken()

  const response = await fetch(`${API_URL}/proyek`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customer_id: projectData.customer_id,
      nama_pelanggan: projectData.nama_pelanggan,
      nama_proyek: projectData.nama_proyek,
      kota: projectData.kota,
      alamat_kirim: projectData.alamat_kirim,
      contact_person: projectData.contact_person,
      proyek_telp: projectData.proyek_telp,
    }),
  })

  return await handleResponse(
    response,
    'Gagal membuat proyek'
  )
}

// =========================
// UPDATE PROJECT
// =========================
export const updateProject = async (
  projectId,
  projectData
) => {
  const token = getToken()

  const response = await fetch(
    `${API_URL}/proyek/${projectId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer_id: projectData.customer_id,
        nama_pelanggan: projectData.nama_pelanggan,
        nama_proyek: projectData.nama_proyek,
        kota: projectData.kota,
        alamat_kirim: projectData.alamat_kirim,
        contact_person: projectData.contact_person,
        proyek_telp: projectData.proyek_telp,
      }),
    }
  )

  return await handleResponse(
    response,
    'Gagal memperbarui data proyek'
  )
}

// =========================
// DELETE PROJECT
// =========================
export const deleteProject = async (projectId) => {
  const token = getToken()

  const response = await fetch(
    `${API_URL}/proyek/${projectId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return await handleResponse(
    response,
    'Gagal menghapus data proyek'
  )
}