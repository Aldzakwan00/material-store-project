import API_URL from "./API";

export const getNotaTagihan = async () => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/nota-tagihan`, {
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
        throw new Error('Gagal mengambil data nota tagihan');
    }
    return await response.json();
}

export const getSuratJalanDariSampai = async (customer_id, driver_id, dari, sampai) => {
    const token = sessionStorage.getItem('token');  

    const response = await fetch(
        `${API_URL}/nota-tagihan/kandidat?customer_id=${customer_id}&driver_id=${driver_id}&dari=${dari}&sampai=${sampai}`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        throw new Error('Gagal mengambil data surat jalan');
    }

    return await response.json();
};

export const createNotaTagihanAll = async (notaData) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/nota-tagihan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }, 
        body: JSON.stringify({
            customer_id: notaData.customer_id,
            tanggal_kirim_dari: notaData.tanggal_kirim_dari,
            tanggal_kirim_sampai: notaData.tanggal_kirim_sampai,
        }),
    });

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        throw new Error('Gagal membuat nota tagihan');
    }

    return await response.json();
};

export const createNotaTagihanChecked = async (notaData) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/nota-tagihan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            customer_id: notaData.customer_id,
            tanggal_kirim_dari: notaData.tanggal_kirim_dari,
            tanggal_kirim_sampai: notaData.tanggal_kirim_sampai,
            item_ids: notaData.item_ids,
        }),
    });

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        let message = 'Gagal membuat nota tagihan';

        try {
            const errorData = await response.json();
            message = errorData.message || errorData.error || message;
        } catch {
            // Response bukan JSON
        }

        throw new Error(message);
    }

    return await response.json();
};

export const updateNotaTagihanCicil = async (notaId, notaData) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/nota-tagihan/${notaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notaData),
    });
    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }
    
    if (!response.ok) {
        throw new Error('Gagal memperbarui nota tagihan');
    }

    return await response.json();
};

export const updateNotaTagihanLunas = async (notaId, notaData) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/nota-tagihan/${notaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notaData),
    });
    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        throw new Error('Gagal memperbarui nota tagihan');
    }

    return await response.json();

};

export const deleteNotaTagihan = async (notaId) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/nota-tagihan/${notaId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        let errorMessage = 'Gagal menghapus nota tagihan';

        try {
            const errorData = await response.json();

            errorMessage =
                errorData?.message ||
                errorData?.detail ||
                errorMessage;
        } catch {
            // Response bukan JSON, gunakan pesan default
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return {
            message: 'Nota tagihan berhasil dihapus.',
        };
    }

    const text = await response.text();

    if (!text) {
        return {
            message: 'Nota tagihan berhasil dihapus.',
        };
    }

    try {
        return JSON.parse(text);
    } catch {
        return {
            message: text || 'Nota tagihan berhasil dihapus.',
        };
    }
};

export const pratinjauNotaTagihan = async (notaId) => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        throw new Error('Token login tidak ditemukan');
    }

    const response = await fetch(
        `${API_URL}/nota-tagihan/${notaId}/pratinjau-cetak`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json, text/plain, */*',
                Authorization: `Bearer ${token}`,
            },
        }
    );

    // Token / session expired
    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    // Ambil response sebagai text terlebih dahulu
    const text = await response.text();

    if (!response.ok) {
        let message = 'Gagal mengambil pratinjau nota tagihan';

        try {
            const errorData = JSON.parse(text);
            message =
                errorData.message ||
                errorData.error ||
                message;
        } catch {
            if (text) {
                message = text;
            }
        }

        throw new Error(message);
    }

    if (!text) {
        throw new Error('Response pratinjau nota tagihan kosong');
    }

    // Coba parse sebagai JSON
    try {
        return JSON.parse(text);
    } catch {
        // Kalau bukan JSON, kembalikan sebagai text
        return text;
    }
};

export const printUlangNotaTagihan = async (notaId) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/nota-tagihan/${notaId}/cetak`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        throw new Error('Gagal melakukan print ulang nota tagihan');
    }

    return await response.json();
}

export const getNotaTagihanById = async (notaId) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/nota-tagihan/${notaId}`, {
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
        throw new Error('Gagal mengambil data nota tagihan');
    }
    return await response.json();
};