myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $rootScope) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/index-view.html'
        })
        .when('/dashboard', {
            templateUrl: '/views/dashboard.html',
            resolve: {
                "check": function ($location, $rootScope,UserService) {
                    if (localStorage.getItem('user')===UserService.user) {
                        if (!UserService.isAuthenticated()) {
                            alert("Token Expired :(");
                            $location.path('/');
                            $rootScope.show = false;
                        } else {
                            $rootScope.show = true;
                        }

                    } else {
                        $location.path('/');
                        $rootScope.show = false;
                    }
                }
            },
            controller: 'mainCtrl',
            controllerAs: 'main'
        })
        .when('/ticketView/:ticketId', {
            templateUrl: '/views/single_ticket_view.html',
            controller: 'singleTicket',
            controllerAs: 'single',
            resolve: {
                "check": function ($location, $rootScope,UserService) {
                    if (localStorage.getItem('user')===UserService.user) {
                        if (!UserService.isAuthenticated()) {
                            alert("Token Expired :(");
                            $location.path('/');
                            $rootScope.show = false;
                        } else {
                            $rootScope.show = true;
                        }

                    } else {
                        $location.path('/');
                        $rootScope.show = false;
                    }
                }
            }
        })
        .when('/addTicket', {
            templateUrl: '/views/add_ticket.html',
            controller: 'addTicketCtrl',
            controllerAs: 'add',
            resolve: {
                "check": function ($location, $rootScope,UserService) {
                    if (localStorage.getItem('user')===UserService.user) {
                        if (!UserService.isAuthenticated()) {
                            alert("Token Expired :(");
                            $location.path('/');
                            $rootScope.show = false;
                        } else {
                            $rootScope.show = true;
                        }

                    } else {
                        $location.path('/');
                        $rootScope.show = false;
                    }
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });

}]);