myApp.controller('userController',['$http','$q','$location','$rootScope','$timeout','UserService',function($http,$q,$location,$rootScope,$timeout,UserService){

    var main =this;

    this.firstName='';
    this.lastName='';
    this.email='';
    this.password='';
    this.mobile='';
    this.otp='';
    this.check='';
    this.signupMessage='Create an Account';
    this.isError='';
    this.signinMessage='Sign In to your Account';
    this.otpMessage='Enter the OTP sent to your registered mobile';
    this.closeButton='';
    $rootScope.show = false;
    this.newPassword='';
    this.confirmPassword='';
    this.changePassword='Enter a new password';

    // function called when user signup
    this.onSignUp=function(){
        
            var newUser={
                firstname:main.firstName,
                lastname:main.lastName,
                email:main.email,
                mobile:main.mobile,
                password:main.password
            };
    
            UserService.signUp(newUser)
                .then(function success(response){
                    // console.log(response);
                    main.signupMessage=response.data.message;
                    main.isError=response.data.error;
                },function error(response){
                    console.log(response);
                }
            );

        main.firstName='';
        main.lastName='';
        main.email='';
        main.mobile='';
        main.password='';
        main.isError='';
        main.signupMessage='';
    };

// function called when user signin
    this.onSignIn=function(){
        var data={
            email:main.email,
            password:main.password
        };

        UserService.signIn(data)
            .then(function success(response){
                console.log(response);
                main.signinMessage=response.data.message;
                if(response.data.error){
                    main.closeButton=response.data.error;
                    console.log('Error');
                }else{
                    $rootScope.show=true;
                    UserService.setData(response.data.data);
                    main.closeButton=response.data.error;
                    $location.path('/dashboard');
                }
            },function error(response){
                alert('Some Error Occurred!!');
            }
        );

        main.email='';
        main.password='';
    };

    //function called when user forget paasword
    this.forgotPassword=function(){
        var data={
            email:main.email
        }

        UserService.forgotPassword(data)
            .then(function success(response){
                console.log(response);
                main.email='';
            },function error(response){
                alert('Some Error Occurred!!');
            }
        );
    };

    //function called to verify otp
    this.verifyOtp=function(){
        var otp=main.otp;

        UserService.verifyOtp(otp)
            .then(function success(response){
                main.check=response.data.error;
                main.otpMessage=response.data.message;
                main.otp='';
            },function error(response){
                alert('Some Error Occurred!!');
            }
        );
    };

    //function called to rest password
    this.resetPassword=function(){
        if(main.newPassword!=main.confirmPassword){
            alert("Password didn't match!!");
            main.newPassword='';
            main.confirmPassword='';
        }else{
            var data={
                password:main.newPassword
            }

            UserService.resetPassword(data)
                .then(function success(response){
                    console.log(response);
                    main.changePassword=response.data.message;
                    main.resetButton=response.data.error;
                    main.newPassword='';
                    main.confirmPassword='';
                },function error(response){
                    alert('Some Error Occurred!!');
                }
            );
        }
    };

    //function called when user logout
    this.logout=function(){
        alert('You are now logged out!');
        localStorage.removeItem('user');
        localStorage.removeItem('x-auth');
        $rootScope.show = false;
        $location.path('/');
    }

}])