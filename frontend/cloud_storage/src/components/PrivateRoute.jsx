import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isLogged = useSelector((state) => state.auth.isLoggedIn);

  return isLogged ? children : <Navigate to="/" />;
}

export default PrivateRoute;