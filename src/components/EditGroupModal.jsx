import { useState } from "react";
import { useGroupContext } from "../context/GroupContext";
import "./styles/EditGroupModal.css";

export default function EditGroupModal({ target, onClose }) {
  const { updateGroup } = useGroupContext();
  const [form, setForm] = useState({
    name: target.name || "",
    description: target.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const users = target.users
        ? Object.keys(target.users).map((id) => Number(id))
        : [];
      await updateGroup(target.id, {
        ...form,
        users,
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
        <h2>Edit Group</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
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
