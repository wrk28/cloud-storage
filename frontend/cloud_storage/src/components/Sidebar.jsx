import { Link } from 'react-router-dom';
import '../styles.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-item link-style">
        Home
      </Link>
      <Link to="/users" className="sidebar-item link-style">
        List of Users
      </Link>
      <Link to="/files" className="sidebar-item link-style">
        List of Files
      </Link>
    </div>
  );
};

export default Sidebar;