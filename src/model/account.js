'use strict';

// account because user is too often a keyword

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';// this does hahs
import crypto from 'crypto'; // this does big string
import jsonWebToken from 'jsonwebtoken';
import HttpError from 'http-errors';


const HASH_ROUNDS = 8;
// each time is exponentially slower-- inproduction it would be like 60+ or even 100+, for us, 8 is good, some computers might crash at 16 even
const TOKEN_SEED_LENGTH = 128; 


const accountSchema = mongoose.Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,

  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
});

// // now you try login, how I know u enter the right password?? // CODE FOR TOMROW
// function verifyPassword (password) {
//   //basically need to run same hash on it
//   // bcrypt method to compare two hashes
//   // important to note we never compare password to old password-- just to password HASH!
//   return bcrypt.compare(password, this.passwordHash)
//   .then((result)=> {
//     if(!result) {
//       throw new Error ('400', 'sneaky sneaky password error AUTH - incorrect data');
//       // error should be 401-- but beause this is password, error is sekret coded
//     }
//       return this;
//   })

// }


// this function to create a new token every time they login, not JUST when they signing up and we creating new accounts

function pCreateToken() {
  // ES5 funciton so this is scoped to object we in when call function
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((account) => {
    // now we have token seed!
    // sign is for our intents, 'encrypt'
    // .sign returns a promise that resolbes to a token -- so when it returns it sends a token
      return jsonWebToken.sign({ tokenSeed: account.tokenSeed }, process.env.SOUND_CLOUD_SECRET);
    });
  // TODO : error management
}

accountSchema.methods.pCreateToken = pCreateToken;
// this is where we are making an explicit connection

const Account = mongoose.model('account', accountSchema);

// now we say, instead of using your function to create, use ours!


Account.create = (username, email, password) => {
  // step one HASH using bcrypt
  /* Hash variables:
  SALT
  Hashing algo from bcrypt
  password 
  rounds */

  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      password = null;
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new Account({
        username,
        email,
        passwordHash,
        tokenSeed,
      }).save();
    });
};


export default Account;

// import is hash not password itself
// all caps conventions is to turn 'magic numbers' ie random changeable numbers in your code, into something a. SEMANTIC, like what is this and b. easy to find and change, ALLCAPS mostly applies to strings and numbers
