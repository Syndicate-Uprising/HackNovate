import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', 
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.token) {
        localStorage.setItem('jwtToken', response.data.token);
        navigate('/', { replace: true });
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Error during signup. Please try again.', err);
    }
  };

  return (
    <div className='body'>
      <div className="auth-container">
        <h2>Signup</h2>
        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder='Your Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength='25'
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="text"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button onClick={handleSignup}>Signup</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
