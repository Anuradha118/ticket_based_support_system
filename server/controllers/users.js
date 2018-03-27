require('./../configs/config');
var router=require('express').Router();
var mongoose=require('./../db/mongoose');
var events=require('events');
var randomString=require('random-string');
var sendotp=require('sendotp');
var bcrypt=require('bcryptjs');
var nodemailer=require('nodemailer');
var _=require('lodash');
var User=require('./../models/User');
var responseGenerator=require('./../utils/responsegenerator');
var custValidator=require('./../utils/validator');
var eventEmitter = new events.EventEmitter();
var myResponse={};

//Event Emitter to send Welcome Email
eventEmitter.on('welcome_mail',function(data){
    console.log(data.email);
    console.log("Welcome " + data.firstname + " " + data.lastname);
    console.log(delete data.password);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.username,
            pass: process.env.password
        }
    });

    const email = {
        from: 'edSupport <adsahoo.24@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: 'Welcome to edSupport', // Subject line
        html: `<p>Hello! ${data.firstname} ${data.lastname} Your account is created successfully.</p>` // plain text body
    };

    transporter.sendMail(email, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log("huh " + info);
    });
});

//Event Emitter to send otp
eventEmitter.on('send_otp',function(info){

    // send otp to the registered mobile number and email address.
    const send_otp=new sendotp('204171AbIFqNi4305aae6ec7',"OTP for resetting the password is {{otp}}. Please donot share it with anybody");
    send_otp.send(info.mobile,"EdSupport",info.id,function(error,data,response){
        console.log(data);
    });
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.username,
            pass: process.env.password
        }
    });

    const email = {
        from: 'edSupport <adsahoo.24@gmail.com>', // sender address
        to: info.email, // list of receivers
        subject: 'Password Reset', // Subject line
        html: `<p>You have initiated a password reset.<br/>OTP for resetting the password : <b style="color:red">${info.id}</b>.Never share the OTP with anyone.</p>` // plain text body
    };

    transporter.sendMail(email, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log("huh " + info);
    });
});

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

//API to register
router.post('/register',custValidator.signup,function(req,res){
    User.findOne({
        'email':req.body.email
    },function(err,user){
        if(err){
            myResponse=responseGenerator.generate(true, "Some error", 500, null);
            res.send(myResponse);
        }else if(user){
            myResponse=responseGenerator.generate(true,'User alaready exist!',409,null);
            res.send(myResponse);
        }else{
            var user=new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                mobile: req.body.mobile,
                password:req.body.password
            });
            user.save().then(()=>{
                console.log('successfully saved');
                eventEmitter.emit('welcome_mail',user);
                myResponse=responseGenerator.generate(false,"Account created successfully! Now you can Login!!", 200, null);
                res.send(myResponse);
            }).catch((err)=>{
                myResponse=responseGenerator.generate(true,"Some error",500,null);
                res.send(myResponse);
            })
        }
    })
});

//API to login
router.post('/login',custValidator.login,function(req,res){
    var body=_.pick(req.body,['email','password']);
    User.findOne({'email':req.body.email},function(err,user){
        if(err){
            myResponse=responseGenerator.generate(true, "Some error", 500, null);
            res.send(myResponse);
        }else if(user==null){
            myResponse=responseGenerator.generate(true, "Invalid username", 409, null);
            res.send(myResponse);
        }else if(user){
            user.isValidPassword(body.password,function(valid){
                if(valid){
                    var payload=user.toObject();
                    delete payload.password;
                    var token=user.generateToken(payload);
                    myResponse=responseGenerator.generate(false,"Login Successful.",200,{user:user,token:token});
                    res.send(myResponse);
                }else{
                    myResponse=responseGenerator.generate(true,"Wrong Password or Password didn't match",403,null);
                    res.send(myResponse);
                }
            });
        }
    });
});

//API to reset-password
router.post('/reset-password', custValidator.resetPassword,function (req, res) {
    var password = req.body.password;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
            password=hash;
            console.log(req.session.email);
            User.findOneAndUpdate({
                email: req.session.email
            }, {
                $set: {
                    password: password
                }
            }, function (err, doc) {
                console.log(doc);
                if (err) {
                    myResponse = responseGenerator.generate(true, "Some Internal Error", 500, null);
                    res.send(myResponse);
                } else {
                    myResponse = responseGenerator.generate(false, "Password changed successfully", 200, null);
                    res.send(myResponse);
                }
            });
        });
    });
    
});

//API for forgot password
router.post('/forgot-password', custValidator.forgotPassword,function (req, res) {
    var email = req.body.email;
    req.session.email = email;
    req.session.shortid = randomString({length:4,numeric:true,letters:false,special:false});
    User.findOne({'email':email},function(err,user){
        if(err){
            console.log(err);
        }else{
            eventEmitter.emit('send_otp', {
                email: email,
                mobile:user.mobile,
                id: req.session.shortid
            });
            console.log("Forgot- " + req.session.shortid);
            var response = responseGenerator.generate(false, "OTP sent successfully to your registered mobile number", 200, req.session.shortid);
            res.json(response);
        }
    });
});

// API to verify the OTP
router.get('/verify-otp', function (req, res) {
    var id = req.query.otp;
    if (id === req.session.shortid) {
        myResponse = responseGenerator.generate(false, "Unique ID matched", 200, req.session.shortid);
        res.json(myResponse);
    } else {
        myResponse = responseGenerator.generate(true, "Unique ID didn't match", 400, null);
        res.json(myResponse);
    }
});

module.exports = router;