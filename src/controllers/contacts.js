import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
} from '../services/contacts.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { isValidObjectId } from '../validation/validation.js';
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
// import { env } from '../utils/env.js';

export const getContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = {
    ...parseFilterParams(req.query),
    userId,
  };
  const contacts = await getContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  if (!isValidObjectId(contactId)) {
    next(createHttpError(400, 'Invalid contact ID'));
    return;
  }
  const contact = await getContactById({ contactId, userId });
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const { _id: userId } = req.user;

  let photoUrl;
  if (req.file) {
    try {
      photoUrl = await saveFileToCloudinary(req.file.buffer);
    } catch (error) {
      return next(error);
    }
  }

  const contactData = { ...req.body, userId, photo: photoUrl };
  const contact = await createContact(contactData);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await deleteContact({ contactId, userId });
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  let photoUrl;
  if (req.file) {
    photoUrl = await saveFileToCloudinary(req.file.buffer);
  }

  const contactData = { ...req.body, userId };
  if (photoUrl) contactData.photo = photoUrl;

  const contact = await updateContact({ contactId, userId }, contactData, {
    upsert: true,
    new: true,
  });

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  const status = contact.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully upserted a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  let photoUrl;
  if (req.file) {
    photoUrl = await saveFileToCloudinary(req.file.buffer);
  }

  const updateData = { ...req.body };
  if (photoUrl) {
    updateData.photo = photoUrl;
  }

  const contact = await updateContact({ contactId, userId }, updateData, {
    new: true,
  });

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact.contact,
  });
};
