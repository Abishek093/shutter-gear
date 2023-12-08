const { json } = require("body-parser")
const mongoose = require("mongoose")

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        category: {
            type: Object,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        model: {
            type: String
        },
        regular_price: {
            type: Number,
            required: true,
        },
        sales_price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        stock_status: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        is_Listed: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Product", productSchema)
