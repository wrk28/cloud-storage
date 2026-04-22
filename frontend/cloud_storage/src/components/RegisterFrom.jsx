import { useDispatch} from 'react-redux'
import { fetchUsers, registerUser } from '../features/usersFeature';
import '../styles.css';


const RegisterForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(registerFormData)).then(() => {
      dispatch(fetchUsers())
    });
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <input type="text" name="login" placeholder="Login" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="firstName" placeholder="First Name" />
        <input type="text" name="lastName" placeholder="Last Name" />
        <input type="password" name="password" placeholder="Password" required />
        <input
          type="password"
          name="repeatPassword"
          placeholder="Repeat Password"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegisterForm;