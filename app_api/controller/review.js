var mongoose=require('mongoose')
var loc=mongoose.model('home')

module.exports.reviewscreate=function(req,res){
   var id= req.params.id;
   if (id){
      loc
         .findById(id)
         .select('reviews')
         .exec((err, location)=>{
            if (err){
               sendstatus(res,400, err)
            }else{
               location.reviews.push({
                  author: req.body.author,
                  rating: req.body.rating,
                  reviewtext: req.body.reviewtext
               })
               location.save((err, location)=>{
                  var thisreview
                  if (err){
                     sendstatus(res,400, err)
                  }else{
                     updateRating(location._id)
                     thisreview=location.reviews[location.reviews.length -1]
                     sendstatus(res, 201, thisreview)
                  }
               })
            }
         })
   }else
   sendstatus(res, 404, {"message":"location Id not found"})
}
module.exports.reviewsReadOne=function(req,res){
   if (req.params && req.params.id && req.params.reviewid) {
      loc
         .findById(req.params.id)
         .select('name reviews')
         .exec(function (err, location) {
            var  review, response;
            if (!location){
               sendstatus(res, 404, {"message": "couldnt find data"});
            } else if(err) {
               sendstatus(res, 404, err)
               return;
            }
            if (location.reviews && location.reviews.length > 0) {
               reviews = location.reviews[req.params.reviewid];
               if (!reviews) {
                  sendstatus(res, 404, {
                     "message": "reviewid not found"
                  });
               } else {
                  response = {
                     location: {
                        name: location.name,
                        id: req.params.id
                     },
                     review: reviews
                  };
                  sendstatus(res, 200, response);
               }
            } else {
               sendstatus(res, 404, {
                  "message": "No reviews found"
               });
            }
         }
         );
   } else {
      sendstatus (res, 404, {
         "message": "Not found, locationid and reviewid are both required"
      });
   }
};
module.exports.reviewsReadall=function(req,res){
   if (req.params && req.params.id) {
      loc
         .findById(req.params.id)
         .select('name reviews')
         .exec(function (err, location) {
            var  review, response;
            if (!location) {
               sendstatus(res, 404, {"message": "couldnt find data"});
               return;
            } else if (err) {
               sendstatus(res, 404, err);
               return;
            }
            if (location.reviews && location.reviews.length > 0) {
               reviews = location.reviews;
               if (!reviews) {
                  sendstatus(res, 404, {
                     "message": "reviewid not found"
                  });
               } else {
                  response = {
                     location: {
                        name: location.name,
                        id: req.params.id
                     },
                     review: reviews
                  };
                  sendstatus(res, 200, response);
               }
            } else {
               sendstatus(res, 404, {
                  "message": "No reviews found"
               });
            }
         }
         );
   } else {
      sendstatus (res, 404, {
         "message": "Not found, locationid and reviewid are both required"
      });
   }
};
module.exports.reviewsUpdateOne=function(req,res){
   if (req.params && req.params.id && req.params.reviewid) {
      loc
         .findById(req.params.id)
         .select('name reviews')
         .exec(function (err, location) {
            var  review, response;
            if (!location){
               sendstatus(res, 404, {"message": "couldnt find data"});
            } else if(err) {
               sendstatus(res, 404, err)
               return;
            }
            if (location.reviews && location.reviews.length > 0) {
               reviews = location.reviews[req.params.reviewid];
               if (!reviews) {
                  sendstatus(res, 404, {
                     "message": "reviewid not found"
                  });
               } else {
                  reviews.author=req.body.author;
                  reviews.rating=req.body.rating;
                  reviews.reviewtext=req.body.revewtext;
                  location.save((err, location)=>{
                     var thisreview
                     if (err){
                        sendstatus(res,400, err)
                     }else{
                        updateRating(location._id)
                        thisreview=location.reviews[req.params.reviewid]
                        sendstatus(res, 201, thisreview)
                     }
                  })
               }
            } else {
               sendstatus(res, 404, {
                  "message": "No reviews found"
               });
            }
         }
         );
   } else {
      sendstatus (res, 404, {
         "message": "Not found, locationid and reviewid are both required"
      });
   }
}
module.exports.reviewsDeleteOne=function(req,res){
   if (req.params && req.params.id && req.params.reviewid) {
      loc
         .findById(req.params.id)
         .select('reviews')
         .exec((err, location)=>{
            if (err){
               sendstatus(res, 404, {"message":"error"})
            }else if (!location){
               sendstatus(res, 404, {"message":"data does not exist"})
            }else{
               if (location.reviews && location.reviews.length > 0){
                  if (req.params.reviewid<location.reviews.length){
                     location.reviews.splice(req.params.reviewid, 1)
                     location.save((err, location)=>{
                        var thisreview
                        if (err){
                           sendstatus(res,400, err)
                        }else{
                           updateRating(location._id)
                           thisreview=location.reviews[location.reviews.length -1]
                           sendstatus(res, 201, null)
                        }
                     })
                  }
               }
            }
         })
   }
}

var updateRating=(x)=>{
   loc
      .findById(x)
      .select('rating reviews')
      .exec(
         function (err, location) {
            if (!err) {
               doSetAverageRating(location);
            }
         });
};
var doSetAverageRating = function (location) {
   var i, reviewCount, ratingAverage, ratingTotal;
   if (location.reviews && location.reviews.length > 0) {
      reviewCount = location.reviews.length;
      ratingTotal = 0;
      for (i = 0; i < reviewCount; i++) {
         ratingTotal = ratingTotal + location.reviews[i].rating;
      }
      ratingAverage = parseInt(ratingTotal / reviewCount, 10);
      location.rating = ratingAverage;
      location.save(function (err) {
         if (err) {
            console.log(err);
         } else {
            console.log("Average rating updated to", ratingAverage);
         }
      });
   }
};

var sendstatus=(res,status,content)=>{
   res.status(status);
   res.json(content);
}