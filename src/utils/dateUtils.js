// src/utils/dateUtils.js
export const calculateDaysBetween = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;
  
    const from = new Date(fromDate);
    const to = new Date(toDate);
  
    const differenceInTime = to.getTime() - from.getTime(); // Difference in milliseconds
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24); // Convert to days
  
    return differenceInDays;
  };
   export const parseDate = (dateString) => {
        const [year, month, day] = dateString?.split("/").map(Number);
        return new Date(year, month - 1, day);
    };
    export const formatDateToYYYYMMDD = (isoDate) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits
        const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
      
        return `${year}/${month}/${day}`;
      };
  