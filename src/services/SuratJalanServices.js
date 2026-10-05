import API_URL from "./API";

export const getSuratJalanAll = async () => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/surat-jalan`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        throw new Error('Gagal mengambil data surat jalan');
    }

    return await response.json();
};

export const getSuratJalan = async () => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/surat-jalan/items`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }   

    if (!response.ok) {
        throw new Error('Gagal mengambil data surat jalan');
    }

    return await response.json();
};

export const createSuratJalan = async (suratJalanData) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/surat-jalan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            no_surat_jalan: suratJalanData.no_surat_jalan,
            tanggal: suratJalanData.tanggal,
            driver_id: suratJalanData.driver_id,
            customer_id: suratJalanData.customer_id,
            proyek_id: suratJalanData.proyek_id,

            items: suratJalanData.items.map((item) => ({
                material_id: item.material_id,
                qty: item.qty,
            })),
        }),
    });

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
            errorData.message || 'Gagal membuat surat jalan'
        );
    }

    return await response.json();
};

export const updateSuratJalan = async (suratJalanId, suratJalanData) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/surat-jalan/${suratJalanId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(suratJalanData),
    });

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || 'Gagal mengupdate surat jalan'
        );
    }

    return await response.json();
};

export const deleteSuratJalan = async (suratJalanId) => {
    const token = sessionStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/surat-jalan/${suratJalanId}`,
        {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    )

    // DELETE berhasil
    if (response.ok) {
        return true
    }

    // Kalau gagal, coba ambil pesan dari response
    let message = 'Surat jalan gagal dihapus.'

    try {
        const data = await response.json()

        message =
            data?.message ||
            data?.detail ||
            data?.error ||
            message
    } catch {
        // Response bukan JSON, gunakan pesan default
    }

    throw new Error(message)
}
