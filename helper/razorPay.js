// const { reject } = require('async')
// const { resolve } = require('path')
// const Razorpay = require('razorpay')
// const instance = new Razorpay({key_id: process.env.RAZORPAY_ID_KEY, key_secret: process.env.RAZORPAY_SECRET_KEY})


// exports.generateOrderRazorpay = (orderId, total)=>{
//     return new Promise((resolve, reject)=>{
//         const options = {
//             amount: total * 100,
//             currency: 'INR',
//             receipt: orderId
//         }

//         instance.orders.create(options, function(err, order){
//             if(err){
//                 console.log(err);
//                 reject(err)
//             }else{
//                 console.log("Order Generated RazorPAY: " + JSON.stringify(order))
//                 resolve(err)
//             }
//         })
//     })
// }

// razorpay.js
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,    
});

module.exports = razorpay;
