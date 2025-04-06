import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
// import ProfileButton from './ProfileButton';
import axios from 'axios';
import './Main.css';

const Main = () => {
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomsList, setRoomsList] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:3000/api/rooms/getrooms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoomsList(response.data.rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleJoinRoomRedirect = () => {
    navigate('/joinroom');
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        'http://localhost:3000/api/rooms/create',
        { roomId, roomName, password, username },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 201) {
        setRoomsList((prevRooms) => [...prevRooms, response.data.room]);
        // window.open(`https://ethercalc.net/${roomId}`, '_blank');
        setTimeout(() => {
          navigate(`/room/${roomId}`);
        }, 500);
      }
    } catch (error) {
      alert(error);
      console.error('Error creating room:', error);
    }

    setRoomId('');
    setRoomName('');
    setPassword('');
    setUsername('');
  };

  const handleCreateRoom = () => {
    setRoomId(uuidv4());
    setIsCreatingRoom(true);
  };

  const handleDeleteRoom = async (roomIdToDelete) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.delete(`http://localhost:3000/api/rooms/${roomIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setRoomsList((prevRooms) => prevRooms.filter((room) => room.roomId !== roomIdToDelete));
      }
    } catch (error) {
      alert(error);
      console.error('Error deleting room:', error);
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:3000/api/rooms/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="main-container">
      <button className="profile-btn" onClick={toggleProfile}>
        {showProfile ? '-' : '+'}
      </button>

      {showProfile && user && (
        <div className={`profile-container ${showProfile ? 'show' : ''}`}>
          <h3>Profile</h3>
          <p><strong>Username:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="roomId">Room ID</label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            disabled={isCreatingRoom}
            required
          />
        </div>
        <div>
          <label htmlFor="roomName">Room Name</label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
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
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {!isCreatingRoom && (
        <div>
          <button type="button" onClick={handleCreateRoom}>
            Create Room with Random ID
          </button>
          <button type="button" onClick={handleJoinRoomRedirect}>
            Join a Room
          </button>
        </div>
      )}

      <div className="rooms-list">
        <h3>Available Rooms</h3>
        <ul>
          {roomsList.map((room) => (
            <li key={room.roomId}>
              <strong>Room ID:</strong> {room.roomId} <br />
              <strong>Room Name:</strong> {room.roomName} <br />
              <strong>Created by:</strong> {room.username} <br />
              <button onClick={() => navigate(`/room/${room.roomId}`)}>Go to Room</button>
              <button onClick={() => handleDeleteRoom(room.roomId)}>Delete Room</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Main;
