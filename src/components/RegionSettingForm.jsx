import React, { useState } from "react";
import { useRegionContext } from "../context/RegionContext";
import "./styles/RegionSettingForm.css";

const defaultForm = {
  start_time: "",
  end_time: "",
  light_range: [100, 500],
  temperature_range: [20, 30],
  humidity_range: [40, 60],
};

export default function RegionSettingForm({ regionId }) {
  const [form, setForm] = useState(defaultForm);
  const { createRegionSetting } = useRegionContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [prefix, index] = name.split("-");
    if (
      ["light_range", "temperature_range", "humidity_range"].includes(prefix)
    ) {
      const updated = [...form[prefix]];
      updated[Number(index)] = Number(value);
      setForm({ ...form, [prefix]: updated });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRegionSetting(regionId, form);
      alert("Setting created!");
      setForm(defaultForm);
    } catch (err) {
      alert("Failed: " + err.message);
    }
  };

  return (
    <div className="region-setting-form">
      <h4 className="form-title">Create Setting</h4>
      <form onSubmit={handleSubmit}>
        <label>Start Time:</label>
        <input
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
        />

        <label>End Time:</label>
        <input
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
        />

        <label>Light Range (lux):</label>
        <div className="range-inputs">
          <input
            name="light_range-0"
            value={form.light_range[0]}
            onChange={handleChange}
            type="number"
          />
          <span>-</span>
          <input
            name="light_range-1"
            value={form.light_range[1]}
            onChange={handleChange}
            type="number"
          />
        </div>

        <label>Temp Range (°C):</label>
        <div className="range-inputs">
          <input
            name="temperature_range-0"
            value={form.temperature_range[0]}
            onChange={handleChange}
            type="number"
          />
          <span>-</span>
          <input
            name="temperature_range-1"
            value={form.temperature_range[1]}
            onChange={handleChange}
            type="number"
          />
        </div>

        <label>Humidity Range (%):</label>
        <div className="range-inputs">
          <input
            name="humidity_range-0"
            value={form.humidity_range[0]}
            onChange={handleChange}
            type="number"
          />
          <span>-</span>
          <input
            name="humidity_range-1"
            value={form.humidity_range[1]}
            onChange={handleChange}
            type="number"
          />
        </div>

        <div className="button-row">
          <button type="submit">Submit</button>
          <button type="reset" onClick={() => setForm(defaultForm)}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
