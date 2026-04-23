import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFiles } from '../features/filesFeature';
import FileRecord from './FileRecord';
import '../styles.css';

const FileList = () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files.list);
  const status = useSelector((state) => state.files.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFiles());
    }
  }, [status, dispatch]);

  console.log(files);

  return (
    <div className="file-list">
      {Array.isArray(files) && files.length > 0 ? (
        <table className="file-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Size</th>
              <th>Link</th>
              <th>Uploaded At</th>
              <th>Last Download</th>
              <th>Download</th>
              <th>Copy Link</th>
              <th>Change</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <FileRecord key={file.id} file={file} />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No files</p>
      )}
    </div>
  );
};

export default FileList;