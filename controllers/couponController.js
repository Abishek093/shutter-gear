const Coupon = require('../models/Coupon')
const User = require('../models/userModel')
const Cart = require('../models/cartModel');
const Order = require('../models/Order');
const mongoose = require('mongoose');

const { LogarithmicScale } = require('chart.js');
const { utimesSync } = require('fs');
const { log } = require('async');


const loadNewCoupon = async(req, res)=>{
    try {
        res.render('addNewCoupon')
    } catch (error) {
        console.log(error.message);
    }
}

const addCoupon = async(req, res)=>{
    try {
        const {name,code,percentageDiscount, minimumAmount, createdAt, expiryDate} = req.body
        console.log({name,code,percentageDiscount, minimumAmount, createdAt, expiryDate});

        const coupon = await Coupon.create({
            name,
            code,
            percentageDiscount, 
            minimumAmount, 
            createdAt, 
            expiryDate, 
        })

        res.redirect('/admin/listCoupon')
    } catch (error) {
        console.log(error.message);
    }
}

const loadCouponList = async(req, res)=>{
    try {
        const CouponList = await Coupon.find({isDeleted: false}).sort({createdAt: -1})
        res.render('couponList',{CouponList})
    } catch (error) {
        console.log(error.message);
    }
}

const couponDetails = async(req, res)=>{
    try {
        const couponId = req.query.couponId
        const coupon = await Coupon.findById(couponId)
        res.render('CouponDetails',{coupon})
    } catch (error) {
        console.log(error.message);
    }
}

const editCoupon = async(req, res)=>{
    try {
        const couponId = req.query.couponId;
        const { name, code, percentageDiscount, minimumAmount, createdAt, expiryDate, status } = req.body;
        
        console.log('Request Body:', req.body);
        const updateCoupon = {
            name,
            code,
            percentageDiscount, 
            minimumAmount, 
            createdAt, 
            expiryDate, 
            status
        }

        const updateData = await Coupon.findByIdAndUpdate({_id: couponId}, updateCoupon)

        if(updateData){
            res.redirect('/admin/listCoupon')
        }else{
            console.log("error.message");
        }
    } catch (error) {
        console.log(error.message);
    }
}

const couponStatus = async(req, res)=>{
    try {
        const coupon_id = req.query.couponId
        const coupon = await Coupon.findById(coupon_id)
        if(!coupon){
            console.log("Coupon not found");
            res.status(404).send('Product not found');
            return;
        }
        coupon.status = !coupon.status
        await coupon.save()
        res.redirect('/admin/listCoupon')

    } catch (error) {
        console.log(error.message);
    }
}

const removeCoupon = async(req, res)=>{
    try {
        const coupon_id = req.query.couponId
        const coupon = await Coupon.findById(coupon_id)
        if(!coupon){
            console.log("Coupon not found");
            res.status(404).send('Product not found');
            return;
        }
        coupon.isDeleted = !coupon.isDeleted
        await coupon.save()
        res.redirect('/admin/listCoupon')    
    } catch (error) {
        console.log(error.message);
    }
}


// const applyCoupon = async(req, res)=>{
//     try {
//         const couponCode = req.body.couponCode
//         const userId = req.session.user_id;
//         // const totalAmount = req.body.totalPrice
//         const currentDate = new Date()
//         const coupon = await Coupon.findOne({ code: couponCode })    
//         const userCart = await Cart.find({ user: userId }).populate("products.product");

//         const couponPercent = (coupon.percentageDiscount / userCart.length)

//         const couponDiscount = userCart.forEach((products)=>{
//             products.coupon = couponCode;
//             products.subTotal = ((products.subTotal * couponPercent)/ 100)
//         })
//         userCart.forEach((products)=>{
//             console.log(products.subTotal);
//         })

//         // return res.json({ status: true, totalAmount: finalAmount, offer: coupon.percentageDiscount })

//     } catch (error) {
//         console.error("Error in applying coupon:", error)
//         res.status(500).json({ status: false, message: "Internal Server Error" })    }
// }


// const applyCoupon = async (req, res) => {
//     try {
//         const couponCode = req.body.couponCode;
//         const userId = req.session.user_id;
//         const currentDate = new Date();
//         const coupon = await Coupon.findOne({ code: couponCode });
//         const userCart = await Cart.findOne({ user: userId }).populate("products.product");

//         if (!userCart) {
//             return res.json({ status: false, message: "Cart not found." });
//         }

//         const couponPercent = coupon.percentageDiscount / userCart.products.length;

//         const couponDiscount = userCart.products.map((product) => {
//             product.coupon = couponCode;
//             product.subTotal = (product.subTotal * couponPercent) / 100;
//             return product;
//         });


//         return res.json({ status: true, totalDiscount, offer: coupon.percentageDiscount });
//     } catch (error) {
//         console.error("Error in applying coupon:", error);
//         res.status(500).json({ status: false, message: "Internal Server Error" });
//     }
// };

// const applyCoupon =  async(req, res)=>{
//     try {
//         const couponCode = req.body.couponCode;
//         const userId = req.session.user_id;
//         const currentDate = new Date();
//         const coupon = await Coupon.findOne({ code: couponCode });
//         const userCart = await Cart.findOne({ user: userId }).populate("products.product");        

//         if (!userCart) {
//             return res.json({ status: false, message: "Cart not found." });
//         }        

//         const couponDiscount = (userCart.total * coupon.percentageDiscount)/100;
//         userCart.total = userCart.total - couponDiscount;
//         userCart.coupon = coupon._id
//         await userCart.save()

//         coupon.user.push({ userId });
//         await coupon.save();

//     } catch (error) {
//         console.log(error.message);
//     }
// }


const applyCoupon = async (req, res) => {
    try {
        const { couponCode, totalPrice } = req.body;
        const currentDate = new Date();
        const coupon = await Coupon.findOne({ code: couponCode });

        if (!coupon || coupon.minimumAmount > totalPrice || currentDate < coupon.createdAt || currentDate > coupon.expiryDate) {
            return res.json({ status: false });
        }

        const userId = req.session.user_id;

        coupon.user.push({ userId });
        
        await coupon.save();

        const discount = ((totalPrice * coupon.percentageDiscount) / 100);
        const finalAmount = totalPrice - discount
        return res.json({ status: true, totalAmount: finalAmount, offer: coupon.percentageDiscount, coupon: coupon});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

module.exports = {
    loadNewCoupon,
    addCoupon,
    loadCouponList,
    couponDetails,
    editCoupon,
    couponStatus,
    removeCoupon,
    applyCoupon
}