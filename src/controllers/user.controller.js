const httpStatus = require("http-status");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs/dist/bcrypt");


const createUser = async (req, res) => {
    try {
    const body = req.body;
    const UserExist = await User.findOne({ fristName: body.fristName });
    
        if (UserExist) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: "user created successfully." })
        }
        body.password = await bcrypt.hash(body.password,8);
        body.ip = await req.ip;
        body.lastlogin = Date.now();
        const user1 = await User.create(req.body);
        return res.status(httpStatus.CREATED).send({ user1 })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}

const getUser = async(req,res) =>{
    try {
        const user1 = await User.find().populate(["roles"]);
        return res.status(httpStatus.OK).send({ user1 })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}

const updateUser = async(req,res) =>{
    try {
        const id = req.params._id;

        const UserExist = await User.findOne({_id : id});
        if (!UserExist) {
            return res.status(httpStatus.BAD_REQUEST).send({message :"user is not found"})
        }
        const user1 = await User.findOneAndUpdate({_id : id},req.body,{new : true})
        return res.status(httpStatus.CREATED).send({user1})
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}

const deleteUser = async(req,res) =>{
    try {
        const id = req.params._id;
        const UserExist = await User.findOne({_id : id});
        if(!UserExist){
            return res.status(httpStatus.BAD_REQUEST).send({message :"user is not found"})
        }
        const user1 = await User.findByIdAndDelete({_id : id})
        return res.status(httpStatus.CREATED).send({user1})
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}
module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser
}