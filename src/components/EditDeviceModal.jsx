import { useState } from "react";
import { useDeviceContext } from "../context/DeviceContext";
import "./styles/EditDeviceModal.css";

export default function EditDeviceModal({ target, onClose }) {
  const { updateDevice } = useDeviceContext();
  const [name, setName] = useState(target.name);
  const [location, setLocation] = useState(target.location || "");
  const [deviceType, setDeviceType] = useState(target.device_type || "window");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDevice({
        id: target.id,
        name,
        location,
        device_type: deviceType,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Edit Device</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="modal-form-group">
            <label>Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="modal-form-group">
            <label>Device Type</label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              required
            >
              <option value="window">Window</option>
              <option value="sensor">Sensor</option>
            </select>
          </div>
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
