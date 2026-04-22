import '../styles.css';

const LoginForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const loginData = {
      login: e.target.login.value,
      password: e.target.password.value,
    };
    // TODO: Add login logic here (e.g., dispatch an action or API call)
    console.log('Logging in:', loginData);
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form-container">
        <input type="text" name="login" placeholder="Login" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default LoginForm;