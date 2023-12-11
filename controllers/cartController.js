const User = require('../models/userModel')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Cart = require('../models/cartModel');
const Address = require('../models/address')


const loadCart = async (req, res) => {
    try {
        const user = req.session.user_id;
        console.log(user);
        const userCart = await Cart.find({ user: user }).populate("products.product");
        console.log(userCart);

        let total = 0;

        if (userCart && userCart.length > 0) {
            userCart.forEach((cartItem) => {
                if (cartItem.products && cartItem.products.length > 0) {
                    cartItem.products.forEach((productItem) => {
                        const productTotal = productItem.product.sales_price * productItem.quantity;
                        total += productTotal;
                        productItem.subtotal = productTotal;
                    });
                }
            });
        }
        
        
        res.render('cart', {
            user,
            userCart,
            total,
        });
    } catch (error) {
        console.log(error.message);
    }
};


const addToCart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const productId = req.params.id;
        console.log(userId, productId);
        const product = await Product.findById(productId);

        let userCart = await Cart.findOne({ user: userId }).populate('products.product');
        console.log(userCart);

        if (!userCart) {
            userCart = await new Cart({ user: userId, products: [], total: 0 });
            console.log("new cart created ", userCart);
        }

        const existingItem = userCart.products.find(item => item.product.equals(productId));
        if (existingItem) {
            existingItem.quantity += 1;

            // Update subTotal for existing item
            existingItem.subTotal = existingItem.quantity * product.sales_price;
            if (existingItem.quantity > product.quantity) {
                existingItem.quantity = product.quantity;
                console.log("success");
            }
        } else {
            userCart.products.push({
                product: productId,
                quantity: 1,
                subTotal: product.sales_price,
            });
            console.log("success");
        }

        // Update total in userCart
        userCart.total = userCart.products.reduce((acc, item) => {
            return acc + (item.subTotal || 0);
        }, 0);

        await userCart.save();
        res.redirect('/cart');
    } catch (error) {
        console.log(error.message);
    }
};



const updateCart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { productId, newQuantity } = req.body;

        const userCart = await Cart.findOne({ user: userId }).populate('products.product');

        if (!userCart) {
            return res.status(404).json({ success: false, message: 'Cart not found for the user.' });
        }

        const productIndex = userCart.products.findIndex(item => item.product._id.toString() === productId);

        if (productIndex !== -1) {
            userCart.products[productIndex].quantity = parseInt(newQuantity, 10);//working
            userCart.products[productIndex].subTotal = userCart.products[productIndex].quantity * userCart.products[productIndex].product.sales_price;
            const productTotal = userCart.products[productIndex].subTotal;
            console.log(productTotal);


            const newTotal = userCart.products.reduce((acc, item) => {
                const itemSubTotal = item.subTotal || 0; // Handle the case where item.subTotal is undefined or NaN
                return acc + itemSubTotal;
            }, 0);
            userCart.total = newTotal
            console.log("//////////////", productTotal);
            console.log("?????????????", newTotal);

            await userCart.save();
            res.status(200).json({ success: true, total: newTotal, userCart, productTotal });
        } else {
            res.status(404).json({ success: false, message: 'Product not found in the cart.' });
        }
    } catch (error) {
        console.log(error.message);
    }
};


const removeProduct = async (req, res) => {
    try {
      const productId = req.query.id;
      const user = req.session.user_id;
  
      const userCart = await Cart.findOne({ user: user });
  
      if (userCart) {
        const productIndex = userCart.products.findIndex((item) =>
          item.product.toString() === productId
        );
  
        if (productIndex !== -1) {
          const removedProduct = userCart.products[productIndex];
          console.log(removedProduct);
  
          const removedsubTotal = removedProduct.subTotal;
          console.log(removedsubTotal);
  
          userCart.products.splice(productIndex, 1);
  
          // Check if removedsubTotal is a valid number
          if (!isNaN(removedsubTotal)) {
            userCart.total = userCart.total - removedsubTotal;
          } else {
            // Handle the case where removedsubTotal is not a number
            console.error('Invalid removedsubTotal:', removedsubTotal);
          }
  
          await userCart.save();
  
          res.redirect('/cart');
        } else {
          console.log('Product not found in the cart');
          res.redirect('/cart');
        }
      } else {
        console.log('Cart not found for the user');
        res.redirect('/cart');
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

module.exports ={
    loadCart,
    addToCart,
    updateCart,
    removeProduct
}