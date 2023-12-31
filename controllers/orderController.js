const User = require('../models/userModel')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Cart = require('../models/cartModel');
const Address = require('../models/address')
const Order = require('../models/Order')
const razorpay = require('../helper/razorPay');
const generatePdf = require('../helper/pdfGenerator');
const mongoose = require('mongoose')


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
        for (const product of order.products) {
          const productId = product.product._id;
          const orderedQuantity = product.quantity;

          await Product.findByIdAndUpdate(
              productId,
              { $inc: { quantity: -orderedQuantity } },
              { new: true }
          );
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
        const order = await Order.find().populate('address').sort({ createdAt: -1 });
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


//   const orderStatus = async (req, res) => {
//     try {
//         const { orderId, status } = req.body;
//         console.log("/?/?????//////" + orderId, status);

//         if (!status || !orderId) {
//             return res.status(400).json({ error: 'Invalid input parameters' });
//         }

//         const updateOrder = await Order.findByIdAndUpdate(
//             orderId,
//             { $set: { status: status } },
//             { new: true }
//         );

//         console.log("success");
//         console.log(updateOrder);

//         if (!updateOrder) {
//             return res.status(404).json({ error: 'Order not found' });
//         }

//         res.json({ success: true });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };



// const orderStatus = async (req, res) => {
//     try {
//         const { orderId, status, productId } = req.body;
//         console.log("Request Payload:", { orderId, status, productId });

//         if (!status || !orderId || !productId) {
//             return res.status(400).json({ error: 'Invalid input parameters' });
//         }

//         const updateOrder = await Order.findOneAndUpdate(
//             { _id: orderId, 'products.product': productId },
//             { $set: { 'products.$.status': status } }, 
//             { new: true }
//         );

//         console.log("success");


//         if (!updateOrder) {
//             return res.status(404).json({ error: 'Order or Product not found' });
//         }

//         res.json({ success: true });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

const orderStatus = async (req, res) => {
    try {
      const { orderId, status, productId } = req.body;
      console.log("Request Payload:", { orderId, status, productId });
  
      if (!status || !orderId || !productId) {
        return res.status(400).json({ error: 'Invalid input parameters' });
      }
  
      // Fetch the order with the updated status and populate the 'user' field
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: orderId, 'products.product': productId },
        { $set: { 'products.$.status': status } },
        { new: true }
      ).populate('user');
  
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order or Product not found' });
      }
  
      // Check if the status is 'Cancelled' and the payment method is 'Razorpay'
      if (status === 'Cancelled' && updatedOrder.paymentMethod === 'Razorpay') {
        // Calculate the refunded amount for the specific product
        const refundedAmount = updatedOrder.products.find(
          (product) => product.product.equals(productId)
        ).total;
  
        // Update the user's walletAmount with the refunded amount
        const user = updatedOrder.user;
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $inc: { walletAmount: refundedAmount } },
          { new: true }
        );
  
        if (!updatedUser) {
          return res.status(500).json({ error: 'Failed to update user wallet' });
        }
  
        console.log(`User's wallet updated with refunded amount: ${refundedAmount}`);
      }
  
      res.json({ success: true });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  



//user side
async function orderdetails(req,res){
    try {
      const cartQuantity = req.session.cartQuantity; // Include cart quantity in the rendering
      const user = req.session.user_id;
      const orderId = req.query.orderId;
      const orderDetails = await Order.findById(orderId).populate('address').populate('products.product').populate('user')
      if (req.query.downloadPdf) {
        generatePdf.generateInvoicePdf(orderDetails, res);
    } else {
        res.render('orderDetails', { orderDetails, user, cartQuantity });
    }
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