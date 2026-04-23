const formatFileCount = (count) => {
    if (Number.isInteger(count)) {
        if (count === 0) return '0 files';
        if (count === 1) return '1 file';
        return `${count} files`;
    }
    return '';
};

export default formatFileCount;