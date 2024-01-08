const User = require("../models/userModel");
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");
const path = require('path')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const async = require('async');
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

const loadLandingPage = async (req, res) => {
  try {
    const newArrivals = await Product.find({ is_Listed: true }).sort({ createdAt: -1 }).limit(6)
    const allCategory = await Category.find({ is_Listed: false }).limit(6)
    const allProduct = await Product.find({ is_Listed: true }).sort({ createdAt: -1 }).limit(8)
    const user = req.session.user_id;
    res.render('landingHome', { allProduct, allCategory, newArrivals, user })
  } catch (error) {
    console.log(error.message);
  }
}


//password bcrypt


const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash
  } catch (error) {
    console.log(error.message);
  }
}


//Registaration page load

const loadRegister = async (req, res) => {
  try {
    res.render('registration');
  } catch (error) {
    console.log(error.message);
  }
}


//Transporter

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'fileshare543@gmail.com',
    pass: 'tnqy gssz ebji wars',
  },
});


//Otp generator

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};


//Adding datas to database

const insertUser = async (req, res) => {
  try {
    const otp = generateOTP()
    req.session.otp = otp
    console.log(otp);
    const spassword = await securePassword(req.body.password)

    const user = User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mno,
      password: spassword
    });
    req.session.userData = user



    const mailOptions = {
      from: 'fileshare543@gmail.com',
      to: req.body.email,
      subject: 'OTP Verification',
      text: `Your OTP: ${otp}`,
    };

    console.log(otp);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('OTP sent: ' + info.response);
      }
    });

    res.redirect('/otp')

  } catch (error) {
    console.log(error.message);
  }
}


//otp page load

const loadOtp = async (req, res) => {
  try {
    res.render('otp')
  } catch (error) {
    console.log(error.message);
  }
}

//otp verification

const verifyOtp = async (req, res) => {
  try {
    const enteredOTP = req.body.otp
    const storedOTP = req.session.otp
    const userData = req.session.userData
    console.log(enteredOTP, storedOTP);


    if (enteredOTP === storedOTP) {
      const user = User({
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password,
        is_verified: 1
      })

      await user.save();
    }
    res.render('login', { message: 'Registration successful' });
    console.log('otp verified');
    delete req.session.otp
  } catch (error) {
    console.log(error.message);
  }
}



// login page load

const loadLogin = async (req, res) => {
  try {
    res.render('login')
  } catch (error) {
    console.log(error.message);
  }
}


//login page verification

// const verifyLogin = async(req, res)=>{
//   try {
//     const email = req.body.email
//     const password = req.body.password

//     const userData = await User.findOne({email:email})
//     if(userData){
//       const passwordMatch = await bcrypt.compare(password, userData.password);
//       if(passwordMatch){
//         req.session.user_id = userData._id
//         console.log("login Successfull");
//         res.render("loginHome")
//       }else{
//         console.log("Invalid Credentials");
//       }
//     }else{
//       console.log("No user found");
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// }
const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const userData = await User.findOne({ email: email })
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_verified === 0) {
          res.render('login', { message: 'Please verify your mail.' });
        } else {
          req.session.user_id = userData._id
          const userCart = await Cart.findOne({ user: req.session.user_id });
          if (userCart) {
              req.session.cartQuantity = userCart.products.length;
          } else {
              req.session.cartQuantity = 0;
          }
          console.log("login Successfull");
          const newArrivals = await Product.find({ is_Listed: true }).sort({ createdAt: -1 }).limit(6)
          const allCategory = await Category.find({ is_Listed: false }).limit(6)
          const allProduct = await Product.find({ is_Listed: true }).sort({ createdAt: -1 }).limit(8)
          const user = req.session.user_id;
          const cartQuantity = req.session.cartQuantity; // Include cart quantity in the rendering
          res.render("landingHome", { newArrivals, allCategory, allProduct, user, cartQuantity })
        }
      } else {
        console.log("Invalid Credentials");
      }
    } else {
      console.log("No user found");
    }
  } catch (error) {
    console.log(error.message);
  }
}


// const loadProductsView = async(req, res)=>{``
//   try {
//     const allCategory = await Category.distinct('name');
//     const brands = await Product.distinct('brand');
//     const categories = await Category.find();

//     // Get the current page from the query parameters, default to 1 if not provided
//     const page = parseInt(req.query.page, 10) || 1;
//     const productsPerPage = 12; // Number of products per page

//     // Use async.parallel to fetch productdata and totalProducts concurrently
//     const results = await async.parallel({
//       productdata: async function () {
//         return Product.find()
//           .skip((page - 1) * productsPerPage)
//           .limit(productsPerPage)
//           .exec();
//       },
//       totalProducts: async function () {
//         return Product.countDocuments().exec();
//       },
//     });

//     const { productdata, totalProducts } = results;

//     // Render your view with the fetched productdata, categories, brands, and pagination information
//     res.render('productsView', {
//       productdata,
//       categories,
//       brands,
//       currentPage: page,
//       totalPages: Math.ceil(totalProducts / productsPerPage),
//       allCategory
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Internal Server Error');
//   }
// }



const loadProductsView = async (req, res) => {
  try {
    const allCategory = await Category.distinct('name');
    const brands = await Product.distinct('brand');
    const categories = await Category.find();
    const user = req.session.user_id;

    // Get the current page from the query parameters, default to 1 if not provided
    const page = parseInt(req.query.page, 10) || 1;
    const productsPerPage = 12; // Number of products per page

    // Construct the filter based on selected categories and brands
    const selectedCategories = Array.isArray(req.query.categories) ? req.query.categories : [];
    const selectedBrands = Array.isArray(req.query.brands) ? req.query.brands : [];

    // Build the filter object based on selected categories and brands
    const filter = {
      $or: [
        { category: { $in: selectedCategories } },
        { brand: { $in: selectedBrands } }
      ]
    };

    // Use async.parallel to fetch product data and totalProducts concurrently
    const results = await async.parallel({
      productdata: async function () {
        const productData = await Product.find(filter)
          .skip((page - 1) * productsPerPage)
          .limit(productsPerPage)
          .exec();
        return productData;
      },
      totalProducts: async function () {
        const total = await Product.countDocuments(filter).exec();
        console.log("Total Products:", total);
        return total;
      },
    });


    const { productdata, totalProducts } = results;

    // Render your view with the fetched product data, categories, brands, and pagination information
    res.render('productsView', {
      productdata,
      categories,
      brands,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / productsPerPage),
      allCategory,
      user
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};




const loadProduct = async (req, res) => {
  try {
    const id = req.params.id
    const products = await Product.findById(id)
    res.render('productDetails', { products })
  } catch (error) {
    console.log(error.message);
  }
}

const logout = async (req, res) => {
  try {
    req.session.user_id = null;
    res.redirect('/landingHome')
  } catch (error) {
    console.log(error.message);
  }
}

const loadUserProfile = async (req, res) => {
  try {
    const user_id = req.session.user_id
    console.log(user_id);
    if (user_id) {
      const user = await User.findById(user_id)
      console.log(user);
      res.render('account', { user })
    }
  } catch (error) {
    console.log(error.message);
  }
}


module.exports = {
  loadRegister,
  insertUser,
  loadOtp,
  verifyOtp,
  loadLogin,
  verifyLogin,
  loadLandingPage,
  loadProduct,
  loadProductsView,
  logout,
  loadUserProfile
};
