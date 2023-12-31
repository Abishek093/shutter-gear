const Coupon = require('../models/Coupon')


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

module.exports = {
    loadNewCoupon,
    addCoupon,
    loadCouponList,
    couponDetails,
    editCoupon,
    couponStatus,
    removeCoupon
}