export function convertToTreeItems(groups) {
  return groups.map((group) => ({
    id: `group-${group.id}`,
    label: group.name,
    children: (group.regions ?? []).map((region) => ({
      id: `region-${region.id}`,
      label: region.name,
      children: (region.devices ?? []).map((device) => ({
        id: `device-${device.id}`,
        label: device.name,
      })),
    })),
  }));
}
