var mongoose=require('mongoose');
var schema= mongoose.Schema;
var reviewSchema = new schema({
   author: String,
   rating: {type: Number, min: 0, max: 5},
   reviewtext: String,
   createdOn: {type: Date, default: Date.now}
   });
var openingTimes = new schema({
   days: {type: String},
   opening: String,
   closing: String,
   closed: {type: Boolean}
   });
var homeschema=new schema({
   _id:Number,
   name: {type:String, required:true},
   address: {type:String, required:true},
   rating: {type:Number, "default" :0, min:0, max:5},
   facilities: [String],
   distance:{type:[Number], index:'2dsphere'},
   openingTimes: [openingTimes],
   reviews: [reviewSchema],
});
mongoose.model('home',homeschema, 'homes')