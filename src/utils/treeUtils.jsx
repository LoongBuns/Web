export function buildItemMap(items) {
  const map = new Map();

  const traverse = (list) => {
    list.forEach((item) => {
      map.set(item.id, item);
      if (item.children) {
        traverse(item.children);
      }
    });
  };

  traverse(items);
  return map;
}
