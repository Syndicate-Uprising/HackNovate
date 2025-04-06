const Room = require('../models/roommodel');
const User = require('../models/usermodel')
const SheetData = require('../models/sheetdatamodel');
    exports.createRoom = async (req, res) => {
        try {
            const { roomId, roomName, password, username } = req.body;
            const userId = req.user._id; 
    
            let room = await Room.findOne({ roomId });
            if (room) {
                return res.status(400).json({ message: 'Room ID already exists.' });
            }
            room = new Room({
                roomId,
                roomName, 
                password,
                username,
                userId, 
            });
            await room.save();
            res.status(201).json({ message: 'Room created successfully', room });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    };

    
    exports.joinRoom = async (req, res) => {
        try {
            const { roomId, password } = req.body;
            const room = await Room.findOne({ roomId });
    
            if (!room) {
                return res.status(404).json({ success: false, message: 'Room not found' });
            }
    
            if (room.password !== password) { 
                return res.status(401).json({ success: false, message: 'Incorrect password' });
            }
    
            res.status(200).json({ success: true, room });
        } catch (error) {
            console.error('Error joining room:', error);
            res.status(500).json({ success: false, message: 'Failed to join room' });
        }
    };


    exports.getRooms = async (req, res) => {
        try {
            const userId = req.user._id; 
            const rooms = await Room.find({ userId }); 
            if (rooms.length === 0) {
                return res.status(404).json({ message: 'No rooms found for this user.' });
            }
            res.status(200).json({ rooms });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    };
    
    exports.deleteRoom = async (req, res) => {
        try {
            const userId = req.user._id;
            const { roomId } = req.params;
            
            const room = await Room.findOneAndDelete({ roomId, userId });
            
            if (!room) {
                return res.status(404).json({ message: 'Room not found or not authorized.' });
            }
    
            res.status(200).json({ message: 'Room deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    };
    

exports.saveSheetData = async (req, res) => {
  const { roomId, sheetData } = req.body;

  try {
    let sheet = await SheetData.findOne({ roomId });
    if (sheet) {
      sheet.data = sheetData;
    } else {
      sheet = new SheetData({ roomId, data: sheetData });
    }
    await sheet.save();
    res.status(200).json({ message: 'Sheet data saved successfully' });
  } catch (error) {
    console.error('Error saving sheet data:', error);
    res.status(500).json({ error: 'Failed to save sheet data' });
  }
};


exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getRoomPassword = async (req, res) => {
    const roomId = req.params.roomId;
    // console.log(roomId);
    
  
    try {
      const room = await Room.find({roomId});
    // console.log(room);
  
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
    //   console.log(room[0].password);
      
  
      // Assuming room document contains a password field
      res.status(200).json({ password: room[0].password });
    } catch (error) {
    //   console.error('Error fetching room password:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  