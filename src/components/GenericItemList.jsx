import { FaTrashAlt } from "react-icons/fa";
import "./styles/GenericItemList.css";

export default function GenericItemList({ items, getName, onEdit, onDelete }) {
  return (
    <div className="item-list">
      {items.map((item) => (
        <div key={item.id} className="item-card">
          <div className="item-name">{getName(item)}</div>
          <div className="item-actions">
            <button onClick={() => onEdit?.(item)}>Edit</button>
            <button onClick={() => onDelete?.(item)}>
              <FaTrashAlt />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
