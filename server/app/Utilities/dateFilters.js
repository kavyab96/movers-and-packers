// /**
//  * Returns the start date based on filter type
//  * @param {"week" | "month" | "all"} type
//  * @returns {Date|null}
//  */
// export const getStartDate = (type) => {
//   const now = new Date();

//   if (type === "week") {
//     const start = new Date();
//     start.setDate(now.getDate() - 7);
//     return start;
//   }

//   if (type === "month") {
//     return new Date(now.getFullYear(), now.getMonth(), 1);
//   }

//   return null;
// };


export const getDateRange = (type) => {
  const now = new Date();

  if (type === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay()); // Sunday start
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Saturday end
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (type === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  return null;
};
