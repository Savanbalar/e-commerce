const express = require('express');
const validate = require('../../middlewares/validate');
const { roleController } = require('../../controllers');
const { roleValidation } = require('../../validations');
const { authosmiddlewares } = require('../../middlewares/auths');


const router = express.Router();
router.post('/create',authosmiddlewares(),validate(roleValidation.createRole),roleController.createRole),
router.get('/get',roleController.getRole);
router.put('/update/:_id',validate(roleValidation.updateRole),roleController.updateRole);
router.delete('/delete/:_id',validate(roleValidation.deleteRole),roleController.deleteRole);


module.exports = router;