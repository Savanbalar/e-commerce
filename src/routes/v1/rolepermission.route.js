const express= require("express");
const {  rolePermissionController } = require("../../controllers");


const router = express.Router();

router.post('/create',rolePermissionController.createRolePermission);
router.get('/get',rolePermissionController.getRolePermission);
// router.put('/update/:_id',validate(orderValidation.updateValidation),orderController.updateOrder);
// router.delete('/delete/:_id',orderController.deleteOrder)
// router.post('/paymentImage',authosmiddlewares(),orderController.paymentImage);


module.exports = router;
