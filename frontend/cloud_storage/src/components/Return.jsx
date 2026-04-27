import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

  
const Return = () => {

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/'); // Redirect to home
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
    </div>
  );
};

export default Return;
