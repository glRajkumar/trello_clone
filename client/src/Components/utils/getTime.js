export const getTime = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) {
        return Math.floor(seconds) + " seconds ago";
    } else if (seconds < 3600) {
        return Math.floor(seconds / 60) + " minutes ago";
    } else if (seconds < 86400) {
        return Math.floor(seconds / 3600) + " hours ago";
    } else if (seconds < 2592000) {
        return Math.floor(seconds / 86400) + " days ago";
    } else if (seconds < 31104000) {
        return Math.floor(seconds / 2592000) + " months ago";
    } else if (seconds < 31104000) {
        return Math.floor(seconds / 31104000) + " years ago";
    }
};
