"use client"

const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", options).format(date).replace(",", "");
};

export default formatDate;
