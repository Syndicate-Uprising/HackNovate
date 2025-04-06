const express = require('express');
const { createRoom, getRooms,deleteRoom,saveSheetData,getProfile, joinRoom,getRoomPassword} = require('../controllers/roomcontroller');
const { isauth } = require('../middleware/isauth');
const router = express.Router();


router.post('/create',  isauth,createRoom);

router.get('/getrooms',isauth,  getRooms);

router.get('/roomid/:roomId', isauth, getRoomPassword);

router.delete('/:roomId', isauth, deleteRoom);

router.post('/save',saveSheetData)

router.get('/profile', isauth, getProfile);

router.post('/join',isauth,joinRoom  )

module.exports = router;
