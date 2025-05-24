import { useState } from "react";
import { useRegionContext } from "../context/RegionContext";
import { useDeviceContext } from "../context/DeviceContext";
import "./styles/EditRegionModal.css";

export default function EditRegionModal({ target, onClose }) {
  const { updateRegion } = useRegionContext();
  const { fetchGroupTree } = useDeviceContext();
  const [name, setName] = useState(target.name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateRegion(target.id, { name });
      await fetchGroupTree();
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
        <h2>Edit Region</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-button-row">
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
