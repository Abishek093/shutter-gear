const User = require("../models/userModel");
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Address = require('../models/address')


const addAddress = async(req, res)=>{
    try {
      const userId = req.session.user_id
  
      const {
        name,
        state,
        district,
        street,
        address,
        city,
        county,
        pincode,
        mobile
      }=req.body
  
      console.log(
        name,
        state,
        district,
        street,
        address,
        city,
        county,
        pincode,
        mobile
      );
  
      const newAddress = new Address({     
        user: userId,
        name,
        state,
        district,
        street,
        address,
        city,
        county,
        pin : parseInt(pincode),
        mobile : parseInt(mobile)});
        console.log(newAddress);
  
        await newAddress.save()
        res.redirect('/user')
    } catch (error) {
      console.log(error.message);
    }
  }

module.exports = {
    addAddress
}