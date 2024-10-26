const config = require("../config/config");
const  jwt  = require('jsonwebtoken');

const generateToken = (user) =>{
  return new Promise((resolve,reject) =>{
    console.log(user);
      const payload ={
        user
      };
      
      const jwtData = jwt.sign(payload,config.jwt.secret);
      resolve({
        token: jwtData
      })
  })
}

const verifyToken = (token) =>{
  return new Promise((resolve,reject)=>{
    jwt.verify(token,config.jwt.secret,(err,decoded)=>{
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    })
  })
}

module.exports = {
  generateToken,
  verifyToken
}