var passport= require('passport')
var mongoose=require('mongoose')
var User= mongoose.model('user')

module.exports.get=(req,res)=>{
   User
      .find({})
      .exec((err,ans)=>{
         if (err){
            sendstatus(res, 404, err)
         } else{
            sendstatus(res, 200, ans)
         }
      })
}

module.exports.register=(req,res)=>{
   if (!req.body.name || !req.body.email || !req.body.password){
      sendstatus(res, 400, {'message':'all fields required'})
   return;
   }

   var user= new User();
   user.name=req.body.name
   user.email=req.body.email
   user.setpassword(req.body.password)
   user.save((err)=>{
      var token
      if (err){
         sendstatus(res, 404, err)
      }else{
         token=user.generateJwt()
         sendstatus(res, 200, {'token':token})
      }
   })
}

module.exports.login=(req,res)=>{
   if (!req.body.email || !req.body.password){
      sendstatus(res, 400, {'message':'all fields required'})
   return;
   }
   passport.authenticate('local',(err, user, info)=>{
      var token
      if (err){sendstatus(res, 404, err)}
      if (user){
         console.log("user found")
         token=user.generateJwt();
         sendstatus(res, 200, {'token':token})
      }else{
         sendstatus(res, 401, info)
      }
   })(req, res)
}
// module.exports.delete=(req, res)=>{
//    if (req.body.email) {
//       User
//          .findOneAndDelete({email:req.body.emai})
           
//    } else {
//       sendstatus(res, 404, {
//          "message": "No locationid"
//       });
//    }

// }
var sendstatus=(res, status, content)=>{
   res.status(status)
   res.json(content)
}