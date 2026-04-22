import { toggleShowDeleteModal } from '../features/usersFeature';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAdminStatus } from '../features/usersFeature';
import DeleteUserModal from './DeleteUserModal';


const UserRecord = ({ user }) => {
  const dispatch = useDispatch();

  const handleToggleAdmin = () => {
    dispatch(updateUserAdminStatus({ id: user.id, is_staff: !user.is_staff }));
  };

  const handleDeleteClick = () => {
    dispatch(toggleShowDeleteModal(true));
  };

  const showDeleteModal = useSelector((state) => state.users.showDeleteModal);


  return (
    <div className="user-record">
      <div className="user-info">
        <p>{user.username} {user.is_superuser ? ( "(superuser)") : ("")}</p> 
        <p>{user.email}</p>
        <p>{user.first_name} {user.last_name}</p>
      </div>
      <div className="user-statistics">
        <p>Files: {user.files_count}</p>
        <p>Size: {user.total_size}</p>
      </div>
      <div className="user-actions">
        <p>
          Admin:
          <input
            type="checkbox"
            checked={user.is_staff}
            disabled={user.is_superuser}
            onChange={handleToggleAdmin}
          />
        </p>
        <button onClick={handleDeleteClick}>Delete</button>
      </div>
      {showDeleteModal && <DeleteUserModal />}
    </div>
  );
};

export default UserRecord;