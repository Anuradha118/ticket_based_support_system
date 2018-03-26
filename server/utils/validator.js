var responseGenerartor=require('./responsegenerator');
var validator=require('validator');
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
var response={};
// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces();

module.exports.signup=function(req,res,next){
    var body=req.body;
    // console.log(body);
    if(!body.firstname||!body.lastname||!body.email||!body.mobile||!body.password){
        response=responseGenerartor.generate(true,"All fields are mandatory",400,null);
        res.send(response);
    }else if(body.email && body.password){
        // if email is in proper format
        if(!validator.isEmail(body.email)){
            response=responseGenerartor.generate(true,"Please enter a valid email",400,null);
            res.send(response);  
        }else if(!schema.validate(body.password)){
            response=responseGenerartor.generate(true,'Password should be of minimum length of 8 and maximum length of 100. Must contain atleast one uppercase,lowercase, digit and should not contain spaces',400,null);
            res.send(response);
        }else{
            next();
        }
    }else{
        next();
    }
};

module.exports.login=function(req,res,next){
    var body=req.body;
    if(!body.email||!body.password){
         response=responseGenerartor.generate(true,"Email and Password are required",400,null);
        res.send(response);
    }else if(body.email){
        // if email is in proper format
        if(!validator.isEmail(body.email)){
             response=responseGenerartor.generate(true,"Please enter a valid email",400,null);
            res.send(response);  
        }else{
            next();
        }
    }else{
        next();
    }
};

module.exports.forgotPassword=function(req,res,next){
    var body=req.body;
    if(!body.email){
         response=responseGenerartor.generate(true,"Email is required",400,null);
        res.send(response);
    }else if(body.email){
        // if email is in proper format
        if(!validator.isEmail(body.email)){
            response=responseGenerartor.generate(true,"Please enter a valid email",400,null);
            res.send(response);  
        }else{
            next();
        }
    }else{
        next();
    }
};

module.exports.resetPassword=function(req,res,next){
    var body=req.body;
    if(!body.password){
        response=responseGenerartor.generate(true,"Password is required",400,null);
        res.send(response);
    }else{
        next();
    }
}