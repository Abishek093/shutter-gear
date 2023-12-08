const mongoose =require("mongoose")


const cartSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    products: [{
        product:{type : mongoose.Schema.Types.ObjectId,
            ref : 'Product'},
        quantity : {type : Number},
        subTotal:{type : Number}
    }],
    total :{type: Number, default:0}
})

module.exports = mongoose.model("Cart", cartSchema)
