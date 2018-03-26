var mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

var userSchema = new mongoose.Schema({

    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    password: {
        type: String
    }
});


userSchema.methods.generateToken=function(payload){
    // var user=this;
    var access='auth';
    var token=jwt.sign({payload,access},process.env.JWT_SECRET,{expiresIn:'1h'});
    return token;
};

userSchema.methods.isValidPassword=function(password,callback){
    var user=this;
    if (!user.password)
      return false;
    bcrypt.compare(password,user.password,function(err,valid){
        if(err){
            throw err;
        }else{
            return callback(valid);
        }
    });
}

userSchema.pre('save',function(next){
    var user=this;
    console.log('inside save');
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
        });
    }else{
        next();
    }
})

var User = module.exports = mongoose.model('User', userSchema);
