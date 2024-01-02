const express = require("express");
const user_route = express();
const path = require("path");
const config = require("../config/config")
const session = require("express-session")
const auth = require("../middleware/auth")
const cartController = require('../controllers/cartController')
const orderController = require ('../controllers/orderController')
const addressController = require('../controllers/addressControler')
const couponController = require('../controllers/couponController')

user_route.use(express.json());
user_route.use(express.urlencoded({ extended: true }));


user_route.use(session({
    secret: config.sessionSecret ,
    resave: false, 
    saveUninitialized: true, 
  }));



user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');
const userController = require("../controllers/userController");
user_route.use('/css',express.static(__dirname+'public/css'))
user_route.use("/public", express.static("public", { "extensions": ["js"] }));

user_route.get('/',userController.loadLandingPage)
user_route.get('/register', userController.loadRegister);
user_route.post('/register', userController.insertUser);

user_route.get('/otp', userController.loadOtp);
user_route.post('/otp', userController.verifyOtp);
user_route.get('/resendOtp', userController.loadResendOtp);//
user_route.post('/resendOtp', userController.verifyResendOtp);//

user_route.get('/login',auth.isLogout, userController.loadLogin)
user_route.post('/login', userController.verifyLogin)

user_route.get('/landingHome', auth.isLogin, auth.isUserBlocked, userController.loadLandingPage);
user_route.get('/user',auth.isLogin, auth.isUserBlocked, userController.loadUserProfile)
user_route.post('/editUserDetails',auth.isLogin, auth.isUserBlocked,userController.updateUserProfile)

user_route.post('/add-billing-address',auth.isLogin, auth.isUserBlocked, addressController.addAddress)
user_route.post('/addAddress',auth.isLogin, auth.isUserBlocked,addressController.addAddressChekout)


user_route.get('/productsView',userController.loadProductsView)
user_route.get('/productDetails/:id',userController.loadProduct)
user_route.get('/logout',userController.logout)

user_route.get('/cart',auth.isLogin, auth.isUserBlocked,cartController.loadCart)
user_route.get('/add-to-cart/:id',auth.isLogin, auth.isUserBlocked,cartController.addToCart)
user_route.post('/updateCart',auth.isLogin, auth.isUserBlocked,cartController.updateCart)
user_route.get('/removeProduct',auth.isLogin, auth.isUserBlocked,cartController.removeProduct);  

user_route.get('/checkOut',auth.isLogin,orderController.loadCheckOut)

//checkout
user_route.get('/checkOut',auth.isLogin, auth.isUserBlocked,orderController.loadCheckOut);
user_route.post('/confirm-order',auth.isLogin, auth.isUserBlocked,orderController.confirmOrder);
user_route.get('/success-page',auth.isLogin, auth.isUserBlocked,orderController.loadSuccess)

user_route.get('/orderdetails',auth.isLogin, auth.isUserBlocked,orderController.orderdetails);
user_route.post('/applyCoupon', auth.isLogin, couponController.applyCoupon);


//change password
user_route.get('/forgot-password',userController.loadforgotPass)
user_route.post('/forgot-password',userController.forgotPass)

user_route.get('/resetPassword/:token',userController.loadResestPass);
user_route.post('/resetPassword',userController.resetPass)

module.exports = user_route;
