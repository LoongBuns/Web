import React from "react";
import { useParams } from "react-router-dom";
import { useGroupContext } from "../context/GroupContext";
import InfoCard from "../components/InfoCard";
import InfoRow from "../components/InfoRow";
import { formatDate } from "../utils/formatDate";
import "../styles/GroupDetail.css";

export default function GroupDetail() {
  const { id } = useParams();
  const groupId = parseInt(id, 10);
  const { groups, loading, error } = useGroupContext();

  const group = groups.find((g) => g.id === groupId);

  if (loading) return <p className="group-loading">Loading...</p>;
  if (error) return <p className="group-error">Error:{error}</p>;
  if (!group) return <p className="group-notfound">Not Found: {groupId}</p>;

  return (
    <div className="group-detail-container">
      <InfoCard title={group.name}>
        {group.description && (
          <InfoRow label="Description" value={group.description} />
        )}
        <InfoRow label="Created At" value={formatDate(group.created_at)} />
      </InfoCard>
    </div>
  );
}
