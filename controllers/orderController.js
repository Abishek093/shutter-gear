require('dotenv').config();
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Cart = require('../models/cartModel');
const Address = require('../models/address')
const Order = require('../models/orderModel')
const Coupon = require('../models/Coupon')

const { generateOrderRazorpay, verifyOrderPayment } = require('../helper/razorPay');

const generatePdf = require('../helper/pdfGenerator');
const mongoose = require('mongoose')


const loadCheckOut = async (req, res) => {
  try {
      const coupon = await Coupon.find({isDeleted: false}).sort({createdAt: -1})
      const cartQuantity = req.session.cartQuantity;
      const user = req.session.user_id;
      const userCart = await Cart.findOne({ user }).populate("products.product");
      const address = await Address.find({ user });
      // const coupon =  await Coupon.findById(userCart.coupon)
      res.render('checkOut', { user, address, userCart, cartQuantity, coupon });
  } catch (error) {
      console.log(error.message);
  }
};



const confirmOrder = async (req, res) => {
  try {
      const userId = req.session.user_id;
      const addressId = req.body.addressId;
      const paymentMethod = req.body.PaymentMethod;
      const totalPrice = req.body.totalPrice;

      const cart = await Cart.findOne({ user: userId }).populate('products.product');
      if (!cart || cart.products.length === 0) {
          return res.status(400).json({ error: 'Cart is empty. Add products to the cart before checkout.' });
      }

      const hasZeroQuantity = cart.products.some(item => item.product.quantity === 0);
      if (hasZeroQuantity) {
          return res.status(400).json({ error: 'Some products in the cart have quantity 0. Remove or update them before checkout.' });
      }

      const coupon = await Coupon.findOne({ code: req.body.couponCode });

      let couponId;
      if (!coupon) {
          couponId = null;
      } else {
          couponId = coupon._id;
      }

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
            };
          }),
          grandTotal: totalPrice,
          coupon: couponId,
      };

      const orderDocument = await Order.create(order); 
      const orderId = orderDocument._id; 

      if(orderDocument){

        if (order.paymentMethod === 'Cash On Delivery') {

          for (const product of order.products) {
            const productId = product.product._id;
            const orderedQuantity = product.quantity;
  
            await Product.findByIdAndUpdate(
                productId,
                { $inc: { quantity: -orderedQuantity } },
                { new: true }
            );
          }

          await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [], total: 0 } });

          res.status(200).json({ message: 'success' });
  
        } else if (order.paymentMethod === 'Razorpay') {
          const generatedOrder = await generateOrderRazorpay(orderId, totalPrice)
            res.status(200).json({
                message: 'success',
                razorpayOrder: {
                    id: generatedOrder.id,
                    amount: generatedOrder.amount,
                    currency: generatedOrder.currency,
                    order_id: generatedOrder.id,
                    key_id: process.env.RAZORPAY_ID_KEY,
                    reciept: orderId,
                    contact: "8943759719",
                    name: "ShutterGear",
                    email: "admin@gmail.com"
                },
            });
        }
      }

  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyPayment = async (req, res) => {
  try {
      verifyOrderPayment(req.body)
          .then(async () => {
              const userId = req.session.user_id;
              // const orderId = req.body.orderId;
              const user = await User.findById(userId);
              // console.log("orderIdorderIdorderIdorderId",orderId);

              const cart = await Cart.findOne({ user: userId });

              // Decrease product quantity
              for (const product of cart.products) {
                const productId = product.product._id;
                const orderedQuantity = product.quantity;
      
                await Product.findByIdAndUpdate(
                    productId,
                    { $inc: { quantity: -orderedQuantity } },
                    { new: true }
                );
              }
    
              await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [], total: 0 } });
              req.session.cartQuantity = null
              res.status(200).json({ status: "success"});
          })
          .catch((error) => {
              console.error(error);
              res.status(400);
          });
        } catch (error) {
          console.error(error);
          res.status(400).json({
              status: "error",
              msg: "Payment verification failed",
          });
      }
  };

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



//latest 07-16-24
// const orderStatus = async (req, res) => {
//     try {
//       const { orderId, status, productId } = req.body;
//       console.log("Request Payload:", { orderId, status, productId });
  
