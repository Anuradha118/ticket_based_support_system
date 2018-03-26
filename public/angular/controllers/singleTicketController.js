myApp.controller('singleTicket',['$routeParams','$route','$location','$window','TicketService',function($routeParams,$route,$location,$window,TicketService){
    console.log($routeParams.ticketId);

    var main=this;
    // this.admin=false;
    this.token=localStorage.getItem('x-auth');
    this.ticketId=$routeParams.ticketId;
    var tckt={
        ticketId:main.ticketId,
        token:main.token
    };
    
    this.checkAdmin=function(){
        if(localStorage.getItem('user')==='admin@edSupport.com'){
            return true;
        }else{
            return false;
        }
    };

// function to called to get ticket details from server
    TicketService.getSingleTicket(tckt)
        .then(function success(response){
            console.log(response);
            main.ticket=response.data.data;
            main.email=response.data.data.email;
        },function error(response){
            console.log(response);
        });

    //function called when status of the ticket is changed 
    this.changeStatus=function(ticket){
        var changeStatus='';
        // console.log(ticket.status);
        if(ticket.status==='open'){
            changeStatus='close';
        }else{
            changeStatus='open';
        }
        var data={
            ticketId:ticket.ticketId,
            status:changeStatus,
            token:main.token,
            email:main.email
        }

        TicketService.changeStatus(data)
            .then(function success(response){
                console.log(response);
                alert(response.data.message);
                $location.path('/dashboard');
            }
            ,function error(response){
                console.log(response);
            })
    };

    //function called to delete the ticket
    this.deleteTicket=function(ticketId){
        var data={
            id:ticketId,
            token:main.token
        };

        TicketService.deleteTicket(data)
            .then(function success(response){
                console.log(response);
                alert(response.data.message);
                $location.path('/dashboard');
            },function error(response){
                console.log(response);
            })
    };

//check if the logged-in user is admin or not
    this.postMessage=function(ticketId){
        if(main.checkAdmin()){
            main.adminSend(ticketId);
        }else{
            main.userSend(ticketId);
        }
    };

    //function called when a user sends a message for a particular ticket
    this.userSend=function(ticketId){
        var data={
            message:main.message,
            ticketId:ticketId,
            token:main.token
        };

        TicketService.userMessage(data)
            .then(function success(response){
                console.log(response);
                $route.reload();
            },function error(response){
                console.log(response);
            })
    };

    //function called when admin sends a message for a particular ticket
    this.adminSend=function(ticketId){
        var data={
            message:main.message,
            ticketId:ticketId,
            token:main.token
        };

        TicketService.adminMessage(data)
        .then(function success(response){
            console.log(response);
            $route.reload();
        },function error(response){
            console.log(response);
        });
    };

    //function called when Go Back button is clicked
    this.goBack=function(){
        $window.history.back();
    };
    
}])