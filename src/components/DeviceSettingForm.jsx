import React, { useState } from "react";
import { useDeviceContext } from "../context/DeviceContext";
import "./styles/DeviceSettingForm.css";

const defaultForm = {
  start_time: "",
  end_time: "",
  position_range: [0, 100],
  auto_adjust: false,
};

export default function DeviceSettingForm({ deviceId }) {
  const { submitDeviceSetting } = useDeviceContext();
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (name.startsWith("position_range")) {
      const index = name.endsWith("0") ? 0 : 1;
      const updated = [...form.position_range];
      updated[index] = Number(value);
      setForm({ ...form, position_range: updated });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
      };
      const result = await submitDeviceSetting(null, deviceId, payload);
      setMessage(result.message);
      setForm(defaultForm);
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h4>Create Device Setting</h4>
      <form onSubmit={handleSubmit} className="setting-form">
        <label htmlFor="start_time">Start Time:</label>
        <input
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
        />

        <label htmlFor="end_time">End Time:</label>
        <input
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
        />

        <label className="block-label">Position Range (%):</label>
        <div className="position-range-row">
          <input
            type="number"
            name="position_range0"
            value={form.position_range[0]}
            onChange={handleChange}
            min="0"
            max="100"
            placeholder="Min"
          />
          <span className="range-separator">to</span>
          <input
            type="number"
            name="position_range1"
            value={form.position_range[1]}
            onChange={handleChange}
            min="0"
            max="100"
            placeholder="Max"
          />
        </div>

        <label className="checkbox-label">
          Auto Adjust:
          <input
            type="checkbox"
            name="auto_adjust"
            checked={form.auto_adjust}
            onChange={handleChange}
          />
        </label>

        <div className="button-row">
          <button className="btn-cyan" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Submit"}
          </button>
          <button
            className="btn-cyan"
            type="reset"
            onClick={() => setForm(defaultForm)}
          >
            Reset
          </button>
        </div>

        {message && (
          <div
            className={`form-message ${
              message.startsWith("✅") || message.startsWith("Success")
                ? "success"
                : "error"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
