var mongoose= require('mongoose');
var crypto= require('crypto');
var jwt= require('jsonwebtoken')
var schema= mongoose.Schema

var userschema = new schema({
   email:{type: String,unique: true,required: true},
   name:{type: String, required:true},
   hash: String,
   salt:String,
})
userschema.methods.setpassword=(password)=>{
   this.salt=crypto.randomBytes(16).toString('hex');
   this.hash=crypto.pbkdf2Sync(password,this.salt,1000,64,"sha256").toString('hex')
}
userschema.methods.valid=(password)=>{
   hash=crypto.pbkdf2Sync(password,this.salt,1000,64, "sha256").toString('hex');
   return this.hash===hash;
}
userschema.methods.generateJwt=()=>{
   var expiry=new Date();
   expiry.setDate(expiry.getDate()+7);
   return jwt.sign({
      _id:this._id,
      email:this.email,
      name:this.name,
      exp: parseInt(expiry.getTime()/1000),
   },process.env.JWT_SECRET)
}
mongoose.model('user', userschema)