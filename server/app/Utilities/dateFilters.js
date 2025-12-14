/**
 * Returns the start date based on filter type
 * @param {"week" | "month" | "all"} type
 * @returns {Date|null}
 */
export const getStartDate = (type) => {
  const now = new Date();

  if (type === "week") {
    const start = new Date();
    start.setDate(now.getDate() - 7);
    return start;
  }

  if (type === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return null;
};
