const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const roleRoute = require('./role.route');
const orderRoute = require('./order.route');
const addCartRoute = require('./add_cart.route');
const productRoute = require('./product.route');
const rolePermissionRoute = require('./rolepermission.route');
const categoryRoute = require('./category.route');
const reportsRoute = require('./reports.route');
const productDetailsRoute = require('./product_details.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/role',
    route: roleRoute,
  },
  {
    path: '/product',
    route: productRoute,
  },
  {
    path: '/product_Details',
    route: productDetailsRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/add_cart',
    route: addCartRoute,
  },
  {
    path: '/reports',
    route: reportsRoute,
  },
  {
    path: '/rolepermission',
    route: rolePermissionRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
