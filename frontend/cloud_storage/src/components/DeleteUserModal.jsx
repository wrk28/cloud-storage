import { useDispatch, useSelector } from 'react-redux';
import { toggleShowDeleteModal, deleteUser } from '../features/usersFeature';

const DeleteUserModal = () => {
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(toggleShowDeleteModal({ show: false, user: null }));
  };

  const handleDeleteUserRecord = () => {
  };


  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Are you sure you want to delete this user and all user's files?</h2>
        <div className="modal-buttons">
          <button onClick={handleDeleteUserRecord}>Delete</button>
          <button onClick={handleCloseModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;