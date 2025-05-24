import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPut, apiPost, apiDelete } from "../services/groupApi";

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await apiGet("/api/groups");
      setGroups(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const updateGroup = async (groupId, updates) => {
    const updated = await apiPut(`/api/groups/${groupId}`, updates);
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, ...updated } : g))
    );
    return updated;
  };

  const deleteGroup = async (groupId) => {
    await apiDelete(`/api/groups/${groupId}`);
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const createGroup = async (payload) => {
    const created = await apiPost("/api/groups", payload);
    setGroups((prev) => [...prev, created]);
    return created;
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <GroupContext.Provider
      value={{
        groups,
        loading,
        error,
        fetchGroups,
        updateGroup,
        createGroup,
        deleteGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => useContext(GroupContext);
