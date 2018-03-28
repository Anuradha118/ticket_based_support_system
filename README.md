# edSupport, A ticket based support system.

# Project Description

Support is an essential feature for any platform, and dedicated support is
best approach in case you are really concerned about the user experience
of your platform.
The aim of the project is to create an online ticket based support system for any platform, 
to get the queries from their users and get it resolved.

# Features

1. User Registration.
    - On signup a welcome mail is send to the user registered email id.
    - User password is saved in hash form.
2. User Login.
3. User is authenticated using JWT.
4. User raise a ticket in the system realted to his/her query.
5. User can upload a file related to his query.
6. User can have chat like communication with the Admin.
7. User can change the status of the ticket to 'close' or 'open' depending on whether the query is resolved or not.
    - On status change, an notification email is sent to the user and admin.
8. For Admin access to the system, one should signup with the 'admin@edSupport.com' email address.
9. Admin can view all the tickets raised in the support system.
10. Admin can also filter the tickets based on the status.
11. Admin can delete the ticket from the system.
12. Admin have chat like communication with the User.

# Additional Features
  - On Status change of ticket, an email notification is sent to the user.
  - When the user receives the answer or the admin receives the reply, an email notification is sent to the user concerned.
  - For the sake of simplicity, the Admin treated as a user of the system.
  - To reset password if user forgot, an otp is sent to the registered mobile number.
  - User can upload file.
  - Admin can download the file from the ticket.
  - To send email 'nodemailer-sendgrid-transport' service is used.
  
# Pre-Requisites
  - Node.js should be installed.
  - MongoDB should be installed.
  - NPM should be installed.
  - Sendgrid Username and Password should be there 
  
# App Installation

Setting up local server
First run the local mongodb server, then add config.json inside server->configs with all the environment variables like PORT, JWT_SECRET,MONGODB_URI,SENDGRID_USER and SENDGRID_SECRET to send emails.

  - Download the code from github.
  - Unzip the folder 
  - Open command prompt from the unzipped folder
  - Run command: npm install to install all the packages
  - Run command: node server/server.js
  - The local server will start with the mentioned port

# How to use the app

  - Visit http://localhost:{{PORT}} on your browser
  - Click on the SignIn tab present at the top right corner.
  - Click on the Register option, to create an account in the system.
  - Once you sucessfully register, login to the system with correct credentials.
  
  User Facing View:

  - Once successful login, user can see the dashboard page with no tickets, as you are new user.
  - User can raise a ticket, by clicking on 'Raise a Ticket' button.
  - After successfully creating a ticket, user will be redirected to the dashboard page, with all tickets raised by him.
  - User can View the ticket details by clicking on 'View/Reply' button present in dashboard page.
  - User can see all the details related to particular query.
  - User can have direct chat with the Admin of the system through the chat panel present in the view.
  - User can download the file uploaded by him/her at the time of ticket creation.
  - User can close the ticket if his/her query is resolved or can open if the query is not resolved.
  - User can reset the password securely, if he/she forgets it.
  
  Admin Facing View:
  
  - Once user signup and login with 'admin@edSupport.com' email, user will have admin access.
  - Admin can view all the tickets raised in the system.
  - Admin can filtered out the tickets based on the status.
  - Admin can view/reply to a particular ticket, can have direct conversation with user regarding query from chat panel.
  - Admin can change the status of the ticket.
  - Admin can download the file uploaded by user.
  - Admin can reset the password, if he/she forgets it.
  
# Developed with:
  - MongoDB
  - ExpressJS
  - AngularJS
  - NodeJS
  
  
# Developed By:
  Anuradha Sahoo
  
  
  
  
  
    
