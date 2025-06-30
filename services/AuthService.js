const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const craeteToken = require("../utils/createToken");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = asyncHandler(async (req, res, next) => {
  // 1- create User
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  res.status(201).json({ data: user });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("Incorrect email", 401));
  }

  const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordCorrect) {
    return next(new ApiError("Incorrect Password", 401));
  }

  const token = craeteToken(user._id); 

  res.status(200).json({ data: user, token });
});


// @desc make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "You are not login , Please login to get access this rout",
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decoded.userid);
  if (!currentUser) {
    return next(
      new ApiError("The use that to this token dose no longer exist", 401)
    );
  }

  if (currentUser.passwordChangedAt) {
    const passChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his Passwrod. plaease login again...",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access reqgistered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to acccess this rout", 403)
      );
    }
    console.log("allowedTo"), next();
  });
