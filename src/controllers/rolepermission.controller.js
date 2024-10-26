const httpStatus = require("http-status");
const { rolePermission, Permit } = require("../models");


// const createRolePermission = async (req, res) => {
//   try {
//     const { data, ...body } = req.body;

//     const permission = await Permit.create(body);

//     await data.forEach(async (item) => {

//       item.permit_id = permission._id;

//       await rolePermission.create(item);

//     });

//     return res.status(httpStatus.OK).send({ permission })

//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
//   }
// }

const createRolePermission = async (req, res) => {
  try {
    const { data, ...body } = req.body;
    console.log(data, "data");


    const permition = await Permit.findOne({ name: body.name });
    console.log(permition,"permition");
    
    if (permition) {
      await data.forEach(async (item, index) => {
        item.permit_id = permition._id;
        console.log(item,"item");
        
        await rolePermission.create(item);
        return res.status(httpStatus.CREATED).send({message :"created successfully." })

      })
    } else {
      const permit = await Permit.create(body);
      

      await data.forEach(async (item, index) => {
        item.permit_id = permit._id;

        await rolePermission.create(item);
        return res.status(httpStatus.CREATED).send({message :"created successfully." })
      })
    }

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const getRolePermission = async (req, res) => {
  try {
    const permission = await Permit.find();
    return res.status(httpStatus.CREATED).send({ permission });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}


module.exports = {
  createRolePermission,
  getRolePermission
};
