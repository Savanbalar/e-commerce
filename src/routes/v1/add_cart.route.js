const express = require('express');
const validate = require('../../middlewares/validate');
const { addCartController } = require('../../controllers');
const { addCartValidation } = require('../../validations');
const { authosmiddlewares } = require('../../middlewares/auths');

const router = express.Router();

router.post('/create',authosmiddlewares(true,false),validate(addCartValidation.createaddCart),addCartController.createaddCart);
router.get('/get',authosmiddlewares(),validate(addCartValidation.getaddCart),addCartController.getaddCart);
router.put('/update/:_id',validate(addCartValidation.updateaddCart),addCartController.updateaddCart);
router.delete('/delete/:_id',validate(addCartValidation.deleteaddCart),addCartController.deleteaddCart);

module.exports = router;