var mongoose=require('mongoose')
var loc=mongoose.model('home')

module.exports.locationscreate=function(req,res){
   loc
      .create({
         _id: req.body._id,
         name: req.body.name,
         address: req.body.address,
         facilities: req.body.facilities.split(","),
         distance: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
         openingTimes: {
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1,
         }
         }, function (err, location) {
            if (err) {
               sendstatus(res, 400, err);
            } else {
               sendstatus(res, 201, location);
            }
      });
}
module.exports.locations=function(req,res){
   loc
      .find({})
      .exec((err,ans)=>{
         if (err){
            sendstatus(res, 404, err)
         } else{
            sendstatus(res, 200, ans)
         }
      })
   /*sendstatus(res, 200, {"status":"success"})*/
}
module.exports.locationsReadOne=function(req,res){
   if (req.params && req.params.id) {
      loc
         .findById(req.params.id)
         .exec(function (err, location) {
            if (!location) {
               sendstatus(res, 404, {
                  "message": "couldnt find data"
               });
               return;
            } else if (err) {
               sendstatus(res, 404, err);
               return;
            }
            sendstatus(res, 200, location);
         });
   } else {
      sendstatus(res, 404, {
         "message": "no id found"
      });
   }
};
module.exports.locationsUpdateOne=function(req,res){
   if (req.params && req.params.id) {
      loc
         .findById(req.params.id)
         .select ('-reviews -rating')
         .exec(
            function (err, location) {
               location.name = req.body.name;
               location.name = req.body.name;
               location.address = req.body.address;
               location.facilities = req.body.facilities.split(",");
               location.coords = [parseFloat(req.body.lng),parseFloat(req.body.lat)];
               location.openingTimes = [{
                  days: req.body.days1,
                  opening: req.body.opening1,
                  closing: req.body.closing1,
                  closed: req.body.closed1,
               }];
               location.save(function (err, location) {
                  if (err) {
                     sendstatus(res, 404, err);
                  } else {
                     sendstatus(res, 200, location);
                  }
               });
            }
         );
   } else{
         sendstatus(res, 404, {"message": "no id found"});
   };
}
module.exports.locationsDeleteOne = function (req, res) {
   var locationid = req.params.locationid;
   if (locationid) {
      Loc
         .findByIdAndRemove(locationid)
         .exec(
            function (err, location) {
               if (err) {
                  sendstatus(res, 404, err);
                  return;
               }
               sendJsonResponse(res, 204, null);
            }
         );
   } else {
      sendstatus(res, 404, {
         "message": "No locationid"
      });
   }
};


var sendstatus=(res,status,content)=>{
   res.status(status);
   res.json(content);
}