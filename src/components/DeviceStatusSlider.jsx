import React, { useState, useEffect, useMemo } from "react";
import { useDeviceContext } from "../context/DeviceContext";
import "./styles/DeviceStatusSlider.css";

export default function DeviceStatusSlider({ deviceId }) {
  const { state, updateDeviceStatus, dispatch } = useDeviceContext();

  const currentDevice = useMemo(() => {
    return state.groups
      .flatMap((g) => g.regions)
      .flatMap((r) => r.devices)
      .find((d) => d.id === deviceId);
  }, [state.groups, deviceId]);

  const [pendingStatus, setPendingStatus] = useState(
    Number(currentDevice?.status ?? 0)
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentDevice?.status !== undefined) {
      setPendingStatus(currentDevice.status);
    }
  }, [currentDevice?.status]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    const result = await updateDeviceStatus(dispatch, deviceId, pendingStatus);
    if (result.success) {
      setSuccess(true);
    } else {
      alert(result.message);
    }
    setSaving(false);
  };

  if (!currentDevice) return <div>Loading device...</div>;

  return (
    <div className="device-slider-container">
      <div className="device-slider-label">Current Position</div>

      <div className="device-slider-value">
        {Number.isFinite(pendingStatus) ? pendingStatus.toFixed(2) : "N/A"}
      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={pendingStatus}
        onChange={(e) => setPendingStatus(parseFloat(e.target.value))}
        className="device-slider-range"
      />

      <div className="device-slider-button-container">
        <button
          onClick={handleSave}
          disabled={saving}
          className="device-slider-save-btn"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {success && <div className="device-slider-success">✔ Saved</div>}
      </div>
    </div>
  );
}
