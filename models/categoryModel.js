const mongoose =require("mongoose")

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description:{
            type: String
        },
        image: {
            type: String,
            required: true,
        },
        is_Listed: {
            type: Boolean,
            default: true,
        },
    }
)
module.exports=mongoose.model('Category',categorySchema)