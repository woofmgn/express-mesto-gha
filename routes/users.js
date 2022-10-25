const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUser, editUser, editAvatar, getMeUser,
} = require('../controllers/users');

userRouter.use(auth);
userRouter.get('/users', auth, getUsers);
userRouter.get('/users/me', auth, getMeUser);
userRouter.get('/users/:id', auth, getUser);
userRouter.patch('/users/me', auth, editUser);
userRouter.patch('/users/me/avatar', auth, editAvatar);

module.exports = userRouter;
