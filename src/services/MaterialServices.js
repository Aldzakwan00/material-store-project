import API_URL from './API'

export const getMaterial = async () => {
  const token = sessionStorage.getItem('token')

    const response = await fetch(`${API_URL}/material`, {
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
        throw new Error('Gagal mengambil data material')
    }

    return await response.json()
}

// POST MATERIAL
export const createMaterial = async (materialData) => {
  const token = sessionStorage.getItem('token')

    const response = await fetch(`${API_URL}/material`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            nama_barang: materialData.nam_barang,
            satuan: materialData.satuan,
            harga_beli: materialData.harga_beli,
            harga_jual: materialData.harga_jual,
            harga_khusus: materialData.harga_khusus,
        }),

    })

    const data = await response.json()

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir')
    }

    if (!response.ok) {
        throw new Error(data.message || 'Gagal menambahkan material')
    }
    return data
}