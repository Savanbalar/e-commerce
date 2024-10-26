const { error } = require("winston");
const User = require("../models/user.model");
const { Permit, rolePermission } = require("../models");
const { verifyToken } = require("../services/token1.service");
const httpStatus = require("http-status");

const authosmiddlewares = (isRequried = true, isAuth = true) => {
  return async (req, res, next) => {
    if (isRequried) {
      let authorization = req.header("Authorization");

      if (authorization) {
        authorization = authorization.split(" ");
        try {
          const payload = await verifyToken(authorization[1]);
          // console.log(payload,"payload");
          
          const _user = await User.findOne({ _id: payload.user._id })
          if (!_user) {
            return res.status(401).json({ message: "Unauthorized" })
          }
          req.authUser = _user;
          return next();
        } catch (error) {
          return next(error);
        }
      }
      if (isAuth) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        return next();
      }
    }
    return next(error);
  }
}



const permissionAuth = (product, write) => {
  return async (req, res, next) => {

    const data1 = req.authUser.roles._id;
    

    const data = await Permit.findOne({ permitName: product });
    
    const valid = await rolePermission.findOne({ role_id: data1, [write]: true, permit_id: data._id });
    
    if (valid) {
      return next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
}


module.exports = {
  authosmiddlewares,
  permissionAuth

}