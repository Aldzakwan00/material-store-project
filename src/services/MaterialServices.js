import API_URL from './API'

// =====================================================
// GET ALL MATERIAL
// GET /api/material
// =====================================================
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

// =====================================================
// POST MATERIAL
// POST /api/material
// =====================================================
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
            nama_barang: materialData.nama_barang,
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
        throw new Error(
            data.message || 'Gagal menambahkan material'
        )
    }

    return data
}

// =====================================================
// GET MATERIAL BY CUSTOMER
// GET /api/material?customer_id=1
// =====================================================
export const getMaterialCustomer = async (customerId) => {
    const token = sessionStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/material?customer_id=${customerId}`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir')
    }

    if (!response.ok) {
        throw new Error('Gagal mengambil data material customer')
    }

    return await response.json()
}

// =====================================================
// UPDATE MATERIAL
// PUT /api/material/{id}
// =====================================================
export const updateMaterial = async (materialId, materialData) => {
    const token = sessionStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/material/${materialId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                nama_barang: materialData.nama_barang,
                satuan: materialData.satuan,
                harga_beli: materialData.harga_beli,
                harga_jual: materialData.harga_jual,
                harga_khusus: materialData.harga_khusus,
            }),
        }
    )

    const data = await response.json()

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir')
    }

    if (!response.ok) {
        throw new Error(
            data.message || 'Gagal memperbarui material'
        )
    }

    return data
}

// =====================================================
// DELETE MATERIAL
// DELETE /api/material/{id}
// =====================================================
export const deleteMaterial = async (materialId) => {
    const token = sessionStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/material/${materialId}`,
        {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir')
    }

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || 'Gagal menghapus material'
        )
    }

    return data
}

// =====================================================
// UPDATE HARGA MATERIAL PER CUSTOMER
// POST /api/customer/{customerId}/harga-material
// =====================================================
export const updateMaterialPriceCustomer = async (
    customerId,
    priceData
) => {
    const token = sessionStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/customer/${customerId}/harga-material`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                material_id: priceData.material_id,
                harga_jual: priceData.harga_jual,
            }),
        }
    )

    const data = await response.json()

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir')
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
                'Gagal memperbarui harga material customer'
        )
    }

    return data
}

export const deleteMaterialPriceCustomer = async (
    materialId,
    customerId
) => {
    const token = sessionStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/customer/${customerId}/harga-material/${materialId}`,
        {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir')
    }

    if (!response.ok) {
        throw new Error('Gagal menghapus harga khusus material')
    }

    return true
}