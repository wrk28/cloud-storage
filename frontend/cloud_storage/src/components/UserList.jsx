import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../features/usersFeature';
import UserRecord from './UserRecord';
import '../styles.css';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.list);
  const status = useSelector((state) => state.users.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  return (
    <div className="user-list">
      {Array.isArray(users) ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>Login</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Number</th>
              <th>Total Size</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRecord key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users</p>
      )}
    </div>
  );
};

export default UserList;