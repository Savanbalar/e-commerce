const express = require('express');
const validate = require('../../middlewares/validate');
const { userController } = require('../../controllers');
const { userValidation } = require('../../validations');

const router = express.Router();
router.post('/create',validate(userValidation.createUser),userController.createUser),
router.get('/get',validate(userValidation.getUser),userController.getUser);
router.put('/update/:_id',validate(userValidation.updateUser),userController.updateUser);
router.delete('/delete/:_id',validate(userValidation.deleteUser),userController.deleteUser);


module.exports = router;