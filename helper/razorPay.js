require('dotenv').config();
const Razorpay = require("razorpay")

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});


exports.generateOrderRazorpay = (orderId, totalPrice) => {
    return new Promise((resolve, reject) => {
        const options = {
            amount: totalPrice * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: orderId,
        }

        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(order)
            }
        })
    })
}

exports.verifyOrderPayment = (details) => {

    return new Promise((resolve, reject) => {
        try {
            const crypto = require("crypto")
            let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
            hmac.update(details.payment.razorpay_order_id + "|" + details.payment.razorpay_payment_id)
            hmac = hmac.digest("hex")

            if (hmac === details.payment.razorpay_signature) {
                console.log("Verify SUCCESS")
                resolve();
            } else {
                console.log("Verify FAILED")
                reject(new Error("Signature verification failed"));
            }
        } catch (error) {
            console.error("Verify Exception:", error);
            reject(error);
        }
    });
};