var passport=require('passport');
var local= require('passport-local').Strategy
var mongoose=require('mongoose')
var user= mongoose.model('user')

passport.use(new local({
      usernameField:'email'
   },
   function (username, password, done){
      user.findOne({email:username}, (err, userr)=>{
         if (err) {return done(err);}
         if (!userr) {
            return done (null,false,{message:'Incorrect username'})
         }
         if (!userr.valid(password)){
            return done (null, false, {
               message:'incorrect password'
            })
         }
         return done(null, userr)
      })
   }
))