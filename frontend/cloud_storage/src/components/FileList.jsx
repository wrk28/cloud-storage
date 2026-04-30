import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFiles } from '../features/filesFeature';
import FileRecord from './FileRecord';
import { useParams } from 'react-router-dom';
import { resetStatus } from '../features/filesFeature';
import { setUser } from '../features/usersFeature';
import Return from './Return';
import '../styles.css';
import PreviewFileModal from './PreviewFileModal';
import { hideModal } from '../features/modalsFeature';


const FileList = () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files.list);
  const status = useSelector((state) => state.files.status);
  
  const isPreviewFileModal = useSelector((state) => state.modals.previewFileModal);
  
  const { userid } = useParams();
  const userID = userid;

  useEffect(() => {
    if (userID) {
      dispatch(setUser(userID));
      dispatch(resetStatus());
    }
  }, [userID, dispatch]);

  useEffect(() => {
    if (userID && status === 'idle') {
      dispatch(fetchFiles({ id: userID }));
    }
  }, [status, userID, dispatch]);

  const handleClosePreviewFileModal = () => {
    dispatch(hideModal('previewFileModal'));
  };
  
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
              <th>Preview</th>
              <th>Download</th>
              <th>Copy Link</th>
              <th>Change</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <FileRecord key={file.id} file={file} userID={userID} />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No files</p>
      )}
      <Return />
      {isPreviewFileModal && <PreviewFileModal onClose={handleClosePreviewFileModal}/>}
    </div>
  );
};

export default FileList;