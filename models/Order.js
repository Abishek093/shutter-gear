const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require : true
    },
    address :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Address',
        require: true
    },
    products:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity:{
            type:Number,
            require: true
        },
        price:{
            type:Number,
            require:true
        },
        total:Number,
        returnStatus:{
            type:String
        },
        status:{
            type:String,
            enum:['Pending', 'Shipped', 'Delivered','Cancelled','Out for Delivery','Confirmed'],
            default:'Pending'
        },
    }],
    paymentMethod:{
        type:String,
        require: true
    },
        createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    grandTotal:Number,
    cancelRequest:{
      type:Boolean,
      default:false,
    },
    reason:String,
    response:Boolean, 
    payment_id:String,
    payment_status:{
      type:Boolean,
      default:false,
    },
    order_Id:String,

});

module.exports=mongoose.model('Order',orderSchema)