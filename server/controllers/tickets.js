require('./../configs/config');
var router=require('express').Router();
var mongoose=require('./../db/mongoose');
var events=require('events');
var fs=require('fs');
var randomString=require('random-string');
var multer=require('multer');
var nodemailer=require('nodemailer');
var configAuth=require('./../configs/auth');
var responseGenerator=require('./../utils/responsegenerator');
var authenticate=require('./../utils/authenticate');
var User=require('./../models/User');
var Ticket=require('./../models/Ticket');

var eventEmitter = new events.EventEmitter();
var myResponse={};

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

//API to upload files to the system
router.post('/upload',function(req,res){
    upload(req,res,function(err){
        if(err){
            console.log(err);
            res.json({error_code:1,error_desc:err});
            return;
        }
        console.log(req.file.filename);
        res.json({
            error_code:0,
            error_desc:null,
            data:req.file.filename,
        });
    });
});

//API to download files from the system
router.get('/download/:id',function(req,res){
    var file='server/uploads/' + req.params.id;
    if(fs.existsSync(file)){
        res.download(file);
    }else{
        res.send("<h2>404. File not found.<h2>");
    }
});

//storage to store uploaded files
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'server/uploads/');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

var upload=multer({
    storage:storage
}).single('file');

//Event Emitter to send mail on new query posted
eventEmitter.on('query_posted',function(newTicket){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.username,
                pass: process.env.password
            }
        });

        const mailOptions = {
            from: 'edSupport <anuradha.sahoo1993@gmail.com>', // sender address
            to: newTicket.email, // list of receivers
            subject: `Your query has been posted successfully`, // Subject line
            html: `<p>Hello,
                        your query with id <span style="color:red">${newTicket.ticketId}</span> has been posted successfully!!
                     </p>` // plain text body
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err);
            else
                console.log("huh " + info);
        });
});

//Event Emitter to send mail to user on ticket status change
eventEmitter.on('status_changed',function(data){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.username,
            pass: process.env.password
        }
    });

    var mails=[data.email,"anuradha.sahoo1993@gmail.com"];
    var mailList=mails.toString();
    var msg='';
    if(data.status=='open'){
        msg='reopened';
    }else{
        msg='closed';
    }
    const mailOptions = {
        from: 'edSupport <anuradha.sahoo1993@gmail.com>', // sender address
        to: mailList, // list of receivers
        subject: 'Status Changed!!', // Subject line
        html: `<p>Hello,
                    your query with id <span style="color:red">${data.id}</span> has been <span>${msg}</span></p>` // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log("huh " + info);
    });

});

//Event Emitter to send mail to admin when user sends a message for a particular query
eventEmitter.on('message-post',function(data){
    console.log(data);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.username,
            pass: process.env.password
        }
    });

    const email = {
        from: 'edSupport <anuradha.sahoo1993@gmail.com>', // sender address
        to: 'anuradha.sahoo1993@gmail.com', // list of receivers
        subject: 'Message from User', // Subject line
        html: `<p>Hello,
                    A new message has been received from User, regarding query with id <span style="color:red">${data}</span> Respond to resolve the query!
                </p>` // plain text body
    };

    transporter.sendMail(email, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log("huh " + info);
    });
});

//Event Emitter to send mail to user when admin sends message for a particular query
eventEmitter.on('admin-message',function(data){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.username,
            pass: process.env.password
        }
    });

    const email = {
        from: 'edTickets <anuradha.sahoo1993@gmail.com>', // sender address
        to: data.user, // list of receivers
        subject: 'Message from Admin', // Subject line
        html: `<p>Hello,
                A new message has been received from admin, regarding your query. Please login and check whether your query with id <span style="color:red"> ${data.id}</span>, is resolved or not.
             </p>` // plain text body
    };

    transporter.sendMail(email, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log("huh " + info);
    });
});

//To validate user authentication for all route
router.use(authenticate.authenticate);

//API to create new ticket
router.post('/create',function(req,res){
    var newTicket=new Ticket({
        ticketId:'TCKT'+randomString({length:8,numeric:true,letters:false,special:false}),
        email:req.user.email,
        userName:req.user.firstname+' '+req.user.lastname,
        title:req.body.title,
        description:req.body.description,
        fileName:req.body.filename
    });

    newTicket.save(function(err){
        if(err){
            myResponse=responseGenerator.generate(true,'Some error occurred',500,null);
            res.send(myResponse);
        }else{
            eventEmitter.emit('query_posted',newTicket);
            myResponse=responseGenerator.generate(false,"Ticket raised successfully and sent to admin!!",200,newTicket);
            res.send(myResponse);
        }
    })
});

