const mongoose = require("mongoose")

const couponSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
    },
    percentageDiscount: {
        type: Number,
        required: true,
    },
    minimumAmount: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    user:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
})



module.exports = mongoose.model("Coupon", couponSchema)