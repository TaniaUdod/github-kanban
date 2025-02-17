export const formatNumber = (num: number): string => {
  if (num >= 1000 && num < 1000000) {
    return (num / 1000).toFixed(0) + ' K';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + ' M';
  }
  return num.toString();
};
