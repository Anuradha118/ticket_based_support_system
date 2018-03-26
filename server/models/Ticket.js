var mongoose=require('mongoose');

var TicketSchema=new mongoose.Schema({
    ticketId:{
        type:String,
        required:true
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    status:{
        type:String,
        default:'open'
    },
    fileName:{
        type:String
    },
    userName:{
        type:String
    },
    email:{
        type:String
    },
    messages:[{
        sender:{
            type:String
        },
        message:{
            type:String
        },
        created:{
            type:Date,
            default:Date.now
        }
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }

});

var Ticket=module.exports=mongoose.model('Ticket',TicketSchema);