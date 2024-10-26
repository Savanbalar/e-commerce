const httpStatus = require("http-status");
const Role = require("../models/role.model");


const createRole = async (req, res) => {
    try {
    const body = req.body;
    const roleExist = await Role.findOne({ name: body.name });
    
        if (roleExist) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: "role created successfully." })
        }
        const role = await Role.create(body);
        return res.status(httpStatus.CREATED).send({ role })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}

const getRole = async(req,res) =>{
    try {
        const role = await Role.find();
        return res.status(httpStatus.CREATED).send({ role })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}

const updateRole = async(req,res) =>{
    try {
        const id = req.params._id;

        const roleExist = await Role.findOne({_id : id});
        if (!roleExist) {
            return res.status(httpStatus.BAD_REQUEST).send({message :"role is not found"})
        }
        const role = await Role.findOneAndUpdate({_id : id},req.body,{new : true})
        return res.status(httpStatus.CREATED).send({role})
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}

const deleteRole = async(req,res) =>{
    try {
        const id = req.params._id;
        const roleExist = await Role.findOne({_id : id});
        if(!roleExist){
            return res.status(httpStatus.BAD_REQUEST).send({message :"role is not found"})
        }
        await Role.findByIdAndDelete({_id : id})
        return res.status(httpStatus.BAD_REQUEST).send({message : "role deleted successfully" })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}
module.exports = {
    createRole,
    getRole,
    updateRole,
    deleteRole
}