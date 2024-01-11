const User = require("../models/userModel");
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Address = require('../models/address');
const { LogarithmicScale } = require("chart.js");


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
        country,
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
        country,
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
        country,
        pin : parseInt(pincode),
        mobile : parseInt(mobile)});
        console.log(newAddress);
  
        await newAddress.save()
        res.redirect('/user')
    } catch (error) {
      console.log(error.message);
    }
  }



const addAddressChekout= async(req, res)=>{
  try {
    const userId = req.session.user_id

    const {
      name,
      state,
      district,
      street,
      address,
      city,
      country,
      pincode,
      mobile
    }=req.body

    const newAddress = new Address({     
      user: userId,
      name,
      state,
      district,
      street,
      address,
      city,
      country,
      pin : parseInt(pincode),
      mobile : parseInt(mobile)});
      console.log(newAddress);

      await newAddress.save()
      res.redirect('/checkOut')
  } catch (error) {
    console.log(error.message);
  }
}

const editAddressCheckout = async (req, res) => {
  try {
      const userId = req.session.user_id;
      const { 'address-id': addressId, name, mobile, street, address, city, country, state, district, pincode } = req.body;

      // Assuming Address is your Mongoose model
      const foundAddress = await Address.findById(addressId);

      if (foundAddress) {
          // Update the found address with new details
          foundAddress.name = name;
          foundAddress.mobile = mobile;
          foundAddress.street = street;
          foundAddress.address = address;
          foundAddress.city = city;
          foundAddress.country = country;
          foundAddress.state = state;
          foundAddress.district = district;
          foundAddress.pincode = pincode;

          // Save the updated address
          await foundAddress.save();

          console.log("Address updated successfully:", foundAddress);
      } else {
          console.log("Address not found with ID:", addressId);
      }

      res.redirect('/checkOut'); 
  } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
  }
};

module.exports = {
    addAddress,
    addAddressChekout,
    editAddressCheckout
}