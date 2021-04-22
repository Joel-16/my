var express = require('express');
var router = express.Router();
var contlocation= require('../controller/location')
var contreview=require('../controller/review')
var ctrlauth= require('../controller/authentication')
var apioptions={server:'http://localhost:3000'};
if (process.env.NODE_ENV==='production'){
    apioptions.server=' https://papa-joe.herokuapp.com/'
}

// locations
router.get('/apiloc', contlocation.locations);
router.post('/apiloc', contlocation.locationscreate);
router.get('/apiloc/:id', contlocation.locationsReadOne);
router.patch('/apiloc/:id', contlocation.locationsUpdateOne);
router.delete('/apiloc/:id', contlocation.locationsDeleteOne);


// reviews
router.post('/apiloc/:id/reviews', contreview.reviewscreate);
router.get('/apiloc/:id/reviews/:reviewid', contreview.reviewsReadOne);
router.get('/apiloc/:id/reviews', contreview.reviewsReadall);
router.patch('/apiloc/:id/reviews/:reviewid', contreview.reviewsUpdateOne);
router.delete('/apiloc/:id/reviews/:reviewid', contreview.reviewsDeleteOne);

//authentication
router.post('/register', ctrlauth.register)
router.post('/login', ctrlauth.login)
router.get('/get', ctrlauth.get)
// router.delete('/delete', ctrlauth.delete)
module.exports=router;