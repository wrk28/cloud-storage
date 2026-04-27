const formateTime = (time) => {

    const date = new Date(time);
    return date.toLocaleString('en-GB');
}

export default formateTime;