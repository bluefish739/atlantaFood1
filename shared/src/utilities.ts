
export function toDate(dateString: string | Date | undefined) {
    if (!dateString) {
        return undefined;
    }
    if (dateString instanceof Date) {
        return dateString;
    }
    return new Date(dateString);
}

export function formatDateToString(date: Date | undefined): string | undefined {
    if (!date) {
        return undefined;
    }
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const day: string = date.getDate().toString().padStart(2, '0');
    const year: string = date.getFullYear().toString();
    
    return `${year}-${month}-${day}`;
}