const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catch-async');
const appError = require('./../utils/app-error');
const sendEmail = require('./../utils/email.js');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email&passowrd exist
  if (!email || !password) {
    return next(new appError('Please provide email & password.', 400));
  }
  //checkif user exist
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, res);
  //check if password is correct

  //check if evrth is okey -> send token
});

exports.protect = catchAsync(async (req, res, next) => {
  //get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new appError('You are not logged in. Please log in to get access', 401),
    );
  }
  //validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new appError('The user belonging to token does no longer exists.', 401),
    );
  }
  // check if user changed password after the token was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new appError('User recently changed password.Please login again', 401),
    );
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array
    if (!roles.includes(req.user.role)) {
      return next(
        new appError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next(new appError('There is no user with this email adress.', 404));
  }
  //generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //send it to users email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 min).',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to email',
    });
  } catch (err) {
    user.passwordResetsToken = undefined;
    user.passwordResetsExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new appError(
        'There was an error sending an email. Try again later.',
        500,
      ),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user basen on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetsToken: hashedToken,
    passwordResetsExpires: { $gt: Date.now() },
  });
  //set new password if token is not expired and there is a user
  if (!user) {
    return next(new appError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetsToken = undefined;
  user.passwordResetsExpires = undefined;

  await user.save();
  //update changed passwordAt

  //log user in send jwt
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //get the user from the collection
  const user = await User.findById(req.user.id).select('+password');
  //check if password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new appError('Your current password is wrong', 401));
  }
  //if so -- update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //login the user
  createSendToken(user, 200, res);
});
