<<<<<<< HEAD
const appError = require('./../utils/app-error');
const catchAsync = require('./../utils/catch-async');

const User = require('./../models/userModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new appError(
        'This route is not for password updates.Please use /updatePassword',
        400,
      ),
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getOneUser = (req, res) => {
  try {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  } catch (err) {
    console.log(err.message);
  }
};
exports.createUser = (req, res) => {
  try {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  } catch (err) {
    console.log(err.message);
  }
};
exports.updateUser = (req, res) => {
  try {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  } catch (err) {
    console.log(err.message);
  }
};
exports.deleteUser = (req, res) => {
  try {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  } catch (err) {
    console.log(err.message);
  }
};
=======
const appError = require('./../utils/app-error');
const catchAsync = require('./../utils/catch-async');

const User = require('./../models/userModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new appError(
        'This route is not for password updates.Please use /updatePassword',
        400,
      ),
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getOneUser = (req, res) => {
  try {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  } catch (err) {
    console.log(err.message);
  }
};
exports.createUser = (req, res) => {
  try {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  } catch (err) {
    console.log(err.message);
  }
};
exports.updateUser = (req, res) => {
  try {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  } catch (err) {
    console.log(err.message);
  }
};
exports.deleteUser = (req, res) => {
  try {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  } catch (err) {
    console.log(err.message);
  }
};
>>>>>>> 35b1c170158d3d3d55ec132a50c3b97ec1117b0a
