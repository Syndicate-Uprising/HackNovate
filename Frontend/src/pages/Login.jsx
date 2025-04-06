import  { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';
function Login() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);


  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });

      if (response.data.token) {
        localStorage.setItem('jwtToken', response.data.token);
        navigate('/', { replace: true });
        window.location.reload();
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Error during login. Please try again.',err);
    }
  };

  return (
    <div className='body'>
    <div className="auth-container">
      <h2>Login</h2>
      <div>
        <label>Email : </label>
        <input
          type="text"
          placeholder="email@email.com"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          required
        />
      </div>
      <div>
          <label>Password  : </label>
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Do not have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
    </div>
  );
}

export default Login;