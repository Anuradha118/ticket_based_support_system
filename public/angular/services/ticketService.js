myApp.service('TicketService', function ($http) {

    var main = this;
    // this.baseUrl = "http://localhost:3000";

    this.getUserTickets=function(token){
        return $http.get('/user/tickets', {
            headers: {
                'x-auth': token
            }
        });
    }; //end of getUserTickets

    this.getAllTickets=function(token){
        return $http.get('/user/admin/alltickets',{
            headers: {
                'x-auth': token
            }
        });
    }; // end of all tickets

    this.getSingleTicket=function(data){
        return $http.get('/user/ticket/' + data.ticketId, {
            headers: {
                'x-auth': data.token
            }
        });
    }; //end of getSingleTicket

    this.createTicket=function(data){
        console.log(data);
        return $http.post('/user/create',data,{
            headers:{
                'x-auth':data.token
            }
        });
    }; //end of createTicket

    this.changeStatus=function(data){
        var body={
            email:data.email,
            status:data.status
        };
        return $http.post('/user/ticket/changestatus/'+data.ticketId,body,{
            headers:{
                'x-auth':data.token
            }
        });
    }; //end of change status

    this.deleteTicket=function(data){
        return $http.delete('/user/deleteticket/'+data.id,{
            headers:{
                'x-auth':data.token
            }
        });
    }; //end of delete ticket

    this.userMessage=function(data){
        var message={
            message:data.message
        };
        return $http.post('/user/message/'+data.ticketId,message,{
            headers:{
                'x-auth':data.token
            }
        });
    }; // end of send user message

    this.adminMessage=function(data){
        var message={
            message:data.message
        };
        return $http.post('/user/admin/message/'+data.ticketId,message,{
            headers:{
                'x-auth':data.token
            }
        });
    }; //end of send admin message
});
