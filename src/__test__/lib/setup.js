'use strict';

import faker from 'faker';
import * as awsSDKMock from 'aws-sdk-mock';

// params = whatever options you passed into the orignial method (ie uploadOptions)

// awsSDKMock.mock('SERVICE NAME', 'METHOD', (params, callback) => )

awsSDKMock.mock('S3', 'upload', (params, callback) => {
  if (!params.Key || !params.Bucket || !params.Body || !params.ACL) {
    return callback(new Error('SETUP AWS UPLOAD MOCKERROR: req feilds missing!'));
  }
  if (params.ACL !== 'public-read') {
    return callback(new Error('SETUP AWS UPLOAD MOCKERROR: WRONG ACL'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AWS UPLOAD MOCKERROR: WRONG BUCKET'));
  }
  // this callback has err, data structure thus error = null, data = the fake data we want to send
  return callback(null, { Location: faker.internet.url() });
});

awsSDKMock.mock('S3', 'deleteObject', (params, callback) => {
  if (!params.Key || !params.Bucket) {
    return callback(new Error('SETUP AWS DELETE MOCKERROR:  key and bucket feilds missing!'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AWS DELETE MOCKERROR: WRONG BUCKET'));
  }
  // this callback has err, data structure thus error = null, data = the fake data we want to send
  return callback(null, 'successful deletion');
});
