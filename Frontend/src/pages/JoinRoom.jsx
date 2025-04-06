import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JoinRoom.css';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        'http://localhost:3000/api/rooms/join',
        { roomId, password },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200 && response.data.success) {
        // window.open(`https://ethercalc.net/${roomId}`, '_blank');
        setTimeout(() => {
          navigate(`/room/${roomId}`);
        }, 500);
      } else {
        setErrorMessage('Invalid Room ID or Password');
      }
    } catch (error) {
      setErrorMessage('Error joining the room. Please try again.');
      console.error('Error joining room:', error);
    }
  };

  return (
    <div className="join-room-container">
      <h2>Join Room</h2>
      <form onSubmit={handleJoinRoom}>
        <div>
          <label htmlFor="roomId">Room ID</label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default JoinRoom;
