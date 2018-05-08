
# Basic Authentication
**Author**: Sarah Bixler  
**Version**: 1.0.0  

### Overview
This application will enable users to make fully implemented CRUD requests to a RESTful API accessible database, that will store user account information (username, email, tokenSeed).  This Database will have basic security features-- the users password will be immediately hashed by __bCrpyt__ and will never be stored in its original form. A tokenSeed and token will be generated, that will allow the user to login after signing up and to stay 'logged in' for the duration of their token.
 
For now the main entry point is via the testing files:
1. open two tabs in your CLI/terminal
2. in one type: __npm run dbon__, which will start the Mongo database
3. in the other: __npm run test__, which will run the testing suite

### _In Development_
Ultimately the __POST__ route will take restful API requests to api/signup
http://localhost:3000/api/signup?username=_'blahblah'_ email=_'blah@blah.com'_ password=_'blah123'_


### Architecture
This application uses the __Node.js__ framework.  
__MongoDB__ is used for the database  
__mongoose__ is used to make javascript syntactical requests to the Mongo DataBase  
__express__ is used for routing  
__JSON Web Token__  is used for the encryption alogrithm, _npm i jsonwebtoken_  
__bCrypt__ is used for the hashing algorithm, _npm i bcrypt_  
__superagent__ parses JSON into query strings to make requests to the api in testing
__bodyParser__ re-parses api requests server side, turning the query string back into JSON 
__logger__ tracks and stores console logs  
__faker__ is used in testing to generate random strings  
__jest__ is the testing suite

### Change Log
05-07-2018 9:00am - Application now has a fully-functional account schema with password HASH and encryption for user authentication, as well as a restful POST route with tests

