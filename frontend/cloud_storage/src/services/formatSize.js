const formatSize = (bytes) => {
    if (!Number.isInteger(bytes) || bytes < 0) return '';
    const units = ['bytes', 'Kb', 'Mb', 'Gb'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    if (unitIndex === 0) {
      return `${size} ${units[unitIndex]}`;
    } else {
      return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
  };

export default formatSize;