import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { apiGet } from "../services/groupApi";

const DeviceContext = createContext();

const initialState = {
  groups: [],
  loading: true,
  error: null,
  selectedGroupId: null,
  selectedRegionId: null,
  selectedDeviceId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_GROUP_TREE":
      return { ...state, groups: action.payload, loading: false, error: null };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SELECT_GROUP":
      return { ...state, selectedGroupId: action.payload };
    case "SELECT_REGION":
      return { ...state, selectedRegionId: action.payload };
    case "SELECT_DEVICE":
      return { ...state, selectedDeviceId: action.payload };
    case "UPDATE_DEVICE_STATUS": {
      const { deviceId, status } = action.payload;
      return {
        ...state,
        groups: state.groups.map((group) => ({
          ...group,
          regions: group.regions.map((region) => ({
            ...region,
            devices: region.devices.map((device) =>
              device.id === deviceId ? { ...device, status } : device
            ),
          })),
        })),
      };
    }
    case "ADD_DEVICE": {
      const { regionId, device } = action.payload;
      return {
        ...state,
        groups: state.groups.map((group) => ({
          ...group,
          regions: group.regions.map((region) =>
            region.id === regionId
              ? { ...region, devices: [...region.devices, device] }
              : region
          ),
        })),
      };
    }
    default:
      return state;
  }
}

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

async function updateDeviceStatus(dispatch, deviceId, value) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://smart-blinds-ta33o.ondigitalocean.app/api/devices/${deviceId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ position: value }),
      }
    );

    if (!res.ok) throw new Error(await res.text());
    dispatch({
      type: "UPDATE_DEVICE_STATUS",
      payload: { deviceId, status: value },
    });
    return { success: true };
  } catch (err) {
    return { success: false, message: "❌ Failed: " + err.message };
  }
}

const submitDeviceSetting = async (_, deviceId, formData) => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      target_id: deviceId,
      start_time: toBackendTimeArray9(formData.start_time),
      end_time: toBackendTimeArray9(formData.end_time),
      data: {
        position_range: formData.position_range,
        auto_adjust: formData.auto_adjust,
      },
    };

    const res = await fetch(
      `https://smart-blinds-ta33o.ondigitalocean.app/api/devices/${deviceId}/settings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) throw new Error(await res.text());
    return { success: true, message: "✅ Setting created successfully" };
  } catch (err) {
    return { success: false, message: "❌ Failed: " + err.message };
  }
};

const createDevice = async (
  dispatch,
  { name, location, device_type, region_id }
) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `https://smart-blinds-ta33o.ondigitalocean.app/api/regions/${region_id}/devices`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, location, device_type, region_id }),
    }
  );

  if (!res.ok) throw new Error(await res.text());
  const newDevice = await res.json();
  dispatch({
    type: "ADD_DEVICE",
    payload: { regionId: region_id, device: newDevice },
  });
  return newDevice;
};

const updateDevice = async (
  { id, name, location, device_type },
  fetchGroupTree,
  setCurrentDevice
) => {
  const token = localStorage.getItem("token");

  const payload = { name, location, device_type };
  console.log("📦 Sending device update:", JSON.stringify(payload, null, 2));

  const res = await fetch(
    `https://smart-blinds-ta33o.ondigitalocean.app/api/devices/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error(await res.text());

  const updated = await res.json();
  setCurrentDevice(updated);

  await fetchGroupTree();
};

const deleteDevice = async (deviceId, fetchGroupTree) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `https://smart-blinds-ta33o.ondigitalocean.app/api/devices/${deviceId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error(await res.text());
  await fetchGroupTree();
};

export function DeviceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [deviceError, setDeviceError] = useState(null);

  const fetchGroupTree = async () => {
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const groups = await apiGet("/api/groups");
      const groupTree = await Promise.all(
        groups.map(async (group) => {
          const regionsWithDevices = await Promise.all(
            group.regions.map(async (region) => {
              const devices = await apiGet(`/api/regions/${region.id}/devices`);
              const mappedDevices = devices.map((device) => {
                let numericStatus = 0;
                if (typeof device.status === "number") {
                  numericStatus = device.status;
                } else if (
                  typeof device.status === "object" &&
                  device.status !== null &&
                  "position" in device.status
                ) {
                  numericStatus = Number(device.status.position ?? 0);
                } else if (typeof device.status === "string") {
                  numericStatus = Number(device.status);
                }
                return { ...device, status: numericStatus };
              });
              return { ...region, devices: mappedDevices };
            })
          );
          return { ...group, regions: regionsWithDevices };
        })
      );
      dispatch({ type: "SET_GROUP_TREE", payload: groupTree });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  };

  useEffect(() => {
    fetchGroupTree();
  }, []);

  const fetchDeviceById = async (id) => {
    setDeviceLoading(true);
    setDeviceError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://smart-blinds-ta33o.ondigitalocean.app/api/devices/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCurrentDevice(data);
    } catch (err) {
      setDeviceError(err.message);
    } finally {
      setDeviceLoading(false);
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        state,
        dispatch,
        updateDeviceStatus,
        currentDevice,
        fetchDeviceById,
        deviceLoading,
        deviceError,
        fetchGroupTree,
        submitDeviceSetting,
        createDevice: (args) => createDevice(dispatch, args),
        deleteDevice: (id) => deleteDevice(id, fetchGroupTree),
        updateDevice: (args) =>
          updateDevice(args, fetchGroupTree, setCurrentDevice),
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDeviceContext() {
  return useContext(DeviceContext);
}
