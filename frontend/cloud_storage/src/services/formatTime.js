const formateTime = (time) => {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const date = new Date(time);
    return date.toLocaleString('en-US', options);
}

export default formateTime;