const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({

    user:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        require : true
    },
    name:{
        type: String,
        require: true
    },
    mobile:{
        type: Number,
        require: true 
    },
    state:{
        type: String,
        require: true
    },
    district:{
        type: String,
        require: true
    },
    city:{
        type: String,
        require: true
    },
    street:{
        type:String,
    },    
    pin:{
        type: Number,
        require:true
    },
    address:{
        type:String,
        require: true
    }
})

module.exports = mongoose.model('Address',addressSchema)