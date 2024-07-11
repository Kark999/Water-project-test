import mongoose from 'mongoose';

export const isValidObjectId = (contactId) => {
  return mongoose.isValidObjectId(contactId);
};
