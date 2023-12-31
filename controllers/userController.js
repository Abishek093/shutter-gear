const User = require("../models/userModel");
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const path = require('path')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Address = require('../models/address')
const Order = require('../models/Order')
const Cart = require('../models/cartModel')

const async = require('async');
const session = require("express-session");
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

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

//password bcrypt

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash
  } catch (error) {
    console.log(error.message);
  }
}

//load login

const loadLogin = async (req, res) => {
  try {
    res.render('login')
  } catch (error) {
    console.log(error.message);
  }
}

//verify Login

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const userData = await User.findOne({ email: email })
    if (userData) {
      if (userData.is_blocked) {
        return res.render('login', { err: "This account is temporarily blocked or unavailable!." })
      }
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
          const newArrivals = await Product.find({ is_Listed: true }).sort({ createdAt: -1 }).limit(6)
          const allCategory = await Category.find({ is_Listed: false }).limit(6)
          const allProduct = await Product.find({ is_Listed: true }).sort({ createdAt: -1 }).limit(8)
          const user = req.session.user_id;
          const cartQuantity = req.session.cartQuantity; // Include cart quantity in the rendering
          res.render("landingHome", { newArrivals, allCategory, allProduct, user,cartQuantity })
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

//load Landing Home

const loadLandingPage = async (req, res) => {
  try {
    const cartQuantity = req.session.cartQuantity; 
    const newArrivals = await Product.find({ is_Listed: true }).sort({ createdAt: -1 }).limit(6)
    const allCategory = await Category.find({ is_Listed: false }).limit(6)
    const allProduct = await Product.find({ is_Listed: true }).sort({ createdAt: -1 }).limit(8)
    const user = req.session.user_id;
    res.render('landingHome', { allProduct, allCategory, newArrivals, user, cartQuantity })
  } catch (error) {
    console.log(error.message);
  }
}

//Loading Registration page

const loadRegister = async (req, res) => {
  try {
    res.render('registration')
  } catch (error) {
    console.log(error.message);
  }
}

//Registration page post

// const insertUser = async(req, res)=>{
//   try {
//     const spassword = await securePassword(req.body.password)
//     const user = User({
//       name: req.body.name,
//       email: req.body.email,
//       mobile: req.body.mno,
//       password: spassword
//     })

//     req.session.userDetails = user
//     console.log(req.session.userDetails);

//     const otp = generateOTP()
//     req.session.otp = otp
//     console.log(req.session.otp);

//     const mailOptions = {
//       from: 'fileshare543@gmail.com',
//       to: req.body.email,
//       subject: 'OTP Verification',
//       text: `Your OTP: ${otp}`,
//     };    

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('OTP sent: ' + info.response);
//       }
//     });

//     res.redirect('/otp')
//   } catch (error) {
//     console.log(error.message);
//   }
// }

//Load Otp


const insertUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.render('registration', {
        err: 'User already exists. Please login.',
        name: req.body.name,
        email: req.body.email,
        mno: req.body.mno,
      });
    }

    const otp = generateOTP();
    req.session.otp = otp;
    console.log(otp);
    const spassword = await securePassword(req.body.password);

    const user = User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mno,
      password: spassword
    });
    console.log(user);

    req.session.userData = user;

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

    res.redirect('/otp');
  } catch (error) {
    console.log(error.message);
  }
};

//load otp page

const loadOtp = async (req, res) => {
  try {
    res.render('otp')
  } catch (error) {

  }
}

//otp post

const verifyOtp = async (req, res) => {
  try {
    const enteredOTP = req.body.otp;
    const storedOTP = req.session.otp;
    const userData = req.session.userData;

    console.log('Entered OTP:', enteredOTP);
    console.log('Stored OTP:', storedOTP);

    if (enteredOTP == storedOTP && userData) {
      const user = User({
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password,
        is_verified: 1
      });

      console.log(user);
      res.render('login', { message: 'Registration successful' });
      console.log('otp verified');
      req.session.otp = null;
      await user.save();
    } else {
      console.log('Failed: OTPs do not match or user data is missing');
      return res.render('otp', { err: 'OTP Invalid' });
    }

  } catch (error) {
    console.log(error.message);
  }
};

//load Resend otp page

