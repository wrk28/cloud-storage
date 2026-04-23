import { useDispatch } from 'react-redux';
import { deleteFile } from '../features/filesFeature';
import formatSize from '../services/formatSize';
import formateTime from '../services/formatTime';
import '../styles.css';

const FileRecord = ({ file }) => {
  const dispatch = useDispatch();

  const handleDownload = () => {
    
  };

  const handleCopyLink = () => {
    
  };

  const handleChange= () => {
    
  };

    const handleDelete = () => {
    dispatch(deleteFile({ id: file.id }));
  };

  const date = new Date;

  return (
    <tr>
      <td>{file.name}</td>
      <td>{file.description}</td>
      <td>{formatSize(file.size)}</td>
      <td>{file.link}</td>
      <td>{formateTime(file.when_uploaded)}</td>
      <td>{formateTime(file.last_download)}</td>
      <td>
        <button onClick={handleDownload}>Download</button>
      </td>
      <td>
        <button onClick={handleCopyLink}>Copy Link</button>
      </td>
      <td>
        <button onClick={handleChange}>Change</button>
      </td>
      <td>
        <button onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
};

export default FileRecord;