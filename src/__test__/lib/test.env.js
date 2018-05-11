process.env.NODE_ENV = 'development';
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.SOUND_CLOUD_SECRET = 'HynUc0hndJu1i0FjnUM9976KLMXHCffSXDYST9BYGhfIFjFvSJxeMXfRbyblMQpfStx5gXZew3r2YX1kmCay2NNpR2mM4ujzsZoq';

const isAwsMock = false;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCES_KEY = 'fakefakefakefakedfskfdsjkasdjkjkfdskljafjkfake';
  process.env.AWS_ACCES_KEY_ID = 'fakekeyinsidetestenv';
  require('./setup');
} else {
  // this block will then hit our REAL api resource if the isAwsMock is set to false
  // rmemeber to set .env vars and make sure you have a .gitignore
  // can do if you are ready to check the real thing, this will ref your actual .env file!
  // judy likes to do a first real post to API to confirm all is working, then reset to false to fine tune and add routes
  require('dotenv').config();
}