//       if (!status || !orderId || !productId) {
//         return res.status(400).json({ error: 'Invalid input parameters' });
//       }
  
//       const updatedOrder = await Order.findOneAndUpdate(
//         { _id: orderId, 'products.product': productId },
//         { $set: { 'products.$.status': status } },
//         { new: true }
//       ).populate('user');
  
//       if (!updatedOrder) {
//         return res.status(404).json({ error: 'Order or Product not found' });
//       }
  
//       if (status === 'Cancelled' && updatedOrder.paymentMethod === 'Razorpay') {
//         const refundedAmount = updatedOrder.products.find(
//           (product) => product.product.equals(productId)
//         ).total;
  
//         const user = updatedOrder.user;
//         const updatedUser = await User.findOneAndUpdate(
//           { _id: user._id },
//           { $inc: { walletAmount: refundedAmount } },
//           { new: true }
//         );
  
//         if (!updatedUser) {
//           return res.status(500).json({ error: 'Failed to update user wallet' });
//         }
  
//         console.log(`User's wallet updated with refunded amount: ${refundedAmount}`);
//       }
  
//       res.json({ success: true });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   };
  
  
const orderStatus = async (req, res) => {
  try {
      const { orderId, status, productId } = req.body;

      if (!status || !orderId || !productId) {
          return res.status(400).json({ error: 'Invalid input parameters' });
      }

      const updatedOrder = await Order.findOneAndUpdate(
          { _id: orderId, 'products.product': productId },
          { $set: { 'products.$.status': status } },
          { new: true }
      ).populate('user');

      if (!updatedOrder) {
          return res.status(404).json({ error: 'Order or Product not found' });
      }

      if (updatedOrder.coupon) {
          const coupon = await Coupon.findById(updatedOrder.coupon);

          const percentageDiscountPerProduct = coupon.percentageDiscount / updatedOrder.products.length;

          updatedOrder.products.forEach((product) => {
              const discountAmount = (percentageDiscountPerProduct / 100) * product.price;
              product.total -= discountAmount;
          });
      }

      updatedOrder.save();

      if (status === 'Cancelled' && updatedOrder.paymentMethod === 'Razorpay') {
          const refundedAmount = updatedOrder.products.find((product) => product.product.equals(productId)).total;

          const user = updatedOrder.user;
          const updatedUser = await User.findOneAndUpdate(
              { _id: user._id },
              { $inc: { walletAmount: refundedAmount } },
              { new: true }
          );

          if (!updatedUser) {
              // console.error('Failed to update user wallet');
              return res.status(500).json({ error: 'Failed to update user wallet' });
          }

          // console.log(`User's wallet updated with refunded amount: ${refundedAmount}`);
      }

      return res.status(200).json({ success: true });
  } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: 'Internal server error' });
  }
};


// const orderStatus = async (req, res) => {
//     try {
//       const { orderId, status, productId } = req.body;
//       console.log("Request Payload:", { orderId, status, productId }); 
  
//       if (!status || !orderId || !productId) {
//         return res.status(400).json({ error: 'Invalid input parameters' });
//       }
  
//       const updatedOrder = await Order.findOneAndUpdate(
//         { _id: orderId, 'products.product': productId },
//         { $set: { 'products.$.status': status } },
//         { new: true }
//       ).populate('user');
  
//       if (!updatedOrder) {
//         return res.status(404).json({ error: 'Order or Product not found' });
//       }
  
//       if (status === 'Cancelled') {
//         // Find the canceled product in the order
//         const canceledProduct = updatedOrder.products.find(product => product.product.equals(productId));
  
//         if (canceledProduct) {
//           // Increase the quantity of the corresponding product
//           const correspondingProduct = await Product.findById(canceledProduct.product);
//           if (correspondingProduct) {
//             correspondingProduct.quantity += canceledProduct.quantity;
//             await correspondingProduct.save();
//           }
//         }
//       }
  
//       if (updatedOrder.coupon) {
//         // Your existing coupon logic here
//       }
  
//       updatedOrder.save();
  
//       if (status === 'Cancelled' && updatedOrder.paymentMethod === 'Razorpay') {
//         // Your existing wallet update logic here
//       }
  
//       res.json({ success: true });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   };
  

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
    verifyPayment
}