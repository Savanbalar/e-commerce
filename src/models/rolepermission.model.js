const { types } = require('joi');
const mongoose = require('mongoose');

const rolePermissionSchema = mongoose.Schema(
  {
    role_id: {
      type :mongoose.Schema.Types.ObjectId,
      ref : 'role'
    },
    permit_id:{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'permit'
    },
    read :{
      type : Boolean,
      require : true,
      default : false
    },
    write:{
      type :Boolean,
      require : true,
      default : false
    },
    update :{
      type:Boolean,
      require : true,
      default : false
    },
    delete : {
      type : Boolean,
      require : true,
      default : false
    }
  },
  {
    timestamps : true,
  }
)
const Permission = mongoose.model ('rolepermission',rolePermissionSchema,'rolepermissions')
module.exports = Permission;
