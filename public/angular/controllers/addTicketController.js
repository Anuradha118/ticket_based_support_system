myApp.controller('addTicketCtrl',['$location','$rootScope','TicketService','Upload',function($location,$rootScope,TicketService,Upload){

    var main=this;
    main.token=localStorage.getItem('x-auth');
    // console.log(process.env.NODE_ENV);
    //function called when raise ticket button is clicked
    main.createTicket=function(){
        main.isfileValid();
    };

    //check if the uploaded file is valid or not
    main.isfileValid=function(){
        if(main.file){
            main.upload(main.file);
        }else{
            main.addTicket();
        }
    };

    //if file is valid then it is uploaded
    main.upload=function(file){
        Upload.upload({
            url:'https://fathomless-ocean-24339.herokuapp.com/user/upload',
            data:{file:file}
        }).then(function(response){
            console.log(response);
            main.filename=response.data.data;
            main.addTicket();
        },function(response){
            console.log(response);
        },function(evt){
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            main.progress='progress: ' + progressPercentage + '% ';
        });
    };

    //after the file is uploaded then ticket is created
    main.addTicket=function(){

        var newTicket={
            title:main.title,
            description:main.description,
            filename:main.filename,
            token:main.token
        };

        TicketService.createTicket(newTicket)
            .then(function success(response){
                console.log(response);
                alert(response.data.message);
                $location.path('/dashboard');
            },function error(response){
                console.log(response);
            });
    };
}]);