'use strict';

//how we build mocks in one to many
import faker from 'faker';
import Profile from '../../model/profile';
import { pCreateAccountMock, pRemoveAccountMock } from './account-mock';

const pCreateProfileMock = () => {
  const resultMock = {};
  
  return pCreateAccountMock()
    .then((accountSetMock) => {
      resultMock.accountSetMock = accountSetMock;

      return new Profile({
        bio: faker.lorem.words(10),
        avatar: faker.random.image(),
        lastName: faker.name.lastName(),
        firstName: faker.name.firstName(),
        account: accountSetMock.account._id, // this establishes the relationship!
      }).save();
    })
    .then((profile) => {
      resultMock.profile = profile;
      return resultMock;
    });
};
const pRemoveProfileMock = () => {
  return Promise.all([
    Profile.remove({}),
    pRemoveAccountMock(),
  ]);
};

export { pCreateProfileMock, pRemoveProfileMock };
// with default it means the whole thing, without means side by side to complete funcitons