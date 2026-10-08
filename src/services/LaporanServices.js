import API_URL from "./API";

const getToken = () => {
    return sessionStorage.getItem("token");
};

const fetchLaporan = async (endpoint, errorMessage) => {
    const token = getToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error("Sesi login telah berakhir");
    }

    if (!response.ok) {
        let message = errorMessage;

        try {
            const errorData = await response.json();

            if (errorData?.message) {
                message = errorData.message;
            } else if (errorData?.detail) {
                message = errorData.detail;
            }
        } catch {
            // Gunakan pesan default jika response bukan JSON
        }

        throw new Error(message);
    }

    return await response.json();
};


/**
 * Rekap Tagihan
 * GET /laporan/rekap-tagihan
 */
export const rekapTagihan = async () => {
    return await fetchLaporan(
        "/laporan/rekap-tagihan",
        "Gagal mengambil data rekap tagihan"
    );
};


/**
 * Laba Rugi Keseluruhan
 * GET /laporan/laba-rugi
 */
export const labaRugi = async () => {
    return await fetchLaporan(
        "/laporan/laba-rugi",
        "Gagal mengambil data laporan laba rugi"
    );
};


/**
 * Laba Rugi berdasarkan Customer
 * GET /laporan/laba-rugi?customer_id=1
 */
export const labaRugiCustomer = async (customerId) => {
    if (!customerId) {
        throw new Error("Customer ID wajib diisi");
    }

    const params = new URLSearchParams({
        customer_id: customerId,
    });

    return await fetchLaporan(
        `/laporan/laba-rugi?${params.toString()}`,
        "Gagal mengambil data laporan laba rugi customer"
    );
};


/**
 * Laba Rugi berdasarkan Customer + Periode
 * GET /laporan/laba-rugi?customer_id=1&dari=2026-09-27&sampai=2026-10-02
 */
export const labaRugiCustomerPeriode = async (
    customerId,
    startDate,
    endDate
) => {
    if (!customerId) {
        throw new Error("Customer ID wajib diisi");
    }

    if (!startDate || !endDate) {
        throw new Error("Tanggal mulai dan tanggal akhir wajib diisi");
    }

    const params = new URLSearchParams({
        customer_id: customerId,
        dari: startDate,
        sampai: endDate,
    });

    return await fetchLaporan(
        `/laporan/laba-rugi?${params.toString()}`,
        "Gagal mengambil data laporan laba rugi customer per periode"
    );
};


/**
 * Laba Rugi berdasarkan Periode
 * GET /laporan/laba-rugi?dari=2026-09-27&sampai=2026-10-02
 */
export const labaRugiPeriode = async (startDate, endDate) => {
    if (!startDate || !endDate) {
        throw new Error("Tanggal mulai dan tanggal akhir wajib diisi");
    }

    const params = new URLSearchParams({
        dari: startDate,
        sampai: endDate,
    });

    return await fetchLaporan(
        `/laporan/laba-rugi?${params.toString()}`,
        "Gagal mengambil data laporan laba rugi per periode"
    );
};


/**
 * Detail Laba Rugi
 * GET /laporan/laba-rugi/detail
 */
export const labaRugiDetail = async () => {
    return await fetchLaporan(
        "/laporan/laba-rugi/detail",
        "Gagal mengambil data laporan laba rugi detail"
    );
};