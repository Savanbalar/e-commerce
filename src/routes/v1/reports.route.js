const express = require('express');
const { reportsController } = require('../../controllers');
// const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/get', reportsController.productSelling);
router.get('/category', reportsController.categoryReport);
router.get('/last', reportsController.last_3month);



module.exports = router;
