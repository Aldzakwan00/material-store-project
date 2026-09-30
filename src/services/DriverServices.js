import API_URL from "./API";

const getToken = () => {
  return sessionStorage.getItem("token");
};

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

// GET DRIVER
export const getDriver = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/driver`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (response.status === 401) {
    throw new Error("Sesi login telah berakhir");
  }

  if (!response.ok) {
    throw new Error(
      result?.message ||
      result?.error ||
      "Gagal mengambil data driver"
    );
  }

  return result;
};

// CREATE DRIVER
export const createDriver = async (driverData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/driver`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nama_supir: driverData.nama_supir,
      no_plat_mobil: driverData.no_plat_mobil,
      alamat: driverData.alamat,
      jumlah_pengantaran: driverData.jumlah_pengantaran,
    }),
  });

  return await handleResponse(
    response,
    "Gagal membuat driver baru"
  );
};

// UPDATE DRIVER
export const updateDriver = async (driverId, driverData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/driver/${driverId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nama_supir: driverData.nama_supir,
      no_plat_mobil: driverData.no_plat_mobil,
      alamat: driverData.alamat,
      jumlah_pengantaran: driverData.jumlah_pengantaran,
    }),
  });

  return await handleResponse(
    response,
    "Gagal memperbarui data driver"
  );
};

// DELETE DRIVER
export const deleteDriver = async (driverId) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/driver/${driverId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await handleResponse(
    response,
    "Gagal menghapus data driver"
  );
};