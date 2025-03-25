// src/utils/dateUtils.js
export const calculateDaysBetween = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;
  
    const from = new Date(fromDate);
    const to = new Date(toDate);
  
    const differenceInTime = to.getTime() - from.getTime(); // Difference in milliseconds
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24); // Convert to days
  
    return differenceInDays;
  };

  export const calculateDaysAndHoursBetween = (fromDate, toDate, fromTime, toTime) => {
    if (!fromDate || !toDate || !fromTime || !toTime) return { days: 0, hours: 0 };

    // Convert date format from "YYYY/MM/DD" to "YYYY-MM-DD"
    const formattedFromDate = fromDate.replace(/\//g, "-");
    const formattedToDate = toDate.replace(/\//g, "-");

    // Combine date and time to create full DateTime objects
    const fromDateTime = new Date(`${formattedFromDate}T${fromTime}`);
    const toDateTime = new Date(`${formattedToDate}T${toTime}`);

    if (isNaN(fromDateTime.getTime()) || isNaN(toDateTime.getTime())) {
        console.error("Invalid date or time format");
        return { days: 0, hours: 0 };
    }

    const differenceInTime = toDateTime.getTime() - fromDateTime.getTime(); // Difference in milliseconds
    const totalHours = differenceInTime / (1000 * 60 * 60); // Convert to hours

    const days = Math.floor(totalHours / 24); // Extract whole days
    const hours = Math.round(totalHours % 24); // Remaining hours

    return { days, hours };
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
  
      export const formatDateToYYYYMMDD2 = (isoDate) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits
        const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
      
        return `${year}-${month}-${day}`;
      };