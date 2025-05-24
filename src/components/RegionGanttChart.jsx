import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import { convertCustomTimestamp } from "../utils/formatDate";
import "./styles/RegionGanttChart.css";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale,
  TimeScale,
  zoomPlugin
);

export default function RegionGanttChart({ settings }) {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [settings]);

  if (!Array.isArray(settings)) return null;

  const now = Date.now();

  const datasets = settings
    .filter((s) => {
      const end = convertCustomTimestamp(s.end_time);
      return end.getTime() >= now;
    })
    .map((s, idx) => {
      const start = convertCustomTimestamp(s.start_time);
      const end = convertCustomTimestamp(s.end_time);
      return {
        label: `Setting #${s.id}`,
        data: [
          { x: start.getTime(), y: idx + 1 },
          { x: end.getTime(), y: idx + 1 },
        ],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,1)",
        borderWidth: 16,
        pointRadius: 0,
        fill: false,
        settingData: s.data,
      };
    });

  const chartData = { datasets };

  const options = {
    responsive: true,
    interaction: { mode: "nearest", intersect: false },
    scales: {
      x: {
        type: "time",
        time: { unit: "day", tooltipFormat: "PPpp" },
        title: { display: true, text: "Time" },
      },
      y: {
        title: { display: true, text: "Setting Index" },
        ticks: { stepSize: 0.2, precision: 0 },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataset = context.dataset;
            const start = new Date(dataset.data[0].x).toLocaleString();
            const end = new Date(dataset.data[1].x).toLocaleString();
            const data = dataset.settingData;
            return [
              dataset.label,
              `Start: ${start}`,
              `End: ${end}`,
              `Data: ${JSON.stringify(data)}`,
            ];
          },
        },
      },
      legend: { display: false },
      zoom: {
        pan: { enabled: true, mode: "x" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
      },
    },
  };

  return (
    <div className="region-gantt-wrapper">
      <h4 className="region-gantt-title">Settings Timeline</h4>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