const loadResendOtp = async (req, res) => {
  try {
    req.session.otp = null;
    const OTP = generateOTP();
    const userData = req.session.userData;
    console.log("new otp", OTP);

    const mailOptions = {
      from: 'fileshare543@gmail.com',
      to: userData.email, // Use userData.email instead of req.body.email
      subject: 'OTP Verification',
      text: `Your new OTP: ${OTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('New OTP sent: ' + info.response);
      }
    });

    req.session.otp = OTP;
    res.render('resendOtp');
  } catch (error) {
    console.log(error.message);
  }
}

// Resend otp page post

const verifyResendOtp = async (req, res) => {
  try {
    const enteredOTP = req.body.otp;
    const storedOTP = req.session.otp;
    const userData = req.session.userData;


    console.log('Entered OTP:', enteredOTP);
    console.log('Stored OTP:', storedOTP);
    console.log("verify data", userData);

    if (enteredOTP == storedOTP && userData) {
      const user = User({
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password,
        is_verified: 1
      });

      console.log(user);
      res.render('login', { message: 'Registration successful' });
      console.log('otp verified');
      req.session.otp = null;
      await user.save();
    } else {
      console.log('Failed: OTPs do not match or user data is missing');
      return res.render('otp', { err: 'OTP Invalid' });
    }

  } catch (error) {
    console.log(error.message);
  }
};

//list Products

// const loadProductsView = async (req, res) => {
  
//   try {
//     const allCategory = await Category.distinct('name');
//     const brands = await Product.distinct('brand');
//     const categories = await Category.find();
//     const user = req.session.user_id;

//     const selectedCategories  = Array.isArray(req.query.category) ? req.query.category : [req.query.category];
//     console.log(selectedCategories);

//     const filter = {
//        category: { $in: selectedCategories } 
//     };

//     // const filterData = await Product.find(filter)
//     const page = parseInt(req.query.page, 10) || 1;
//     const productsPerPage = 12;

//     const results = await async.parallel({
//       productdata: async function () {
//         return Product.find(filter)
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
//       allCategory,
//       user,
//       selectedCategories
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Internal Server Error');
//   }
// }

const loadProductsView = async (req, res) => {
  try {
    const allCategory = await Category.distinct('name');
    const brands = await Product.distinct('brand');
    const categories = await Category.find();
    const user = req.session.user_id;
    const cartQuantity = req.session.cartQuantity; // Include cart quantity in the rendering

    // Extract category, brand, and search query from query parameters
    const selectedCategory = req.query.category;
    const selectedBrand = req.query.brand;
    const searchQuery = req.query.q;
    console.log(searchQuery);

    const sortBy = req.query.sortby || 'priceLowToHigh';

    let sortQuery = {};
    if (sortBy === 'priceLowToHigh') {
      sortQuery = { sales_price: 1 };
    } else if (sortBy === 'priceHighToLow') {
      sortQuery = { sales_price: -1 };
    }

    // Build filter based on selected category, brand, and search query
    const filter = {};
    if (selectedCategory) {
      filter['category'] = selectedCategory;
    }
    if (selectedBrand) {
      filter['brand'] = selectedBrand;
    }
    if (searchQuery) {
      // Use regex for case-insensitive search
      filter['$or'] = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { category: { $regex: new RegExp(searchQuery, 'i') } },
        { brand: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }
    filter['is_Listed'] = true; // Include only listed products

    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const productsPerPage = 12;

    const results = await Promise.all([
      Product.find(filter)
        .sort(sortQuery)
        .skip((page - 1) * productsPerPage)
        .limit(productsPerPage)
        .exec(),
      Product.countDocuments(filter).exec(),
    ]);

    const [productdata, totalProducts] = results;

    // Render your view with the fetched productdata, categories, brands, and pagination information
    res.render('productsView', {
      productdata,
      categories,
      brands,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / productsPerPage),
      allCategory,
      user,
      selectedCategory,
      selectedBrand,
      searchQuery,
      sortBy,
      cartQuantity
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};




// const LoadfilterProducts = async (req, res) => {
//   try {
//     const allCategory = await Category.distinct('name');
//     const brands = await Product.distinct('brand');
//     const categories = await Category.find();
//     const user = req.session.user_id;

//     // Get the current page from the query parameters, default to 1 if not provided
//     const page = parseInt(req.query.page, 10) || 1;
//     const productsPerPage = 12; // Number of products per page

//     // Construct the filter based on selected categories and brands
//     const selectedCategories = Array.isArray(req.query.categories) ? req.query.categories : [];
//     const selectedBrands = Array.isArray(req.query.brands) ? req.query.brands : [];

//     // Check if no categories or brands are selected, then fetch all products
//     if (selectedCategories.length === 0 && selectedBrands.length === 0) {
//       const results = await async.parallel({
//         productdata: async function () {
//           const productData = await Product.find()
//             .skip((page - 1) * productsPerPage)
//             .limit(productsPerPage)
//             .exec();
//           return productData;
//         },
//         totalProducts: async function () {
//           const total = await Product.countDocuments().exec();
//           return total;
//         },
//       });
//       const { productdata, totalProducts } = results;

//       return res.render('productView', {
//         productdata,
//         categories,
//         brands,
//         currentPage: page,
//         totalPages: Math.ceil(totalProducts / productsPerPage),
//         allCategory,
//         user,
//       });
//     }

//     // Construct the filter based on selected categories and brands
//     const filter = {
//       $or: [
//         { category: { $in: selectedCategories } },
//         { brand: { $in: selectedBrands } },
//       ],
//     };

//     // Use async.parallel to fetch product data and totalProducts concurrently
//     const results = await async.parallel({
//       productdata: async function () {
//         const productData = await Product.find(filter)
//           .skip((page - 1) * productsPerPage)
//           .limit(productsPerPage)
//           .exec();
//         return productData;
//       },
//       totalProducts: async function () {
//         const total = await Product.countDocuments(filter).exec();
//         return total;
//       },
//     });
//     const { productdata, totalProducts } = results;

//     res.render('productView', {
//       productdata,
//       categories,
//       brands,
//       currentPage: page,
//       totalPages: Math.ceil(totalProducts / productsPerPage),
//       allCategory,
//       user,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };



// const loadProductsView = async (req, res) => {
//   try {
//     const allCategory = await Category.distinct('name');
//     const brands = await Product.distinct('brand');
//     const categories = await Category.find();
//     const user = req.session.user_id;

//     // Get the current page from the query parameters, default to 1 if not provided
//     const page = parseInt(req.query.page, 10) || 1;
//     const productsPerPage = 12; // Number of products per page

//     // Construct the filter based on selected categories and brands
//     const selectedCategories = Array.isArray(req.query.categories) ? req.query.categories : [];
//     const selectedBrands = Array.isArray(req.query.brands) ? req.query.brands : [];

//     // Build the filter object based on selected categories and brands
//     const filter = {
//       $or: [
//         { category: { $in: selectedCategories } },
//         { brand: { $in: selectedBrands } }
//       ]
//     };

//     // Use async.parallel to fetch product data and totalProducts concurrently
//     const results = await async.parallel({
//       productdata: async function () {
//         const productData = await Product.find(filter)
//           .skip((page - 1) * productsPerPage)
//           .limit(productsPerPage)
//           .exec();
//         return productData;
//       },
//       totalProducts: async function () {
//         const total = await Product.countDocuments(filter).exec();
//         console.log("Total Products:", total);
//         return total;
//       },
//     });


//     const { productdata, totalProducts } = results;

//     // Render your view with the fetched product data, categories, brands, and pagination information
//     res.render('productsView', {
//       productdata,
//       categories,
//       brands,
//       currentPage: page,
//       totalPages: Math.ceil(totalProducts / productsPerPage),
//       allCategory,
//       user
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Internal Server Error');
//   }
// };


//load Product details page

const loadProduct = async (req, res) => {
  try {
    const id = req.params.id
    const products = await Product.findById(id)
    const user = req.session.user_id;
    const cartQuantity = req.session.cartQuantity; // Include cart quantity in the rendering


    res.render('productDetails', { products,user,cartQuantity })
  } catch (error) {
    console.log(error.message);
  }
}

//Logout

const logout = async (req, res) => {
  try {
    req.session.user_id = null;
    res.redirect('/landingHome')
  } catch (error) {
    console.log(error.message);
  }
}

//user Profile

const loadUserProfile = async (req, res) => {
  try {
    const cartQuantity = req.session.cartQuantity;
    const user_id = req.session.user_id;
    const address = await Address.find({ user: user_id });
    const orderDetails = await Order.find({ user: user_id }).sort({ createdAt: -1 });

    if (user_id) {
      const user = await User.findById(user_id);
      res.render('account', { user, address, orderDetails, cartQuantity });
    }
  } catch (error) {
    console.log(error.message);
  }
};


const updateUserProfile = async(req,res) => {
  try {
      const userId = req.session.user_id;
      const {displayName, email, phoneNumber, currPass , newPass, confirmNewPassword } = req.body;
      console.log(displayName, email, phoneNumber, currPass , newPass, confirmNewPassword);
      const user = await User.findById(userId);
      if (currPass && !bcrypt.compareSync(currPass, user.password)) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

      user.name = displayName;
      user.mobile = phoneNumber;
      user.email = email

      if (newPass) {
        if (newPass !== confirmNewPassword) {
        return res.status(400).json({ success: false, message: 'New password and confirm password do not match' });
      }

      // Hash the new password
      const hashedPassword = bcrypt.hashSync(newPass, 10);
        user.password = hashedPassword;
      }

      const hashedPassword = bcrypt.hashSync(newPass, 10);
      user.password = hashedPassword;

      await user.save();
      res.redirect('/user');
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = {
  loadResendOtp,
  verifyResendOtp,
  verifyLogin,
  loadLogin,
  verifyOtp,
  loadOtp,
  insertUser,
  loadRegister,
  loadLandingPage,
  loadProduct,
  loadProductsView,
  logout,
  loadUserProfile,
  updateUserProfile
  // LoadfilterProducts
};
