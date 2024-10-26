const express = require('express');
const { productController, CategoryController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { productValidation } = require('../../validations');
const { authosmiddlewares } = require('../../middlewares/auths');
// const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/create',authosmiddlewares(), CategoryController.createCategory);
router.get('/get', CategoryController.getCategory);
router.put('/update/:_id', CategoryController.updateCategory);
router.delete('/delete/:_id',CategoryController.deleteCategory);




module.exports = router;
