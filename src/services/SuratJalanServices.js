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
                harga_jual: item.harga_jual,
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

        const errorMessage =
            errorData.detail ||
            errorData.message ||
            errorData.error ||
            'Gagal mengupdate surat jalan';

        const error = new Error(errorMessage);
        error.status = response.status;

        throw error;
    }

    return await response.json();
};

export const deleteSuratJalan = async (suratJalanId) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/surat-jalan/${suratJalanId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        const errorMessage =
            errorData.detail ||
            errorData.message ||
            errorData.error ||
            'Gagal menghapus surat jalan';

        const error = new Error(errorMessage);
        error.status = response.status;
        error.detail = errorData.detail || '';
        error.data = errorData;

        throw error;
    }

    // Backend mungkin tidak mengembalikan JSON setelah DELETE.
    // Jadi jangan memaksa response.json().
    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return await response.json();
    }

    return null;
};