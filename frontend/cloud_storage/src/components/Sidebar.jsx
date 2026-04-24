import { Link } from 'react-router-dom';
import '../styles.css';

import { useDispatch } from 'react-redux';
import { uploadFile } from '../features/filesFeature';

import UploadFileModal from './UploadFileModal';

import { useState } from 'react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpload = ({ file, description }) => {
    dispatch(uploadFile({ file, description }));
    handleCloseModal();
  };

  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-item link-style">
        Home
      </Link>
      {isLoggedIn && (
        <div>
          <Link to="/users" className="sidebar-item link-style">
            List of Users
          </Link>
          <Link to="/files" className="sidebar-item link-style">
            List of Files
          </Link>
          <button className="sidebar-item" onClick={handleOpenModal}>
            Upload File
          </button>
        </div>)}
      {isModalOpen && (
        <UploadFileModal onClose={handleCloseModal} onUpload={handleUpload} />
      )}
    </div>
  );
};

export default Sidebar;