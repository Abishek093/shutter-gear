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
admin_route.get('/', adminController.loadLogin);
admin_route.get('/adminlogin', adminController.loadLogin);
admin_route.post('/', adminController.verifyLogin);
admin_route.get('/dashboard', adminController.loadDashboard);

//Category
admin_route.get('/category', categoryController.loadCategory)
admin_route.get('/add-new-category', categoryController.loadNewCategory)
admin_route.post('/add-new-category',categoryUpload.single('image'), categoryController.AddNewCategory)
admin_route.get('/listcategory/:id', categoryController.deleteCategory)
admin_route.get('/edit-category/:id', categoryController.loadEditCategory)
admin_route.post('/edit-category/:id',categoryUpload.single('image'),categoryController.editCategory);

//Product
admin_route.get('/products', productController.loadProduct)
admin_route.get('/addnewProduct', productController.loadNewProduct)
admin_route.post('/addnewProduct', productUpload.array('image'), productController.addProduct)
admin_route.get('/editProduct/:id',productController.loadEditProduct)
admin_route.post('/editProduct/:id', productUpload.array('image'), productController.editProduct)
admin_route.get('/listProduct/:id', productController.deleteProduct)
admin_route.get('/delete-image/:id/:img', productController.deleteImage);

//customer
admin_route.get('/userDetails',customerController.loaduserDetails)
admin_route.get('/blockuser', customerController.blockUser);

//order list
admin_route.get('/orderList',orderController.loadOrderList)
admin_route.get('/orderDetails',orderController.loadOrderDetails)
admin_route.post('/ChangeOrderStatus',orderController.orderStatus);

//sales report
admin_route.get('/salesReport',salesReportController.loadReport)

module.exports = admin_route;
