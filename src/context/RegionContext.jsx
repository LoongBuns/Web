import { createContext, useContext, useState } from "react";
import { apiGetRegionById } from "../services/regionApi";

const RegionContext = createContext();
const API_BASE = "https://smart-blinds-ta33o.ondigitalocean.app";

function toBackendTimeArray9(localTimeStr) {
  if (!localTimeStr) return undefined;
  const date = new Date(localTimeStr);
  if (isNaN(date)) return undefined;
  const year = date.getFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const dayOfYear =
    Math.floor(
      (date -
        startOfYear +
        (startOfYear.getTimezoneOffset() - date.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1;

  return [
    year,
    dayOfYear,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds() * 1000,
    0,
    0,
    0,
  ];
}

export const RegionProvider = ({ children }) => {
  const [regionMap, setRegionMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRegionById = async (id) => {
    if (regionMap[id]) return regionMap[id];
    setLoading(true);
    try {
      const data = await apiGetRegionById(id);
      setRegionMap((prev) => ({ ...prev, [id]: data }));
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createRegion = async ({ groupId, name }) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/groups/${groupId}/regions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed");
    }

    const data = await res.json();
    setRegionMap((prev) => ({ ...prev, [data.id]: data }));
    return data;
  };

  const updateRegion = async (regionId, updates) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/regions/${regionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed");
    }

    const updated = await res.json();
    setRegionMap((prev) => ({ ...prev, [regionId]: updated }));
    return updated;
  };

  const createRegionSetting = async (regionId, form) => {
    const token = localStorage.getItem("token");

    const payload = {
      target_id: regionId,
      start_time: toBackendTimeArray9(form.start_time),
      end_time: toBackendTimeArray9(form.end_time),
      data: {
        light_range: form.light_range,
        temperature_range: form.temperature_range,
        humidity_range: form.humidity_range,
      },
    };

    const res = await fetch(`${API_BASE}/api/regions/${regionId}/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    await fetchRegionById(regionId);
    return await res.json();
  };

  const deleteRegion = async (regionId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/regions/${regionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed");
    }

    setRegionMap((prev) => {
      const copy = { ...prev };
      delete copy[regionId];
      return copy;
    });

    return true;
  };

  return (
    <RegionContext.Provider
      value={{
        regionMap,
        fetchRegionById,
        createRegion,
        updateRegion,
        createRegionSetting,
        deleteRegion,
        loading,
        error,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegionContext = () => useContext(RegionContext);
