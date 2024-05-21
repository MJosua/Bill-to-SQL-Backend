const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Jakarta' 
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

module.exports = formatDate;