export const formatNumber = (() => {
  const formatterCache = new Map<string, Intl.NumberFormat>();
  return (n: number, options?: Intl.NumberFormatOptions): string => {
    const key = JSON.stringify(options || {});
    let formatter = formatterCache.get(key);
    if (!formatter) {
      formatter = new Intl.NumberFormat("en-US", options);
      formatterCache.set(key, formatter);
    }
    return formatter.format(n);
  };
})();
