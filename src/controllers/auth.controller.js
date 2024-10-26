const httpStatus = require('http-status');
const { User, Role } = require('../models');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { generateToken } = require('../services/token1.service');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const { sendResetPasswordEmail } = require('../services/email.service');
const { findOne, updateOne, findOneAndUpdate, findByIdAndUpdate } = require('../models/token.model');
const passport = require('passport');
const { email } = require('../config/config');
const { error } = require('winston');
const user = require('../models/user.model');
const { token } = require('morgan');

// const register = catchAsync(async (req, res) => {
//   const user = await userService.createUser(req.body);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.status(httpStatus.CREATED).send({ user, tokens });
// });


const register = async (req, res) => {
  try {
    const body = req.body;

    const userExits = await User.findOne({ email: body.email });

    if (userExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Email already taken" });
    }
    if (!body.roles) {
      const roleData = await Role.findOne({ name: "user" });
      body.roles = roleData._id;
    }
    body.password = await bcrypt.hash(body.password, 8);
    body.ip = await req.ip;
    body.lastlogin = Date.now();

    const user = await User.create(body);

    return res.status(httpStatus.CREATED).send({ user });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Interal Server Error"
    })
  }
}

const login = async (req, res) => {
  try {
    const body = req.body;

    const userExist = await User.findOne({ email: body.email }).populate(['roles']);

    if (!userExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "user not exist" });
    }
    const isValidPassword = await bcrypt.compare(body.password, userExist.password);

    if (!isValidPassword) {
      return res.status(httpStatus.BAD_REQUEST).send({ password: "password is incorrect" })
    }
    // console.log(userExist, "user");
    await User.findOneAndUpdate({ email: body.email }, { lastlogin: Date.now() }, { new: true })

    const tokenpay = {
      email: userExist.email,
      role: userExist.role,
      _id: userExist._id
    }
    

    const token = await generateToken(tokenpay);

    return res.status(httpStatus.OK).send({ user: userExist, token });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const body = req.body;
    const userData = await User.findOne({ email: body.email });
    if (userData) {
      var digit = '0123456789';
      var OTP = '';
      for (let i = 0; i < 4; i++) {
        OTP += digit[Math.floor(Math.random() * 10)];
      }
      await User.updateOne({ email: body.email }, { $set: { otp: OTP } });

      sendResetPasswordEmail(req.body.email, OTP);

      res.status(200).send({ message: "please check your inbox in email" })

    } else {
      res.status(200).send({ message: "this email dose not exist" })
    }
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

const verifyotp = async (req, res) => {
  try {
    const body = req.body;
    const data = await User.findOne({ email: body.email, otp: body.otp });
    if (!data) {
      res.status(httpStatus.BAD_REQUEST).send({ message: "otp wrong." });
    }
    const randomToken = randomstring.generate();

    await User.updateOne({ email: body.email }, { $set: { token: randomToken, otp: "" } });

    // return res.status(httpStatus.CREATED).send({ randomToken });

    res.status(200).send({ randomToken, message: "otp verify successfully" })

  } catch (error) {
    res.status(400).send({ message: error.message });

  }
}


const resetPassword = async (req, res) => {
  try {
    const body = req.body;
    const userExist = await User.findOne({ token: body.token });
    if (!userExist) {
      res.status(200).send({ message: "token not match" });
    }
    const newPassword = await bcrypt.hash(body.newPassword, 8);
    await User.findOneAndUpdate({ _id: userExist._id }, { $set: { password: newPassword, token: "" } }, { new: true });
    res.status(200).send({ message: "password update successfully" })
  } catch (error) {
    res.status(400).send({ message: error.message, error: "not work proper" });
  }
}







































// const logout = catchAsync(async (req, res) => {
//   await authService.logout(req.body.refreshToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const refreshTokens = catchAsync(async (req, res) => {
//   const tokens = await authService.refreshAuth(req.body.refreshToken);
//   res.send({ ...tokens });
// });

// const forgotPassword = catchAsync(async (req, res) => {
//   const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
//   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const resetPassword = catchAsync(async (req, res) => {
//   await authService.resetPassword(req.query.token, req.body.password);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const sendVerificationEmail = catchAsync(async (req, res) => {
//   const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
//   await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const verifyEmail = catchAsync(async (req, res) => {
//   await authService.verifyEmail(req.query.token);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  register,
  login,
  // logout,
  // refreshTokens,
  forgotPassword,
  verifyotp,
  resetPassword,
  // sendVerificationEmail,
  // verifyEmail,
};
