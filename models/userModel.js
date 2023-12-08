const mongoose =require("mongoose")

// const dbUrl = 'mongodb://127.0.0.1:27017/Shutter_Gear_DB';
// mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// if(db)
// {console.log('db set');}



    const userSchema=new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        mobile:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        is_verified:{
            type:Number,
            default:0
        },
        is_blocked:{
            type:Boolean,
            default:false
        }
})


module.exports=mongoose.model('User',userSchema)