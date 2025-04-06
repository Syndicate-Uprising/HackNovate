import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './Room.css';
import Chat from './Chat';
import { useAuth } from './AuthContext';

const Room = () => {
  const { id: roomId } = useParams();
  const { user, fetchUserProfile } = useAuth();
  const [file, setFile] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
        alert('Please select a file first');
        return;
    }

    console.log('Selected file:', file);

    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        console.log('File data:', data);

        const workbook = XLSX.read(data, { type: 'array' });
        const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
        console.log('CSV Data:', csvData);

        try {
            const response = await axios.post(`https://ethercalc.net/${roomId}`, csvData, {
                headers: { 'Content-Type': 'text/csv' },
            });
            console.log('Upload Response:', response);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading the file', error);
            alert('Failed to upload.');
        }
    };
    
    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Failed to read the file.');
    };

    reader.readAsArrayBuffer(file);
};


  const handleSaveToBackend = async () => {
    try {
      const response = await axios.get(`https://ethercalc.net/${roomId}.csv.json`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const sheetData = response.data;
      console.log(sheetData);
      await axios.post('http://localhost:3000/api/rooms/save', { roomId, sheetData });
      alert('Sheet data saved successfully!');
    } catch (error) {
      console.error("There's an error saving the data!", error);
      alert('Failed to save sheet data.');
    }
  };

  const handleSaveToLocal = async () => {
    try {
      const response = await axios.get(`https://ethercalc.net/${roomId}.csv`, { responseType: 'blob' });
      const data = await response.data.text();
      const rows = data.split('\n').map(row => row.split(','));
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      const fileName = `${roomId}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      alert(`Sheet updated in ${fileName} successfully!`);
    } catch (error) {
      console.error('Error updating local file:', error);
      alert('Failed to update local file.');
    }
  };

  const handleInvite = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`http://localhost:3000/api/rooms/roomid/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // alert(response.data.user.password);
      
      const password = response.data.password;
      const inviteText = `Room ID: ${roomId}\nPassword: ${password}`;
  
      
      
      navigator.clipboard.writeText(inviteText).then(() => {
        alert(`Copied to clipboard!\n${inviteText}`);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard.');
      });
    } catch (error) {

      console.error('Error fetching room password:', error);
      alert('Failed to fetch room password.',error);
    }
  };
  

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="room-container">
      <div className="navbar">
        <div className="navbar-left">
          <a href='/'>Room ID: {roomId}</a>
        </div>
        <div className="navbar-right">
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="file-input" />
          <button onClick={handleUpload} className="btn btn-upload">Upload</button>
          <button onClick={handleSaveToBackend} className="btn btn-save">Save</button>
          <button onClick={handleSaveToLocal} className="btn btn-download">Download</button>
          <button onClick={handleInvite} className="btn btn-invite">Invite</button>
        </div>
      </div>

      <div className="main-content">
        <div className="spreadsheet-container">
          <button onClick={() => setShowOverlay(true)} className="btn btn-open-spreadsheet">Open Spreadsheet</button>
          {showOverlay && (
            <div className="overlay">
              <div className="overlay-content">
                <button onClick={() => setShowOverlay(false)} className="close-button">Close</button>
                <iframe src={`https://ethercalc.net/${roomId}`} title="Spreadsheet" className="spreadsheet-iframe"></iframe>
              </div>
            </div>
          )}
        </div>
        
        <div className="chat-container">
          <Chat room={roomId} user={user} />
        </div>
      </div>
      
      {showAlert && (
        <div className="alert-box">
          <div className="alert-content">
            <p>Invite details copied to clipboard:</p>
            <pre>{alertMessage}</pre>
            <button onClick={closeAlert} className="btn btn-close">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
