export const calculateDaysAgo = (created_at: string): number => {
  const currentDate = new Date();
  const issueDate = new Date(created_at);
  const timeDifference = currentDate.getTime() - issueDate.getTime();
  return Math.floor(timeDifference / (1000 * 3600 * 24));
};
