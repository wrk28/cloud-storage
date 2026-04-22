import { useDispatch } from 'react-redux';
import { toggleShowDeleteModal } from '../features/usersFeature';

const DeleteUserModal = () => {
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(toggleShowDeleteModal(false));
  };

  return (
    <div className="delete-modal">
      <div className="modal-content">
        <h2>Are you sure you want to delete this user and all user's files?</h2>
        <button onClick={handleCloseModal}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteUserModal;