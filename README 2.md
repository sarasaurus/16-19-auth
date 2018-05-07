1. Client
POST req to /signup
- email
- user 
- password

2. SERVER
2.1 Hash password
    then delete
    if super concerned re security you would want to encrypt everything.... but that's slow s
2.2 Create a token seed

__TOKENS__
    REST is stateless-- cannot store any info in system
        so how deal? previously would have users send pssword everytime, but that's bad!
        __NOW__ we send back __TOKEN__ <-- token is like a password replacement
        Token is sent with every request and can be used to identify userss


## Dependencies
uses Node.js
__JWT__  to create tokens and crypto alogrithm, npm i jsonwebtoken 
__bCrypt__ for our hashing algorithm, npm i bcrypt
__crypto__ to create Random Strings, npm i 
__superagent__ sends rest request to an api

## AUTHENTICATION

