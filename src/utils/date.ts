export const dateNow = () => {
    const date = new Date();
    date.setHours(date.getHours() + 3); // Adjust as necessary for your timezone
    return date;
}
