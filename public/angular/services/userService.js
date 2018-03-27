myApp.service('UserService', function ($http,$window,jwtHelper) {

    var main = this;
    var store=$window.localStorage;
    var authToken='';
    var user='';
    // this.baseUrl = "http://localhost:3000";

    this.signUp = function (data) {

        return $http.post('/register', data);

    }; // end registering user account

    this.signIn = function (data) {

        return $http.post('/login', data);

    }; //end Login to Account

    this.forgotPassword = function (data) {

        return $http.post('/forgot-password', data);

    }; //end forgot password email intake

    this.verifyOtp = function (data) {

        return $http.get('/verify-otp', {
            params: {
                otp: data
            }
        });
    }; //end verifying unique id

    this.resetPassword = function (data) {

        return $http.post('/reset-password', data);

    }; //end of reset-password

    this.setData=function(data){
        if(data){
            main.authToken=data.token;
            main.user=data.user.email;
            store.setItem('user',data.user.email);
            store.setItem('x-auth',data.token);
        }
    }; // end of set-token

    this.getData=function(){
         var data={
             user:store.getItem('user'),
             token:store.getItem('x-auth')
         };
         return data;
    }; // end of get-token

    this.isAuthenticated=function(){
        var token=store.getItem('x-auth');
        return (token===main.authToken || jwtHelper.isTokenExpired(token));
    }; // check if user is authenticated or not

}); //end account service