import { getCurrentUser, registerUser, updateUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { THIRTY_DAYS, FIFTEEN_MINUTES } from '../constants/index.js';
import { logoutUser } from '../services/auth.js';
import { refreshUsersSession } from '../services/auth.js';
import { requestResetToken } from '../services/auth.js';
import { resetPassword } from '../services/auth.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.json(201, {
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + FIFTEEN_MINUTES),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password was successfully reset.',
    data: {},
  });
};
export const getCurrentUserController = async (req, res) => {
  const user = await getCurrentUser(req.user._id);
  res.json({
    status: 200,
    message: 'Successfully retrieved user information!',
    data: user,
  });
};
export const updateUserController = async (req, res) => {
  let photoUrl;
  if (req.file) {
    photoUrl = await saveFileToCloudinary(req.file.buffer);
  }

  const updateData = { ...req.body };
  if (photoUrl) {
    updateData.avatar = photoUrl;
  }
  const updatedUser = await updateUser(req.user._id, updateData);

  res.json({
    status: 200,
    message: 'User data updated successfully!',
    data: updatedUser,
  });
};