//API to get all tickets for Admin
router.get('/admin/alltickets',function(req,res){
    // var status=req.body.status;
    Ticket.find({},function(err,tickets){
        if(err){
            myResponse=responseGenerator.generate(true,'Some error occurred',500,null);
            res.send(myResponse);
        }else{
            myResponse=responseGenerator.generate(false,"All tickets raised in the support system",200,tickets);
            res.send(myResponse) 
        }
    })
});

//API to get details of particular ticket
router.get('/ticket/:id',function(req,res){
    var ticketId=req.params.id;
    // console.log(ticketId);
    Ticket.findOne({'ticketId':ticketId},function(err,ticket){
        if(err){
            myResponse=responseGenerator.generate(true,'Some error occurred',500,null);
            res.send(myResponse); 
        }else{
            myResponse=responseGenerator.generate(false,"Ticket deatils for the ticket with id "+ticket.ticketId,200,ticket);
            res.send(myResponse); 
        }
    })
});

//API to get all tickets specific to user
router.get('/tickets',function(req,res){
    var email=req.user.email;
    Ticket.find({'email':email},function(err,tickets){
        if(err){
            myResponse=responseGenerator.generate(true,'Some error occurred',500,null);
            res.send(myResponse);
        }else{
            myResponse=responseGenerator.generate(false,"All tickets raised in the support system by you..",200,tickets);
            res.send(myResponse);
        }
    })
});

//API to chnage the status of particular ticket
router.post('/ticket/changestatus/:id',function(req,res){
    var data={
        id:req.params.id,
        email:req.body.email,
        status:req.body.status
    };

    Ticket.findOneAndUpdate({
        'ticketId':req.params.id
    },{
        $set:{
            status:req.body.status
        }
    },function(err,doc){
        if(err){
            myResponse=responseGenerator.generate(true,'Some error occurred',500,null);
            res.send(myResponse); 
        }else{
            console.log(data);
            eventEmitter.emit('status_changed',data);
            if(data.status=='open'){
            myResponse=responseGenerator.generate(false,'Your ticket has been reopened',200,null);                
            }else{
                myResponse=responseGenerator.generate(false,'Your ticket has been closed',200,null);
            }
            res.send(myResponse);
        }
    })
});

//API to delete a particular ticket
router.delete('/deleteticket/:id', function (req, res) {

    Ticket.findOneAndRemove({
        'ticketId': req.params.id
    }, function (err) {
        if (err) {
            myResponse=responseGenerator.generate(true,'Some error occurred',500,null);
            res.send(myResponse);
        } else {
            myResponse=responseGenerator.generate(false,'Your ticket has been deleted',200,null);
            res.send(myResponse);
        }
    });
});

//API called when user post message for particular ticket
router.post('/message/:id', function (req, res) {
    //var text = req.body.message;
    var message = {
        sender: req.user.firstname + ' ' + req.user.lastname,
        message: req.body.message
    };
    Ticket.findOneAndUpdate({
        'ticketId': req.params.id
    }, {
        $push: {
            'messages': message
        },
    }, function (err,ticket) {
        if (err) {
            myResponse=responseGenerator.generate(true,'Some error occurred',500,null);
            res.send(myResponse);
        } else {
            console.log(ticket);
            eventEmitter.emit('message-post', req.params.id);
            myResponse=responseGenerator.generate(false,'Someone just replied to your query',200,null);
            res.send(myResponse);
        }
    });
});

//API called when admin post a message for a particular ticket
router.post('/admin/message/:id', function (req, res) {

    var data = {
        user: req.body.username,
        id: req.params.id
    };
    // console.log(data);

    var message = {
        sender: "Admin",
        message: req.body.message
    };

    Ticket.findOneAndUpdate({
        'ticketId': req.params.id
    }, {
        $push: {
            'messages': message
        },
    }, function (err) {
        if (err) {
            myResponse=responseGenerator.generate(true,'Some error occurred',500,null);
            res.send(myResponse);
        } else {
            //console.log(result)
            eventEmitter.emit('admin_reply', data);
            myResponse=responseGenerator.generate(false, "Message Sent", 200, null);
            res.send(myResponse);
        }
    });
});

module.exports = router;






