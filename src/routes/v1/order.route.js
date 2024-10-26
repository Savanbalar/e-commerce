const express= require("express");
const { orderController } = require("../../controllers");
const { authosmiddlewares } = require('../../middlewares/auths');
const  validate  = require("../../middlewares/validate");
const { orderValidation } = require("../../validations");


const router = express.Router();

router.post('/create',authosmiddlewares(),validate(orderValidation.createValidation),orderController.orderCreate);
router.get('/get',orderController.orderGet);
router.put('/update/:_id',orderController.updateOrder);
router.delete('/delete/:_id',orderController.deleteOrder)
router.post('/paymentImage',authosmiddlewares(),orderController.paymentImage);


module.exports = router;
