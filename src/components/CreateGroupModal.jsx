import { useState } from "react";
import { useGroupContext } from "../context/GroupContext";
import "./styles/Modal.css";

export default function CreateGroupModal({ onClose }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { createGroup } = useGroupContext();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createGroup({ name, users: [] });
      onClose();
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Create Group</h3>
        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="modal-input"
        />
        <div className="modal-button-row">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
