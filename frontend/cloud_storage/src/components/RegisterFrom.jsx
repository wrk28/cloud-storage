import { useDispatch } from 'react-redux'
import { fetchUsers, registerUser } from '../features/usersFeature'
import { useState, useRef } from 'react'
import '../styles.css'

const RegisterForm = () => {
  const dispatch = useDispatch()
  const timerRef = useRef(null)

  const [formMessage, setformMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setformMessage('')

    const registerFormData = {
      username: e.target.login.value,
      email: e.target.email.value,
      first_name: e.target.firstName.value,
      last_name: e.target.lastName.value,
      password: e.target.password.value,
      repeatPassword: e.target.repeatPassword.value,
    }

    const loginPattern = /^[A-Za-z][A-Za-z0-9]{3,19}$/
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
    const passwordPattern= /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};\'":\\|,.<>\/?]).{6,}$/

    const validateField = (pattern, value, message) => {
      if (!pattern.test(value)) {
        setformMessage(message)
        timerRef.current = setTimeout(() => {
          setformMessage('')
        }, 3000)
        return false
      }
      return true
    }

    if (
      !validateField(loginPattern, registerFormData.login, "Invalid login, too simple.") ||
      !validateField(emailPattern, registerFormData.email, "Invalid email.") ||
      !validateField(passwordPattern, registerFormData.password, "Invalid password, too simple.")
    ) {
      return
    }

    if (registerFormData.password !== registerFormData.repeatPassword) {
      setformMessage('Passwords do not match.')
      timerRef.current = setTimeout(() => {
        setformMessage('')
      }, 3000)
      return
    }

    dispatch(registerUser(registerFormData))
      .unwrap()
      .then((data) => {
        if (data && typeof data.username === 'string') {
        dispatch(fetchUsers())
        e.target.reset()
        setformMessage("User registered. Now log in.")
          timerRef.current = setTimeout(() => {
            setformMessage('')
        }, 3000)
        }
        else if (Array.isArray(data.username)) {
          const errorMsg = data.username
          ? data.username[0]
          : "Registration error.";
          setformMessage(`${errorMsg}`);
        }
      })
  }

  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <input type="text" name="login" placeholder="Login (required)" required />
        <input type="email" name="email" placeholder="Email (required)" required />
        <input type="text" name="firstName" placeholder="First Name" />
        <input type="text" name="lastName" placeholder="Last Name" />
        <input type="password" name="password" placeholder="Password (required)" required />
        <input
          type="password"
          name="repeatPassword"
          placeholder="Repeat Password (required)"
          required
        />
        <button type="submit">Submit</button>
      </form>
       {formMessage && (
        <div className="registration-form-message">{formMessage}</div>
      )}
    </div>
  )
}

export default RegisterForm