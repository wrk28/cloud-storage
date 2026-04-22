import { Link } from 'react-router-dom';
import '../styles.css';

const Top = () => {
  const isLoggedIn = false;

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
        <button className="top-button">Log out</button>
      )}
    </div>
  );
};

export default Top;