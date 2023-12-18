const User = require('../models/userModel')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Cart = require('../models/cartModel');
const Address = require('../models/address')
const Order = require('../models/Order')
const razorpay = require('../helper/razorPay');


const loadCheckOut = async (req, res) => {
    try {
        const cartQuantity = req.session.cartQuantity; // Include cart quantity in the rendering
        const user = req.session.user_id;
        const userCart = await Cart.findOne({ user: user }).populate("products.product");
        const address = await Address.find({ user: user })
        res.render('checkOut', { user, address, userCart,cartQuantity })
    } catch (error) {
        console.log(error.message);
    }
}




const confirmOrder = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const addressId = req.body.addressId;
        const paymentMethod = req.body.PaymentMethod;

        const cart = await Cart.findOne({ user: userId }).populate('products.product')

        const order = {
            user: req.session.user_id,
            address: addressId,
            paymentMethod: paymentMethod,
            products: cart.products.map((item) => {
                return {
                    product: item.product,
                    quantity: item.quantity,
                    price: item.product.sales_price,
                    total: item.subTotal,
                }
            }),
            grandTotal: cart.total
        }
        await Order.insertMany(order);
        await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [], total: 0 } });

        if(order.paymentMethod === 'Cash On Delivery'){
        res.status(200).json({ message: "success" });

        }else if(order.paymentMethod === 'Razorpay'){
            const razorpayOrder = await razorpay.orders.create({
                amount: order.grandTotal * 100, // Amount in paise
                currency: 'INR',
                receipt: 'orderId',
                payment_capture: 1, // Auto-capture payment
            });
            console.log("////////////////////",razorpayOrder);
            res.status(200).json({
                message: 'success',
                razorpayOrder: {
                    id: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                },
            });        
        }
    } catch (error) {
        console.log(error);
    }
}


const loadSuccess = async (req, res) => {
    try {
        const cartQuantity = req.session.cartQuantity; // Include cart quantity in the rendering
        const user = req.session.user_id;
        res.render('successPage', { user,cartQuantity })
    } catch (error) {
        console.log(error.message);
    }
};

const loadOrderList = async (req,res) => {
    try {
        const order = await Order.find().populate('address')
        res.render('orderList',{order});
    } catch (error) {
        console.log(error.message);
    }
  };

const loadOrderDetails = async(req,res) => {
    try {
      const orderId = req.query.orderId;
      const orderDetails = await Order.findById(orderId).populate('address').populate('products.product');
      res.render('orderDetails' , {orderDetails})
    } catch (error) {
      console.log(error.message);
    }
  };


  const orderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        console.log("/?/?????//////" + orderId, status);

        if (!status || !orderId) {
            return res.status(400).json({ error: 'Invalid input parameters' });
        }

        const updateOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { status: status } },
            { new: true }
        );

        console.log("success");
        console.log(updateOrder);

        if (!updateOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//user side
async function orderdetails(req,res){
    try {
      const cartQuantity = req.session.cartQuantity; // Include cart quantity in the rendering
      const user = req.session.user_id;
      const orderId = req.query.orderId;
      const orderDetails = await Order.findById(orderId).populate('address').populate('products.product')
      res.render('orderDetails',{orderDetails , user, cartQuantity})


    } catch (error) {
      console.log(error);
    }
}


 
module.exports = {
    loadCheckOut,
    loadSuccess,
    confirmOrder,
    loadOrderDetails,
    loadOrderList,
    orderStatus,
    orderdetails,
    
}