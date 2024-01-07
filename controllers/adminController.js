const Admin = require("../models/adminModel")
const Order = require('../models/orderModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const path = require('path')
const numeral = require("numeral");
const moment = require("moment");

const loadLogin = async (req, res) => {
    try {
      res.render('adminLogin');
    } catch (error) {
      console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminData = await Admin.findOne({ email });

        if (adminData) {
            if (adminData.password === password) {
                req.session.admin_id = adminData._id;
                res.redirect('admin/dashboard'); 
            } else {
                console.log("Invalid password");
                res.redirect('admin/adminlogin'); 
            }
        } else {
            console.log("User not found");
            res.redirect('/adminlogin'); 
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/adminlogin'); 
    }
};



const loadDashboard = async (req, res) => {
    try {
        const orders = await Order.find().populate('products.product');
        const totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0);
        const totalSales = orders.length;
        const totalProductsSold = orders.reduce((sum, order) => sum + order.products.length, 0);

        const uniqueProducts = new Set();
        orders.forEach(order => {
            order.products.forEach(product => {
                uniqueProducts.add(product.product._id.toString());
            });
        });
        const totalUniqueProducts = uniqueProducts.size;

        const productSalesMap = new Map();
        orders.forEach(order => {
            order.products.forEach(product => {
                const productId = product.product._id.toString();
                const quantity = product.quantity;
                if (productSalesMap.has(productId)) {
                    productSalesMap.set(productId, productSalesMap.get(productId) + quantity);
                } else {
                    productSalesMap.set(productId, quantity);
                }
            });
        });

    const topSellingProducts = await Promise.all(
        [...productSalesMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(async ([productId, quantitySold]) => {
                const product = await Product.findById(productId).exec();
                return {
                    title: product.title,
                    date: new Date(product.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    }),
                    sales_price: product.sales_price,
                    quantitySold: quantitySold,
                    stock: product.quantity, // Assuming product quantity is the stock
                    amount: product.sales_price * quantitySold,
                    image: product.images[0],
                };
            })
        );


        const razorpayTotal = await Order.aggregate([
            { $match: { paymentMethod: 'Razorpay', status: 'Delivered' } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } }
        ]);

        const codTotal = await Order.aggregate([
            { $match: { paymentMethod: 'Cash On Delivery', status: 'Delivered' } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } }
        ]);


        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })  // Sorting by createdAt in descending order
            .limit(5)  // Limiting to the last 5 orders
            .populate('products.product');

        const totalUsers = await User.countDocuments();

        res.render('dashboard', {
            totalRevenue,
            totalSales,
            totalProductsSold,
            totalUniqueProducts,
            topSellingProducts,
            totalUsers,
            recentOrders,
            razorpayTotal,
            codTotal
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};




const getSalesData = async (req, res) => {
  try {
    const pipeline = [
      {
        $project: {
          year: { $year: "$createdAt" }, 
          month: { $month: "$createdAt" }, 
          totalSales: "$grandTotal", 
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          sales: { $sum: "$totalSales" },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: {
                  if: { $lt: ["$_id.month", 10] },
                  then: { $concat: ["0", { $toString: "$_id.month" }] },
                  else: { $toString: "$_id.month" },
                },
              },
            ],
          },
          sales: "$sales",
        },
      },
    ];

    const monthlySalesArray = await Order.aggregate(pipeline);
    console.log(monthlySalesArray);

    res.json(monthlySalesArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSalesDataYearly = async (req, res) => {
  try {
    const yearlyPipeline = [
      {
        $project: {
          year: { $year: "$createdAt" }, 
          totalSales: "$grandTotal", 
        },
      },
      {
        $group: {
          _id: { year: "$year" },
          sales: { $sum: "$totalSales" },
        },
      },
      {
        $project: {
          _id: 0,
          year: { $toString: "$_id.year" },
          sales: "$sales",
        },
      },
    ];

    const yearlySalesArray = await Order.aggregate(yearlyPipeline);
    console.log(yearlySalesArray);
    res.json(yearlySalesArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSalesDataWeekly = async (req, res) => {
  try {
    const weeklySalesPipeline = [
      {
        $project: {
          week: { $week: "$createdAt" }, 
          totalSales: "$grandTotal", 
        },
      },
      {
        $group: {
          _id: { week: { $mod: ["$week", 7] } },
          sales: { $sum: "$totalSales" },
        },
      },
      {
        $project: {
          _id: 0,
          week: { $toString: "$_id.week" },
          dayOfWeek: { $add: ["$_id.week", 1] },
          sales: "$sales",
        },
      },
      {
        $sort: { dayOfWeek: 1 },
      },
    ];

    const weeklySalesArray = await Order.aggregate(weeklySalesPipeline);
    console.log(weeklySalesArray);

    res.json(weeklySalesArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    req.session.admin_id = null;
    res.redirect('/admin')
  } catch (error) {
    console.log(error.message);
  }
}

module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    getSalesData,
    getSalesDataWeekly,
    getSalesDataYearly,
    logout
};