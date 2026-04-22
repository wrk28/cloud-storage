import { useDispatch } from 'react-redux';
import { toggleAdminStatus } from '../features/usersFeature';
import '../styles.css';

const FileRecord = () => {
  const dispatch = useDispatch();

  const handleToggleAdmin = () => {
    dispatch(toggleAdminStatus(user.id));
  };

  return (
    <div className="file-record">
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Admin: {user.is_admin ? 'Yes' : 'No'}</p>
      <button onClick={handleToggleAdmin}>Toggle Admin</button>
    </div>
  );
};

export default FileRecord;