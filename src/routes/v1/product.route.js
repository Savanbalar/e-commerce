const express = require('express');
const { productController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { productValidation } = require('../../validations');
const { authosmiddlewares, permissionAuth } = require('../../middlewares/auths');
// const { isAdmin } = require('../../utils/validateFIle');
// const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/create',authosmiddlewares(),permissionAuth("product","write"), productController.productCreate);
router.get('/get',authosmiddlewares(true,false),permissionAuth("product","read"),validate(productValidation.getProduct), productController.getAllProduct);
router.put('/update/:_id',validate(productValidation.updateProduct),productController.updateProductById);
router.delete('/delete/:_id', validate(productValidation.deleteProduct),productController.deleteProductById);
router.post('/search',productController.searchProduct);




module.exports = router;
