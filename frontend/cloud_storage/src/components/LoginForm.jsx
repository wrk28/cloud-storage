import { useDispatch } from 'react-redux'
import { useState } from 'react';
import { loginUser } from '../features/authFeature';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const LoginForm = () => {

  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginFormData = {
      username: e.target.login.value,
      password: e.target.password.value,
    };

    dispatch(loginUser(loginFormData))
      .unwrap()
      .then((data) => {
        if (data && data.status === 'success') {
          setError(null);
          e.target.login.value="";
          e.target.password.value="";
          navigate("/")
        }
        else {
          setError(`${data.message}`);
        }
      })
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form-container">
        <input type="text" name="login" placeholder="Login" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Log in</button>
      </form>
      {error && <div className='registation-form-message'>{error}</div>}
    </div>
  );
};

export default LoginForm;