import InfoCard from "./InfoCard";
import InfoRow from "./InfoRow";

export default function DeviceInfoCard({ device }) {
  if (!device) return null;

  return (
    <InfoCard title={device.name}>
      <InfoRow label="Device ID" value={device.id} />
      <InfoRow label="Type" value={device.device_type} />
      <InfoRow label="Location" value={device.location ?? "N/A"} />
    </InfoCard>
  );
}
