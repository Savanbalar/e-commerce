const express = require('express');
const { productController, productDetailsController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { productValidation } = require('../../validations');
const { authosmiddlewares } = require('../../middlewares/auths');
// const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/create', authosmiddlewares(), validate(productDetailsController.deleteProductDetails), productDetailsController.productDetailsCreate);
router.get('/get', validate(productDetailsController.getAllProductDetails), productDetailsController.getAllProductDetails);
router.put('/update/:_id', validate(productDetailsController.updateProductDetails), productDetailsController.updateProductDetails);
router.delete('/delete/:_id', validate(productDetailsController.deleteProductDetails), productDetailsController.deleteProductDetails);




module.exports = router;
