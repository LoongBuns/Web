import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRegionContext } from "../context/RegionContext";

import MiniCard from "../components/MiniCard";
import RegionGanttChart from "../components/RegionGanttChart";
import RegionSettingForm from "../components/RegionSettingForm";
import "../styles/RegionDetail.css";

export default function RegionDetail() {
  const { id } = useParams();
  const regionId = parseInt(id, 10);

  const { regionMap, fetchRegionById, loading, error } = useRegionContext();
  const region = regionMap[regionId];

  useEffect(() => {
    fetchRegionById(regionId);
  }, [regionId, fetchRegionById]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!region) return <p>Region not found</p>;

  return (
    <div className="region-detail-container">
      <h2 className="region-title">{region.name}</h2>

      <div className="region-metrics-row">
        <MiniCard title="Temperature" value={region.temperature} unit="°C" />
        <MiniCard title="Humidity" value={region.humidity} unit="%" />
        <MiniCard title="Light" value={region.light} unit="lux" />
      </div>

      <div className="region-content-row">
        <div style={{ flex: 2 }}>
          <RegionGanttChart
            key={JSON.stringify(region.settings)}
            settings={region.settings}
          />
        </div>
        <div style={{ flex: 1 }}>
          <RegionSettingForm regionId={region.id} />
        </div>
      </div>
    </div>
  );
}
