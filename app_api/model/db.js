var mongoose = require('mongoose');
var gracefulShutdown;
var dburl= 'mongodb://localhost/my';
mongoose.connect(dburl, {
   useUnifiedTopology:true,
   useFindAndModify: false,
   useCreateIndex: true
});

var readLine = require("readline");
if (process.platform === "win32") {
   var rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout
   });
   rl.on("SIGINT", function () {
      process.emit("SIGINT");
   });
}

mongoose.connection.on('connected', function(){
   console.log('mongoose has now been connected to '+ dburl);
});
mongoose.connection.on('error', function(err){
   console.log('mongoose connection error '+ err);
});
mongoose.connection.on('disconnected', function(){
   console.log('mongoose disconnected '+ dburl );
});

gracefulShutdown = function (msg, callback) {
   mongoose.connection.close(function () {
      console.log('Mongoose disconnected through ' + msg);
      callback();
   });
};

// For app termination
process.on('SIGINT', function () {
   gracefulShutdown('app termination', function () {
      process.exit(0);
   });
});
// For Heroku app termination
process.on('SIGTERM', function () {
   gracefulShutdown('Heroku app shutdown', function () {
      process.exit(0);
   });
});
require('../../../my/app_api/model/locations')
require('../../../my/app_api/model/user')