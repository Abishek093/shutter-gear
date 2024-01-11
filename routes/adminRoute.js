const err = require('../middleware/err'); // Assuming err.js is in the same directory
const express = require("express");
const admin_route = express();
const path = require("path");
const config = require("../config/config");
const session = require("express-session");
const { categoryUpload, productUpload } = require('../utils/multer');
const bodyParser = require('body-parser');

//controllers
const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController");
const productController = require('../controllers/productController')
const customerController = require('../controllers/customerController')
const orderController = require('../controllers/orderController')
const salesReportController = require('../controllers/salesReoportController')
const couponController = require('../controllers/couponController')
const auth = require("../middleware/adminAuth")

admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));


admin_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
}));

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

//Admin
admin_route.get('/', auth.isLogout, adminController.loadLogin);
admin_route.get('/adminlogin',auth.isLogout, adminController.loadLogin);
admin_route.post('/', adminController.verifyLogin);
admin_route.get('/dashboard', auth.isLogin, adminController.loadDashboard); 

//Category
admin_route.get('/category',auth.isLogin, categoryController.loadCategory)
admin_route.get('/add-new-category',auth.isLogin, categoryController.loadNewCategory)
admin_route.post('/add-new-category',auth.isLogin, categoryUpload.single('image'), categoryController.AddNewCategory)
admin_route.get('/listcategory/:id', auth.isLogin, categoryController.deleteCategory)
admin_route.get('/edit-category/:id', auth.isLogin, categoryController.loadEditCategory)
admin_route.post('/edit-category/:id',auth.isLogin, categoryUpload.single('image'),categoryController.editCategory);

//Product
admin_route.get('/products',auth.isLogin, productController.loadProduct)
admin_route.get('/addnewProduct',auth.isLogin, productController.loadNewProduct)
admin_route.post('/addnewProduct', auth.isLogin, err,productUpload.array('image'), productController.addProduct)
admin_route.get('/editProduct/:id',auth.isLogin,productController.loadEditProduct)
admin_route.post('/editProduct/:id', auth.isLogin,productUpload.array('image'), productController.editProduct)
admin_route.get('/listProduct/:id', auth.isLogin,productController.deleteProduct)
admin_route.get('/delete-image/:id/:img',auth.isLogin, productController.deleteImage);

//customer
admin_route.get('/userDetails',auth.isLogin,customerController.loaduserDetails)
admin_route.get('/blockuser', customerController.blockUser);

//order list
admin_route.get('/orderList',auth.isLogin,orderController.loadOrderList)
admin_route.get('/orderDetails',auth.isLogin,orderController.loadOrderDetails)
admin_route.post('/ChangeOrderStatus',auth.isLogin,orderController.orderStatus);

//sales report
admin_route.get('/salesReport', auth.isLogin,salesReportController.loadReport);
admin_route.get('/download-pdf',auth.isLogin, salesReportController.downloadPdf);
admin_route.get('/download-excel', auth.isLogin,salesReportController.downloadExcel);


admin_route.get("/sales-data", auth.isLogin,adminController.getSalesData);
admin_route.get("/sales-data/weekly",auth.isLogin, adminController.getSalesDataWeekly);
admin_route.get("/sales-data/yearly",auth.isLogin, adminController.getSalesDataYearly);

admin_route.get('/addnewCoupon',auth.isLogin, couponController.loadNewCoupon)
admin_route.post('/addnewCoupon',auth.isLogin, couponController.addCoupon)
admin_route.get('/couponDetails',auth.isLogin, couponController.couponDetails)
admin_route.post('/couponDetails',auth.isLogin, couponController.editCoupon)


admin_route.get('/listCoupon',auth.isLogin, couponController.loadCouponList)
admin_route.get('/couponStatus',auth.isLogin, couponController.couponStatus)
admin_route.get('/removeCoupon',auth.isLogin, couponController.removeCoupon)


admin_route.get('/logout',auth.isLogout,adminController.logout)

admin_route.use(err);

module.exports = admin_route;
