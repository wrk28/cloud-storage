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

  console.log(users);

  return (
  <div className="user-list">
    {Array.isArray(users) ? (
      users.map((user) => (
        <UserRecord key={user.id} user={user} />
      ))
    ) : (
      <p>No users</p>
    )}
  </div>
  );
};

export default UserList;