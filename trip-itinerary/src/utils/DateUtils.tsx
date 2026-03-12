export const formatDate= (date: Date | undefined): string => {
    return date ? date.toLocaleDateString("en-GB", {weekday: "short", month: "short", day: "numeric"}) : '';
}