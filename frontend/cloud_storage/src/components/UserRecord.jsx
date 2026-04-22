import { toggleShowDeleteModal } from '../features/usersFeature';
import { useDispatch, useSelector } from 'react-redux';
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

  const formatFileCount = (count) => {
    if (Number.isInteger(count)) {
      if (count === 0) return '0 files';
      if (count === 1) return '1 file';
      return `${count} files`;
    }
    return '';
  };

  const formatSize = (bytes) => {
    if (!Number.isInteger(bytes) || bytes < 0) return '';
    const units = ['bytes', 'Kb', 'Mb', 'Gb'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    const sizeStr = Number.isInteger(size) ? size.toString() : size.toFixed(1);
    return `${sizeStr} ${units[unitIndex]}`;
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
          <button onClick={handleDeleteClick}>Delete</button>
        </td>
      </tr>
      {showDeleteModal && <DeleteUserModal />}
    </>
  );
};

export default UserRecord;