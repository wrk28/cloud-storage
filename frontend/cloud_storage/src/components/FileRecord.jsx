import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteFile, downloadFile, updateFileDescription } from '../features/filesFeature';
import { fetchFiles } from '../features/filesFeature';

import CopyLinkModal from './CopyLinkModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ChangeDescriptionModal from './ChangeDescriptionModal';

import formateTime from '../services/formatTime';

const FileRecord = ({ file, userID }) => {
  const dispatch = useDispatch();

  const [showCopyLink, setShowCopyLink] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [description, setDescription] = useState(file.description);

  const handleDownload = () => {
    dispatch(downloadFile(file.id));
    dispatch(fetchFiles({id: userID}));
  };

  const handleCopyLink = () => {
    setShowCopyLink(true);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleChange = () => {
    setShowChangeModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteFile({ id: file.id }));
    setShowDeleteConfirm(false);
  };

  const handleUpdateDescription = () => {
    dispatch(updateFileDescription({ id: file.id, description }));
    setShowChangeModal(false);
  };

  const host = "http://127.0.0.1:8000/api/download/external/?link="

  return (
    <>
      <tr>
        <td>{file.name}</td>
        <td>{file.description}</td>
        <td>{file.size}</td>
        <td>{host}{file.link}</td>
        <td>{formateTime(file.when_uploaded)}</td>
        <td>{formateTime(file.last_download)}</td>
        <td>
          <button onClick={handleDownload}>Download</button>
        </td>
        <td>
          <button onClick={handleCopyLink}>Link</button>
        </td>
        <td>
          <button onClick={handleChange}>Change</button>
        </td>
        <td>
          <button onClick={handleDelete}>Delete</button>
        </td>
      </tr>

      {showCopyLink && (
        <CopyLinkModal host= {host} link={file.link} onClose={() => setShowCopyLink(false)} />
      )}

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showChangeModal && (
        <ChangeDescriptionModal
          description={description}
          setDescription={setDescription}
          onSave={handleUpdateDescription}
          onCancel={() => setShowChangeModal(false)}
        />
      )}
    </>
  );
};

export default FileRecord;