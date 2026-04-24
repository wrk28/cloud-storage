import { toggleShowDeleteModal } from '../features/usersFeature';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAdminStatus } from '../features/usersFeature';
import formatSize from '../services/formatSize';
import formatFileCount from '../services/formatFileCount';
import DeleteUserModal from './DeleteUserModal';

const UserRecord = ({ user }) => {
  const dispatch = useDispatch();
  const showDeleteModal = useSelector((state) => state.users.showDeleteModal);

  const handleToggleAdmin = () => {
    dispatch(updateUserAdminStatus({ id: user.id, is_staff: !user.is_staff }));
  };

  const handleDeleteClick = () => {
    dispatch(toggleShowDeleteModal(true));
  };

  return (
    <>
      <tr>
        <td>
          {user.username} {user.is_superuser && "(superuser)"}
        </td>
        <td>{user.email}</td>
        <td>
          {user.first_name} {user.last_name}
        </td>
        <td>{formatFileCount(user.file_count)}</td>
        <td>{formatSize(user.total_size)}</td>
        <td>
          <input
            type="checkbox"
            checked={user.is_staff}
            disabled={user.is_superuser}
            onChange={handleToggleAdmin}
          />
        </td>
        <td>
          <button 
            onClick={handleDeleteClick}
            disabled={user.is_superuser}>Delete</button>
        </td>
      </tr>
      {showDeleteModal && <DeleteUserModal />}
    </>
  );
};

export default UserRecord;