import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useDeviceContext } from "../context/DeviceContext";
import { convertToTreeItems } from "../utils/convertor";
import "./styles/Sidebar.css";

export default function Sidebar() {
  const { state } = useDeviceContext();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState([]);

  const treeItems = useMemo(
    () => convertToTreeItems(state.groups),
    [state.groups]
  );

  if (state.loading) return <div>loading...</div>;
  if (state.error) return <div>Error: {state.error}</div>;

  const handleItemClick = (event, itemId) => {
    const isExpandIconClick = event.target.closest("button") !== null;
    if (isExpandIconClick) return;

    if (itemId.startsWith("group-")) {
      navigate(`/group/${itemId.replace("group-", "")}`);
    } else if (itemId.startsWith("region-")) {
      navigate(`/region/${itemId.replace("region-", "")}`);
    } else if (itemId.startsWith("device-")) {
      navigate(`/device/${itemId.replace("device-", "")}`);
    }
  };

  return (
    <div className="sidebar-container">
      <h4 className="sidebar-title">SmartBlinds Dashboard</h4>
      <RichTreeView
        items={treeItems}
        expandedItems={expandedItems}
        onExpandedItemsChange={(e, ids) => setExpandedItems(ids)}
        onItemClick={handleItemClick}
        sx={{
          ".MuiRichTreeView-itemLabel": {
            fontSize: "14px",
          },
        }}
      />
      <Link to="/panel" className="sidebar-panel-link">
        <MdDashboard size={18} />
        Panel
      </Link>
    </div>
  );
}
