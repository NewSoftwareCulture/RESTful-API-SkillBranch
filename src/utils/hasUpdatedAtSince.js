export default (items, ifModifiedSince) => {
  const date = new Date(ifModifiedSince);
  if (!Array.isArray(items)) {
      items = [items]
  };
  return !!items.filter(item => item.updatedAt > date).length
}