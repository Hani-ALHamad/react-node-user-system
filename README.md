# Basic User System (reactjs & nodejs)

# • Link: https://hani-user-system.herokuapp.com/

***• Features:*** 
- Signing up a new account, it does tell you how strong your password is and if the username is already taken or not.   
- Logging to an existing account, will store an auth token in both database and browser (HttpOnly secure cookie in your browser).   
- The ability to upload an avatar to the database, the ability to remove it too.   
- The ability to change the password for your existing account.   
- Logging out from your account, it will remove the current recently used token from the database too (avatars are stored as binary data).   
- All data are stored in a MongoDB database.   


***Packages and tech i used to make this app:***   
*• Frontend:*   
- Reactjs hooks: useState, useEffect, useContext.   
- React router.   
- Other Npm packages: validator, axios.

*• Backend:*   
- Nodejs: express, mongoose (MongoDB), REST APIs.   
- Other Npm packages: validator bcryptjs, jsonwebtoken, cookie-parser, bad-words, multer, sharp.   
- Npm packages i used for development only:  env-cmd, nodemon.   
   
      
      

![alt text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-user-system/main/signUp.jpg)


![alt text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-user-system/main/signIn.jpg)


![alt text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-user-system/main/loggedIn.jpg)


![alt text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-user-system/main/accountDetails.jpg)


![alt text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-user-system/main/accountDetailsSave.jpg)
