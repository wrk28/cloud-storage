const formateTime = (time) => {
  if (!time) {
    return '';
  }
  const date = new Date(time);
  if (isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString('en-GB');
}

export default formateTime;