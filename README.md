
## Feature Tasks  
For this assignment you will be building a RESTful HTTP server with basic authentication using express.

#### Account
Create a user `Account` model that keeps track of a username, email, hashed password, and token seed. The model should be able to regenerate tokens using json web token. 

#### Server Endpoints
* `POST /signup` 
  * pass data as stringifed JSON in the body of a **POST** request to create a new account
  * on success respond with a 200 status code and an authentication token
  * on failure due to a bad request send a 400 status code

## Tests
* POST should test for 200, 400, and 409 (if any keys are unique)

## Documentation
In the README.md write documentation for starting your server and making requests to each endpoint it provides. The documentation should describe how the server would respond to valid and invalid requests.
