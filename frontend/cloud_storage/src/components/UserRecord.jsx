import { useDispatch } from 'react-redux';
import { updateUserAdminStatus } from '../features/usersFeature';
import formatSize from '../services/formatSize';
import formatFileCount from '../services/formatFileCount';
import DeleteUserModal from './DeleteUserModal';
import { deleteUserRecord } from '../features/usersFeature';
import { useState } from 'react';

const UserRecord = ({ user }) => {
  const dispatch = useDispatch();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleAdmin = () => {
    dispatch(updateUserAdminStatus({ id: user.id, is_staff: !user.is_staff }));
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteUserRecord({id: user.id}))
    setShowDeleteConfirm(false);
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
      {showDeleteConfirm && (
        <DeleteUserModal
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
};

export default UserRecord;