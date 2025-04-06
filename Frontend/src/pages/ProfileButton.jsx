import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProfileButton.css';

const ProfileButton = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <div className="profile-button">
      {user ? (
        <div className="profile-info">
          <span>{user.name}</span>
          <Link to="/profile">Profile</Link>
        </div>
      ) : (
        <Link to="/signup">Signup</Link>
      )}
    </div>
  );
};

export default ProfileButton;
