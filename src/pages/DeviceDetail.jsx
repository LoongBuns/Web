import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDeviceContext } from "../context/DeviceContext";

import DeviceStatusSlider from "../components/DeviceStatusSlider";
import DeviceInfoCard from "../components/DeviceInfoCard";
import DeviceSettingGantt from "../components/DeviceSettingGantt";
import DeviceSettingForm from "../components/DeviceSettingForm";
import "../styles/DeviceDetail.css";

export default function DeviceDetail() {
  const { id } = useParams();
  const deviceId = parseInt(id, 10);
  const {
    currentDevice: device,
    fetchDeviceById,
    deviceLoading: loading,
    deviceError: error,
  } = useDeviceContext();

  useEffect(() => {
    if (!device || device.id !== deviceId) {
      fetchDeviceById(deviceId);
    }
  }, [deviceId, device, fetchDeviceById]);

  if (loading) return <p className="device-loading">Loading device...</p>;
  if (error) return <p className="device-error">{error}</p>;
  if (!device) return <p className="device-notfound">Device not found</p>;

  return (
    <div className="device-detail-container">
      <div className="device-top-section">
        <div className="device-slider">
          <DeviceStatusSlider
            deviceId={device.id}
            initialStatus={device.status?.value ?? device.status}
          />
        </div>
        <div className="device-info">
          <DeviceInfoCard device={device} />
        </div>
      </div>

      <div className="device-settings-title">Settings</div>

      <div className="device-settings-section">
        <div className="device-settings-chart">
          <DeviceSettingGantt settings={device.settings} />
        </div>
        <div className="device-settings-form">
          <DeviceSettingForm deviceId={device.id} />
        </div>
      </div>
    </div>
  );
}
