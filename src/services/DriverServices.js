import API_URL from "./API";

export const getDriver = async () => {
  const token = sessionStorage.getItem("token");

    const response = await fetch(`${API_URL}/driver`, {
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
        throw new Error("Gagal mengambil data driver");
    } 

    return await response.json();
};