import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authFeature';
import '../styles.css';

const Top = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <div className="top-section">
      <div className='top-caption'>Cloud Storage</div>
      {!isLoggedIn ? (
        <div>
          <Link to='/login' className="link-style">
            <button className="top-button">Log in</button>
          </Link>
          <Link to='/register' className="link-style">
            <button className="top-button">Sign up</button>
          </Link>
        </div>
      ) : (
        <button className="top-button" onClick={handleLogout}>Log out</button>
      )}
    </div>
  );
};

export default Top;