import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post(
  '',
  uploadMiddleware,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.delete('/:contactId', ctrlWrapper(deleteContactController));
router.put(
  '/:contactId',
  uploadMiddleware,
  ctrlWrapper(upsertContactController),
);
router.patch(
  '/:contactId',
  uploadMiddleware,
  validateBody(createContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
