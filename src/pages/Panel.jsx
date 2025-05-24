import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useGroupContext } from "../context/GroupContext";
import { useDeviceContext } from "../context/DeviceContext";
import { useRegionContext } from "../context/RegionContext";
import GenericItemList from "../components/GenericItemList";
import CreateGroupModal from "../components/CreateGroupModal";
import CreateRegionDeviceModal from "../components/CreateRegionDeviceModal";
import EditGroupModal from "../components/EditGroupModal";
import EditRegionModal from "../components/EditRegionModal";
import EditDeviceModal from "../components/EditDeviceModal";
import "../styles/Panel.css";

export default function Panel() {
  const { user } = useAuth();
  const { groups: groupList } = useGroupContext();
  const {
    state: { groups },
    fetchGroupTree,
    deleteDevice,
  } = useDeviceContext();
  const { deleteRegion } = useRegionContext();

  const regions = groups.flatMap((g) => g.regions || []);
  const devices = regions.flatMap((r) => r.devices || []);

  const [tab, setTab] = useState("group");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateRegionDevice, setShowCreateRegionDevice] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editType, setEditType] = useState(null);

  const isAdmin = user?.role === "admin";

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div className="panel-tabs">
          <button
            className={`panel-tab-button ${tab === "group" ? "active" : ""}`}
            onClick={() => setTab("group")}
          >
            Group
          </button>
          <button
            className={`panel-tab-button ${tab === "region" ? "active" : ""}`}
            onClick={() => setTab("region")}
          >
            Region
          </button>
          <button
            className={`panel-tab-button ${tab === "device" ? "active" : ""}`}
            onClick={() => setTab("device")}
          >
            Device
          </button>
        </div>

        <div className="panel-actions">
          {isAdmin && (
            <button onClick={() => setShowCreateGroup(true)}>
              Create Group
            </button>
          )}
          <button onClick={() => setShowCreateRegionDevice(true)}>
            Create Region/Device
          </button>
        </div>
      </div>

      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} />
      )}
      {showCreateRegionDevice && (
        <CreateRegionDeviceModal
          onClose={() => setShowCreateRegionDevice(false)}
        />
      )}
      {editTarget && editType === "group" && (
        <EditGroupModal
          target={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
      {editTarget && editType === "region" && (
        <EditRegionModal
          target={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
      {editTarget && editType === "device" && (
        <EditDeviceModal
          target={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      <div className="panel-list-area">
        {tab === "group" && (
          <GenericItemList
            items={groupList}
            getName={(g) => g.name}
            onEdit={(g) => {
              setEditType("group");
              setEditTarget(g);
            }}
            onDelete={(g) => console.log("Delete Group", g)}
          />
        )}
        {tab === "region" && (
          <GenericItemList
            items={regions}
            getName={(r) => r.name}
            onEdit={(r) => {
              setEditType("region");
              setEditTarget(r);
            }}
            onDelete={async (r) => {
              try {
                await deleteRegion(r.id);
                await fetchGroupTree();
              } catch (err) {
                alert("Delete failed: " + err.message);
              }
            }}
          />
        )}
        {tab === "device" && (
          <GenericItemList
            items={devices}
            getName={(d) => d.name}
            onEdit={(d) => {
              setEditType("device");
              setEditTarget(d);
            }}
            onDelete={async (d) => {
              try {
                await deleteDevice(d.id);
                await fetchGroupTree();
              } catch (err) {
                alert("Delete failed: " + err.message);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
