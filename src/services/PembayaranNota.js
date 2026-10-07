import API_URL from "./API";

export const bayarCicil = async (notaId, pembayaranData) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/nota-tagihan/${notaId}/pembayaran`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
            {
                status: pembayaranData.status,
                tanggal_bayar: pembayaranData.tanggal_bayar,
                jumlah_bayar: pembayaranData.jumlah_bayar,
            }
        ),
    });

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        throw new Error('Gagal melakukan pembayaran cicilan');
    }

    return await response.json();
}

export const bayarLunas = async (notaId, pembayaranData) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/nota-tagihan/${notaId}/pembayaran`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
            {
                status: pembayaranData.status,
                tanggal_bayar: pembayaranData.tanggal_bayar,
                jumlah_bayar: pembayaranData.jumlah_bayar,
            }
        ),
    });

    if (response.status === 401) {
        throw new Error('Sesi login telah berakhir');
    }

    if (!response.ok) {
        throw new Error('Gagal melakukan pembayaran lunas');
    }

    return await response.json();
}

export const deletePembayaran = async (notaId, pembayaranId) => {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${API_URL}/nota-tagihan/${notaId}/pembayaran/${pembayaranId}`, {
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
        throw new Error('Gagal menghapus pembayaran');
    }

    return await response.json();
};