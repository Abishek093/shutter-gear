const express = require("express");
const user_route = express();
const path = require("path");
const config = require("../config/config")
const session = require("express-session")
const auth = require("../middleware/auth")
const cartController = require('../controllers/cartController')
const orderController = require ('../controllers/orderController')
const addressController = require('../controllers/addressControler')
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

user_route.get('/login', userController.loadLogin)
user_route.post('/login', userController.verifyLogin)

user_route.get('/landingHome',userController.loadLandingPage)
user_route.get('/user',userController.loadUserProfile)

user_route.post('/add-billing-address',addressController.addAddress)

user_route.get('/productsView',userController.loadProductsView)
user_route.get('/productDetails/:id',userController.loadProduct)
user_route.get('/logout',userController.logout)

user_route.get('/cart',cartController.loadCart)
user_route.get('/add-to-cart/:id',cartController.addToCart)
user_route.post('/updateCart',cartController.updateCart)

user_route.get('/checkOut',orderController.loadCheckOut)

//checkout
user_route.get('/checkOut',orderController.loadCheckOut);
user_route.post('/confirm-order', orderController.confirmOrder);
user_route.get('/success-page',orderController.loadSuccess)

user_route.get('/orderdetails',orderController.orderdetails);

module.exports = user_route;
