myApp.controller('mainCtrl', ['$location', '$rootScope', 'TicketService', function ($location, $rootScope, TicketService) {

    var main = this;
    this.tickets = '';
    this.status = '';
    this.search = '';

    //get username from localstorage
    main.username = localStorage.getItem('user');
    // console.log(main.username);

    //get jwt token from localstorage
    main.token = localStorage.getItem('x-auth');
    // console.log(main.token);

    //function called when user click on Raise Ticket button
    this.add = function () {
        $location.path('/addTicket');
        //alert("Matta");
    };

    //function called when user click on View button to get particular ticket details
    this.singleTicket=function(ticketId){
        $location.path('/ticketView/'+ticketId);
    };

    //function called when other users login to the system to view all the tickets raised by him
    this.userTickets = function () {
        TicketService.getUserTickets(main.token).then(function successCallback(response) {
            console.log(response);
            main.tickets = response.data.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    //function called when admin logins to view all tickets raised in te system
    this.allTickets = function () {
        TicketService.getAllTickets(main.token).then(function successCallback(response) {
            console.log(response.data.data);
            main.tickets = response.data.data;
            console.log(main.status);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    //check if the logged-in user is admin or not
    if (main.username === "admin@edSupport.com") {
        main.allTickets();
        main.admin = true;
    } else {
        main.userTickets();
        main.admin = false;
    }

}]);