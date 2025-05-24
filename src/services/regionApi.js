const BASE_URL = "https://smart-blinds-ta33o.ondigitalocean.app";

export async function apiGetRegionById(regionId) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not logged in");

  const res = await fetch(`${BASE_URL}/api/regions/${regionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to fetch region");
  }

  return await res.json();
}
