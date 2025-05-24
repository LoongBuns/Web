import { useState } from "react";
import { useRegionContext } from "../context/RegionContext";
import { useDeviceContext } from "../context/DeviceContext";
import { useGroupContext } from "../context/GroupContext";
import "./styles/Modal.css";

export default function CreateRegionDeviceModal({ onClose }) {
  const { createRegion } = useRegionContext();
  const { createDevice } = useDeviceContext();
  const { groups } = useGroupContext();

  const [step, setStep] = useState(1);
  const [regionName, setRegionName] = useState("");
  const [groupId, setGroupId] = useState(null);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("window");
  const [location, setLocation] = useState("");
  const [regionId, setRegionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateRegion = async () => {
    if (!groupId || !regionName)
      return alert("Please select a Group and enter a Region name.");
    setLoading(true);
    try {
      const region = await createRegion({ groupId, name: regionName });
      setRegionId(region.id);
      setStep(2);
    } catch (e) {
      alert("Failed to create Region: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDevice = async () => {
    if (!deviceName || !location || !regionId) return;
    setLoading(true);
    try {
      await createDevice({
        name: deviceName,
        location,
        device_type: deviceType,
        region_id: regionId,
      });
      onClose();
    } catch (e) {
      alert("Failed to create Device: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {step === 1 && (
          <>
            <h3 className="modal-section-title">Create Region</h3>
            <select
              value={groupId || ""}
              onChange={(e) => setGroupId(Number(e.target.value))}
              className="modal-input"
            >
              <option value="">Select Group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Region Name"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              className="modal-input"
            />
            <div className="modal-button-row">
              <button onClick={handleCreateRegion} disabled={loading}>
                {loading ? "Creating..." : "Next"}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="modal-section-title">Create Device</h3>
            <input
              type="text"
              placeholder="Device Name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="modal-input"
            />
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="modal-input"
            >
              <option value="window">Window</option>
              <option value="sensor">Sensor</option>
            </select>
            <div className="modal-button-row">
              <button onClick={handleCreateDevice} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}

        <div className="modal-button-row" style={{ marginTop: "12px" }}>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
