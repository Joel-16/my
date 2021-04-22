var express = require('express');
var router = express.Router();
var cont= require('../controller/cont')

/* GET home page. */
router.get('/',cont.homepage )
router.get('/location', cont.location)
router.get('/location/:id', cont.readone)
router.get('/location/review/new', cont.review)
router.get('/about', cont.about)



module.exports = router;
