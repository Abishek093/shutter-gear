const asyncHandler = require('express-async-handler');
const Product = require('../model/productModel.js');
const Category = require('../model/categoryModel.js');
const User = require('../model/userModel.js')



//search in header by category-------------------------------------------------------------

const filterSearch = asyncHandler(async (req, res) => {
    try {


        const product = await Product.find({
            isDeleted: false,
            $or: [
                { category: { $regex: ${ req.body.search }, $options: 'i'}},
    { title: { $regex:${ req.body.search } , $options: 'i' } }
            ]
        });

console.log("))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))", product);
console.log("---------------------------------------------------------------------------", product.length);
let cat;
if (product.length > 0) {
    cat = product[0].category
    const itemsperpage = 8;
    const currentpage = parseInt(req.query.page) || 1;
    const startindex = (currentpage - 1) * itemsperpage;
    const endindex = startindex + itemsperpage;
    const totalpages = Math.ceil(product.length / 8);
    const currentproduct = product.slice(startindex, endindex);



    res.render('filter', { product: currentproduct, totalpages, currentpage, cat })


} else {
    const products = []
    cat = ""
    const itemsperpage = 8;
    const currentpage = parseInt(req.query.page) || 1;
    const startindex = (currentpage - 1) * itemsperpage;
    const endindex = startindex + itemsperpage;
    const totalpages = Math.ceil(products.length / 8);
    const currentproduct = products.slice(startindex, endindex);
    console.log("--------------------------------------------------------------++++++++++++", currentpage);



    res.render('filter', { product: currentproduct, totalpages, currentpage, cat })
}
       
        
       
        
    } catch (error) {
    console.log('Error happent in filter controller in filterSearch funttion', error);
}
})


//filter by size----------------------------------------------------------------------------

const sizeFilter = asyncHandler(async (req, res) => {
    try {
        const size = req.query.size;
        const cat = req.query.cat

        console.log("------------------------------------------------", cat);
        const product = await Product.find({ $and: [{ size: size }, { category: cat }, { isDeleted: false }] })
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=", product);
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex, endindex);
        res.render('filter', { product: currentproduct, totalpages, currentpage, cat })
    } catch (error) {
        console.log('Error happent in filter controller in sizefilter funttion', error);

    }
});



//filter by color---------------------------------------------------------------------

const colorFilter = asyncHandler(async (req, res) => {
    try {
        const color = req.query.color;
        const cat = req.query.cat
        const product = await Product.find({ $and: [{ color: color }, { category: cat }] })
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex, endindex);
        res.render('filter', { product: currentproduct, totalpages, currentpage, cat })

    } catch (error) {
        console.log('Error happent in filter controller in colorfilter funttion', error);

    }
});


//filter by price-----------------------------------------------------------------------

const priceFilter = asyncHandler(async (req, res) => {
    try {

        const price = req.query.price;
        const cat = req.query.cat
        const maxPrice = req.query.maxPrice;
        const product = await Product.find({ $and: [{ price: { $gte: price } }, { price: { $lte: maxPrice } }, { category: cat }] });

        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex, endindex);
        res.render('filter', { product: currentproduct, totalpages, currentpage, cat })


    } catch (error) {
        console.log('Error happent in filter controller in pricefilter funttion', error);

    }
});


//brand filter-----------------------------------------------------------------------------

const brandFilter = asyncHandler(async (req, res) => {
    try {
        const brand = req.query.brand;
        const cat = req.query.cat
        console.log(cat, "this is cat");
        const product = await Product.find({ $and: [{ brand: brand }, { category: cat }] })
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex, endindex);
        res.render('filter', { product: currentproduct, totalpages, currentpage, cat })


    } catch (error) {
        console.log('Error happent in filter controller in brandfilter funttion', error);

    }
})


//category filter--------------------------------------------------------------------------
const CategoryFilter = asyncHandler(async (req, res) => {
    try {
        const category = req.query.category
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.", category)
        console.log("catergory")
        console.log(category)
        const product = await Product.find({ category: category })
        console.log("-------------------------------------------------------------------", product);
        const cat = category
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex, endindex);
        res.render('filter', { product: currentproduct, totalpages, currentpage, cat })


    } catch (error) {
        console.log('Error happent in filter controller in CategoryFilter funttion', error);

    }
})


//--------------clear the fi;lter and show all the data-------------------
const clearFilter = asyncHandler(async (req, res) => {
    try {

        const product = await Product.find()
        const cat = ''
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex, endindex);
        res.render('filter', { product: currentproduct, totalpages, currentpage, cat })



    } catch (error) {
        console.log('Error happent in filter controller in clearFilter funttion', error);

    }
})

//---------------------sort by price-------------
const sortByPrice = asyncHandler(async (req, res) => {


    try {
        const cat = req.query.cat
        const sort = req.query.sort;
        console.log(sort, ">>>>>>>>>");
        let sortOrder
        if (sort == "lowToHigh") {
            sortOrder = 1
        } else {
            sortOrder = -1
        }

        console.log(sortOrder, ">>>>>>>>>");

        let product = await Product.find({ category: cat }).sort({ price: sortOrder });
        console.log(sortOrder, ">>>>>>>>>");

        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex, endindex);


        res.render('filter', { product: currentproduct, totalpages, currentpage, cat });
    } catch (error) {
        console.log('Error happened in filter controller in sortByPrice function', error);
    }
});


//product search in header-----------------------------------------------------------------


const productSearch = asyncHandler(async (req, res) => {
    try {

        console.log(req.body);

        const product = await Product.find({
            title: { $regex: ${ req.body.search }, $options: 'i'}
        })

const itemsperpage = 6;
const currentpage = parseInt(req.query.page) || 1;
const startindex = (currentpage - 1) * itemsperpage;
const endindex = startindex + itemsperpage;
const totalpages = Math.ceil(product.length / 6);
const currentproduct = product.slice(startindex, endindex);



res.render('filter', { product: currentproduct, totalpages, currentpage, })
        
    } catch (error) {
    console.log('Error happent in filter controller in ProductSearch funttion', error);
}
})






module.exports = {
    productSearch,
    CategoryFilter,
    filterSearch,
    sizeFilter,
    colorFilter,
    priceFilter,
    brandFilter,
    clearFilter,
    sortByPrice


}


const loadCart = async (req, res) => {
    try {
        const user = req.session.user_id;
        console.log(user);

        const userCart = await Cart.findOne({ user: user }).populate("products.product");

        if (userCart) {
            // Iterate through each product in the cart
            for (const cartItem of userCart.products) {
                const productId = cartItem.product._id;
                // Use the productId to log details or perform any other operations
                console.log(`Product details for productId: ${productId}`, cartItem.product);
            }

            res.render('cart', {
                user,
                userCart,
            });
        } else {
            // Handle the case where the user's cart is not found
            console.log("User's cart not found");
            res.render('cart', {
                user,
                userCart: null,
            });
        }
    } catch (error) {
        console.log(error.message);
        // Handle other errors if necessary
        res.status(500).send("Internal Server Error");
    }
};



========================================================================================================

<script>

function modifyQuantity(productId, cartQty, count, prPrice, i, pqty) {
    // Get the relevant HTML elements
    const cartProductQtyElement = document.querySelector(#cartProductqty${i});
    const subtotalElement = document.querySelector(#subtotal${i});
    const totalElement = document.querySelector('#total');
    const finalTotalElement = document.querySelector('#finaltotal');

    // Get the current values from the HTML elements
    let currentQuantity = parseInt(cartProductQtyElement.value);
    const currentSubtotal = parseFloat(subtotalElement.innerText.replace('₹', ''));
    const currentTotal = parseFloat(totalElement.innerText.replace('₹', ''));

    // Calculate the new values
    const newQuantity = currentQuantity + count;

    // Prevent decrementing below 1
    if (count === -1 && newQuantity < 1) {
        return; // Don't update or send the AJAX request
    }

    // Prevent incrementing beyond the product's available quantity
    if (count === 1 && newQuantity > pqty) {
        Swal.fire({
            title: 'STOCK!',
            text: 'Product is out of stock.',
            icon: 'error',
            timer: 5000
        });
        return; // Don't update or send the AJAX request
    }

    const newSubtotal = newQuantity * prPrice;
    const newTotal = currentTotal - currentSubtotal + newSubtotal;

    // Update the HTML elements with the new values
    cartProductQtyElement.value = newQuantity;
    subtotalElement.innerHTML = ₹${newSubtotal.toFixed(2)};
    totalElement.innerHTML = ₹${newTotal.toFixed(2)};
    finalTotalElement.innerHTML = ₹${newTotal.toFixed(2)};

    // Now you can send the updated data in your AJAX request
    $.ajax({
        url: '/modifyCartQuantity',
        method: 'POST',
        data: {
            productId: productId,
            cartQty: newQuantity, // Send the updated quantity
            count: count
        },
        success: function (response) {
          if(response.status){

          }else{
            alert(response.error)
          }

        },

    });
}



function itemDelete(productId) {
  //alert(1);

  $.ajax({
    url: /deleteCartItem?id=${productId},
    method: 'GET',

    success: (response) => {
      //alert(2);
      if(response.status){
        //alert(3);
        location.reload();
      } else {
        alert('fail');
      }
    },
    error: (err) => {
      alert('Error during the request. Please try again later.');
      console.error(err);
    }
  });
}






</script>


const User = require('../model/userModel.js')
const Product = require('../model/productModel.js');


//get cart function--------------------------------------------------------------------------------

const getCart=asyncHandler(async(req,res)=>{
    try {

const userId=req.session.user;
const user=await User.findById(userId);
if(user){



const productIds =  user.cart.map(x => x.ProductId);

const product = await Product.find({ _id: { $in: productIds } });




let totalSubTotal = 0;
let quantity = 0;
for (const item of user.cart) {
    totalSubTotal += item.subTotal;
    quantity += item.quantity
}



        res.render('cart',{ product,cart: user.cart, quantity, totalSubTotal,user });
}


    } catch (error) {

        console.log("error in getcart function",error);
    }


});







//add to cart----------------------------------------------------------------------


const addToCart = asyncHandler(async (req, res) => {
    try {

        const id = req.query.id;
        const user = req.session.user;
        const product = await Product.findById(id);

        const userData = await User.findById(user);

        if (userData) {
            const cartItem = userData.cart.find(item => String(item.ProductId) === id);

            if (cartItem) {
                const updated = await User.updateOne(
                    { _id: user, 'cart.ProductId': id },
                    {
                        $inc: {
                            'cart.$.quantity': 1,
                            'cart.$.subTotal': product.price,
                        },
                    }
                );

            } else {
                userData.cart.push({
                    ProductId: id,
                    quantity: 1,
                    total: product.price,
                    subTotal: product.price,
                });

              const a=  await userData.save();

            }
        }

       res.json({status:true})
    } catch (error) {
        console.log('Error occurred in cart controller addToCart function', error);

    }
});



//delete cart item-------------------------------------------------------------------------------------------

const deleteCartItem = asyncHandler(async (req, res) => {
    try {
        const productId = req.query.id;

        console.log("+++++++++++++++++++++++++++++++++++",productId);
        const userId = req.session.user;
        const user = await User.findById(userId);

        if (user) {
            // Find the index of the cart item
            const itemIndex = user.cart.findIndex(item => item.ProductId.toString() === productId);

            console.log("________________________________",itemIndex);

            if (itemIndex !== -1) {
                // Remove the cart item using the index
                user.cart.splice(itemIndex, 1);
                const a=await user.save();
                console.log('Item removed from cart',a);
                return res.json({status: true});
            } else {
                console.log('no cart item found');
                return res.json({status: false, message: 'No cart item found'});
            }
        } else {
            console.log('no user found');
            return res.json({status: false, message: 'No user found'});
        }

    } catch (error) {
        console.log("error in cart control", error);
        return res.status(500).json({status: false, message: 'Internal Server Error'});
    }
});





//add and subtract product count in cart---------------------------------------------

const modifyCartQuantity=asyncHandler(async(req,res)=>{
    try {

        const productId=req.body.productId;

    const userId=req.session.user;

    const count = req.body.count;



    const user=await User.findById(userId);

    const product=await Product.findById(productId);


    if(user)


    {
        const cartItem=user.cart.find(item=>item.ProductId==productId);

        if(cartItem)


        {
            let newQuantity;
            if(count=='1')
            {
                newQuantity = cartItem.quantity + 1;
            }
            else if(count=='-1')
            {
                newQuantity = cartItem.quantity - 1;
            }else{
               res.json({ status: false, error: "Invalid count" });
            }
            if (newQuantity > 0 && newQuantity <= product.quantity) {
                const updated = await User.updateOne(
                    { _id: userId, 'cart.ProductId': productId },
                    {
                        $set: {
                            'cart.$.quantity': newQuantity, // Update the quantity
                            'cart.$.subTotal': (product.price * newQuantity), // Update the subtotal
                        },
                    }
                );
                const updatedUser = await user.save();
                console.log("this is upsdated ",updatedUser);

                    const totalAmount = product.price * newQuantity;

                    res.json({ status: true, quantityInput: newQuantity, total: totalAmount });
                } else {


                    res.json({ status: false, error: 'out of stock' });
                }
        }
    }

    } catch (error) {
        console.error('ERROR hapence in cart ctrl in the funtion update crt',error);
        return res.status(500).json({ status: false, error: "Server error" });
    }



})


//delete cart------------------------------------------------------------------------

const deleteCart=asyncHandler(async(req,res)=>{
    try {


const userId = req.session.user;
    const user = await User.findById(userId);

user.cart=[]
    const updatedUser = await user.save();
   console.log('this is updated user',updatedUser);
    res.json({status:true})

    } catch (error) {
        console.log('errro happemce in cart ctrl in function deletCart',error);
    }

})













module.exports={
    addToCart,
    getCart,
    deleteCartItem,
    modifyCartQuantity,
    deleteCart
}



/////////////////////////////////////////////before RAzorpay
<script>
        let addressId='';
        let PaymentMethod='';

        function selectAddress(id){
            addressId=id;
            console.log(addressId);
        }

        function selectPeyment(payment) {
            PaymentMethod=payment;
            console.log(PaymentMethod);
        }

async function orderConfirm(){

        
    const confirmed = await Swal.fire({
        title : 'Confirm Order',
        text : "are you sure you want procced with the order ",
        icon : 'question',
        showCancelButton : true,
        confirmButtonText : 'Yes ',
        cancelButtonText : 'No, cancel',

    });

    
    if (confirmed.isConfirmed){
        
        try {
            const response = await fetch('/confirm-order',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({ addressId , PaymentMethod })
            
        })
        

        if (response.ok) {
            await Swal.fire('Success' , 'Order Placed succesfully ',  'success')

            window.location.href = '/success-page'
        }else{
            await Swal.fire('error', 'Failed to place the order', 'error')
        }
            
        } catch (error) {
            console.log(error);
        }
    }  
        }

    

</script>
///////////////////////////////////////////////////////////////////////////////

const confirmOrder = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const addressId = req.body.addressId;
        const paymentMethod = req.body.PaymentMethod;

        if (!addressId || !paymentMethod) {
            return res.status(400).json({ error: 'AddressId and PaymentMethod are required' });
        }

        const cart = await Cart.findOne({ user: userId }).populate('products.product');

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Cart is empty or not found' });
        }

        const order = {
            user: req.session.user_id,
            address: addressId,
            paymentMethod: paymentMethod,
            products: cart.products.map((item) => {
                return {
                    product: item.product,
                    quantity: item.quantity,
                    price: item.product.sales_price,
                    total: item.subTotal
                };
            }),
            grandTotal: cart.total
        };

        await Order.insertMany(order);
        await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [], total: 0 } });
        
        if (order.paymentMethod === 'Cash On Delivery') {
            res.status(200).json({ message: 'success' });
        } else if (order.paymentMethod === 'Razorpay') {
            const total = cart.total;
            const generateOrder = generateOrderRazorpay(total);
            res.status(200).send({
                status: 'razorpay',
                success: true,
                msg: 'order created',
                order_id: generateOrder.orderId,
                amount: generateOrder.amount,
                key_id: process.env.RAZORPAY_KEY_ID,
                contact: '8943759719',
                name: 'admin',
                email: 'admin@gmail.com'
            });
        } else {
            res.status(400).send({
                success: false,
                msg: 'Invalid payment method',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};





/////////////////////JENCY

/*!
 * Cropper.js v1.5.13
 * https://fengyuanchen.github.io/cropperjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2022-11-20T05:30:46.114Z
 */
!(function (t, e) {
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = e())
      : 'function' == typeof define && define.amd
      ? define(e)
      : ((t = 'undefined' != typeof globalThis ? globalThis : t || self).Cropper = e());
  })(this, function () {
    'use strict';
    function C(e, t) {
      var i,
        a = Object.keys(e);
      return (
        Object.getOwnPropertySymbols &&
          ((i = Object.getOwnPropertySymbols(e)),
          t &&
            (i = i.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
          a.push.apply(a, i)),
        a
      );
    }
    function S(a) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? C(Object(n), !0).forEach(function (t) {
              var e, i;
              (e = a),
                (i = n[(t = t)]),
                t in e
                  ? Object.defineProperty(e, t, {
                      value: i,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (e[t] = i);
            })
          : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(a, Object.getOwnPropertyDescriptors(n))
          : C(Object(n)).forEach(function (t) {
              Object.defineProperty(a, t, Object.getOwnPropertyDescriptor(n, t));
            });
      }
      return a;
    }
    function D(t) {
      return (D =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t &&
                'function' == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? 'symbol'
                : typeof t;
            })(t);
    }
    function A(t, e) {
      for (var i = 0; i < e.length; i++) {
        var a = e[i];
        (a.enumerable = a.enumerable || !1),
          (a.configurable = !0),
          'value' in a && (a.writable = !0),
          Object.defineProperty(t, a.key, a);
      }
    }
    function j(t) {
      return (
        (function (t) {
          if (Array.isArray(t)) return a(t);
        })(t) ||
        (function (t) {
          if (('undefined' != typeof Symbol && null != t[Symbol.iterator]) || null != t['@@iterator'])
            return Array.from(t);
        })(t) ||
        (function (t, e) {
          var i;
          if (t)
            return 'string' == typeof t
              ? a(t, e)
              : 'Map' ===
                  (i =
                    'Object' === (i = Object.prototype.toString.call(t).slice(8, -1)) && t.constructor
                      ? t.constructor.name
                      : i) || 'Set' === i
              ? Array.from(t)
              : 'Arguments' === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)
              ? a(t, e)
              : void 0;
        })(t) ||
        (function () {
          throw new TypeError(
            'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
          );
        })()
      );
    }
    function a(t, e) {
      (null == e || e > t.length) && (e = t.length);
      for (var i = 0, a = new Array(e); i < e; i++) a[i] = t[i];
      return a;
    }
    var t = 'undefined' != typeof window && void 0 !== window.document,
      h = t ? window : {},
      e = !(!t || !h.document.documentElement) && 'ontouchstart' in h.document.documentElement,
      i = t && 'PointerEvent' in h,
      c = 'cropper',
      P = 'all',
      I = 'crop',
      U = 'move',
      q = 'zoom',
      B = 'e',
      k = 'w',
      O = 's',
      T = 'n',
      E = 'ne',
      W = 'nw',
      H = 'se',
      N = 'sw',
      $ = ''.concat(c, '-crop'),
      Q = ''.concat(c, '-disabled'),
      L = ''.concat(c, '-hidden'),
      K = ''.concat(c, '-hide'),
      Z = ''.concat(c, '-invisible'),
      n = ''.concat(c, '-modal'),
      G = ''.concat(c, '-move'),
      d = ''.concat(c, 'Action'),
      m = ''.concat(c, 'Preview'),
      V = 'crop',
      F = 'move',
      J = 'none',
      _ = 'crop',
      tt = 'cropend',
      et = 'cropmove',
      it = 'cropstart',
      at = 'dblclick',
      nt = i ? 'pointerdown' : e ? 'touchstart' : 'mousedown',
      ot = i ? 'pointermove' : e ? 'touchmove' : 'mousemove',
      ht = i ? 'pointerup pointercancel' : e ? 'touchend touchcancel' : 'mouseup',
      rt = 'zoom',
      st = 'image/jpeg',
      ct = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/,
      dt = /^data:/,
      lt = /^data:image\/jpeg;base64,/,
      pt = /^img|canvas$/i,
      mt = {
        viewMode: 0,
        dragMode: V,
        initialAspectRatio: NaN,
        aspectRatio: NaN,
        data: null,
        preview: '',
        responsive: !0,
        restore: !0,
        checkCrossOrigin: !0,
        checkOrientation: !0,
        modal: !0,
        guides: !0,
        center: !0,
        highlight: !0,
        background: !0,
        autoCrop: !0,
        autoCropArea: 0.8,
        movable: !0,
        rotatable: !0,
        scalable: !0,
        zoomable: !0,
        zoomOnTouch: !0,
        zoomOnWheel: !0,
        wheelZoomRatio: 0.1,
        cropBoxMovable: !0,
        cropBoxResizable: !0,
        toggleDragModeOnDblclick: !0,
        minCanvasWidth: 0,
        minCanvasHeight: 0,
        minCropBoxWidth: 0,
        minCropBoxHeight: 0,
        minContainerWidth: 400,
        minContainerHeight: 300,
        ready: null,
        cropstart: null,
        cropmove: null,
        cropend: null,
        crop: null,
        zoom: null,
      },
      ut = Number.isNaN || h.isNaN;
    function p(t) {
      return 'number' == typeof t && !ut(t);
    }
    function gt(t) {
      return 0 < t && t < 1 / 0;
    }
    function ft(t) {
      return void 0 === t;
    }
    function o(t) {
      return 'object' === D(t) && null !== t;
    }
    var vt = Object.prototype.hasOwnProperty;
    function u(t) {
      if (!o(t)) return !1;
      try {
        var e = t.constructor,
          i = e.prototype;
        return e && i && vt.call(i, 'isPrototypeOf');
      } catch (t) {
        return !1;
      }
    }
    function l(t) {
      return 'function' == typeof t;
    }
    var wt = Array.prototype.slice;
    function bt(t) {
      return Array.from ? Array.from(t) : wt.call(t);
    }
    function z(i, a) {
      return (
        i &&
          l(a) &&
          (Array.isArray(i) || p(i.length)
            ? bt(i).forEach(function (t, e) {
                a.call(i, t, e, i);
              })
            : o(i) &&
              Object.keys(i).forEach(function (t) {
                a.call(i, i[t], t, i);
              })),
        i
      );
    }
    var g =
        Object.assign ||
        function (i) {
          for (var t = arguments.length, e = new Array(1 < t ? t - 1 : 0), a = 1; a < t; a++)
            e[a - 1] = arguments[a];
          return (
            o(i) &&
              0 < e.length &&
              e.forEach(function (e) {
                o(e) &&
                  Object.keys(e).forEach(function (t) {
                    i[t] = e[t];
                  });
              }),
            i
          );
        },
      yt = /\.\d*(?:0|9){12}\d*$/;
    function Y(t, e) {
      e = 1 < arguments.length && void 0 !== e ? e : 1e11;
      return yt.test(t) ? Math.round(t * e) / e : t;
    }
    var xt = /^width|height|left|top|marginLeft|marginTop$/;
    function f(t, e) {
      var i = t.style;
      z(e, function (t, e) {
        xt.test(e) && p(t) && (t = ''.concat(t, 'px')), (i[e] = t);
      });
    }
    function v(t, e) {
      var i;
      e &&
        (p(t.length)
          ? z(t, function (t) {
              v(t, e);
            })
          : t.classList
          ? t.classList.add(e)
          : (i = t.className.trim())
          ? i.indexOf(e) < 0 && (t.className = ''.concat(i, ' ').concat(e))
          : (t.className = e));
    }
    function X(t, e) {
      e &&
        (p(t.length)
          ? z(t, function (t) {
              X(t, e);
            })
          : t.classList
          ? t.classList.remove(e)
          : 0 <= t.className.indexOf(e) && (t.className = t.className.replace(e, '')));
    }
    function r(t, e, i) {
      e &&
        (p(t.length)
          ? z(t, function (t) {
              r(t, e, i);
            })
          : (i ? v : X)(t, e));
    }
    var Mt = /([a-z\d])([A-Z])/g;
    function Ct(t) {
      return t.replace(Mt, '$1-$2').toLowerCase();
    }
    function Dt(t, e) {
      return o(t[e]) ? t[e] : t.dataset ? t.dataset[e] : t.getAttribute('data-'.concat(Ct(e)));
    }
    function w(t, e, i) {
      o(i) ? (t[e] = i) : t.dataset ? (t.dataset[e] = i) : t.setAttribute('data-'.concat(Ct(e)), i);
    }
    var Bt,
      kt,
      Ot = /\s\s*/,
      Tt =
        ((kt = !1),
        t &&
          ((Bt = !1),
          (i = function () {}),
          (e = Object.defineProperty({}, 'once', {
            get: function () {
              return (kt = !0), Bt;
            },
            set: function (t) {
              Bt = t;
            },
          })),
          h.addEventListener('test', i, e),
          h.removeEventListener('test', i, e)),
        kt);
    function s(i, t, a, e) {
      var n = 3 < arguments.length && void 0 !== e ? e : {},
        o = a;
      t.trim()
        .split(Ot)
        .forEach(function (t) {
          var e;
          Tt ||
            ((e = i.listeners) &&
              e[t] &&
              e[t][a] &&
              ((o = e[t][a]),
              delete e[t][a],
              0 === Object.keys(e[t]).length && delete e[t],
              0 === Object.keys(e).length) &&
              delete i.listeners),
            i.removeEventListener(t, o, n);
        });
    }
    function b(o, t, h, e) {
      var r = 3 < arguments.length && void 0 !== e ? e : {},
        s = h;
      t.trim()
        .split(Ot)
        .forEach(function (a) {
          var t, n;
          r.once &&
            !Tt &&
            ((t = o.listeners),
            (s = function () {
              delete n[a][h], o.removeEventListener(a, s, r);
              for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++) e[i] = arguments[i];
              h.apply(o, e);
            }),
            (n = void 0 === t ? {} : t)[a] || (n[a] = {}),
            n[a][h] && o.removeEventListener(a, n[a][h], r),
            (n[a][h] = s),
            (o.listeners = n)),
            o.addEventListener(a, s, r);
        });
    }
    function y(t, e, i) {
      var a;
      return (
        l(Event) && l(CustomEvent)
          ? (a = new CustomEvent(e, { detail: i, bubbles: !0, cancelable: !0 }))
          : (a = document.createEvent('CustomEvent')).initCustomEvent(e, !0, !0, i),
        t.dispatchEvent(a)
      );
    }
    function Et(t) {
      t = t.getBoundingClientRect();
      return {
        left: t.left + (window.pageXOffset - document.documentElement.clientLeft),
        top: t.top + (window.pageYOffset - document.documentElement.clientTop),
      };
    }
    var Wt = h.location,
      Ht = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;
    function Nt(t) {
      t = t.match(Ht);
      return null !== t && (t[1] !== Wt.protocol || t[2] !== Wt.hostname || t[3] !== Wt.port);
    }
    function Lt(t) {
      var e = 'timestamp='.concat(new Date().getTime());
      return t + (-1 === t.indexOf('?') ? '?' : '&') + e;
    }
    function x(t) {
      var e = t.rotate,
        i = t.scaleX,
        a = t.scaleY,
        n = t.translateX,
        t = t.translateY,
        o = [],
        n =
          (p(n) && 0 !== n && o.push('translateX('.concat(n, 'px)')),
          p(t) && 0 !== t && o.push('translateY('.concat(t, 'px)')),
          p(e) && 0 !== e && o.push('rotate('.concat(e, 'deg)')),
          p(i) && 1 !== i && o.push('scaleX('.concat(i, ')')),
          p(a) && 1 !== a && o.push('scaleY('.concat(a, ')')),
          o.length ? o.join(' ') : 'none');
      return { WebkitTransform: n, msTransform: n, transform: n };
    }
    function M(t, e) {
      var i = t.pageX,
        t = t.pageY,
        a = { endX: i, endY: t };
      return e ? a : S({ startX: i, startY: t }, a);
    }
    function R(t, e) {
      var i,
        a = t.aspectRatio,
        n = t.height,
        t = t.width,
        e = 1 < arguments.length && void 0 !== e ? e : 'contain',
        o = gt(t),
        h = gt(n);
      return (
        o && h
          ? ((i = n * a),
            ('contain' === e && t < i) || ('cover' === e && i < t) ? (n = t / a) : (t = n * a))
          : o
          ? (n = t / a)
          : h && (t = n * a),
        { width: t, height: n }
      );
    }
    var zt = String.fromCharCode;
    var Yt = /^data:.*,/;
    function Xt(t) {
      var e,
        i,
        a,
        n,
        o,
        h,
        r,
        s = new DataView(t);
      try {
        if (255 === s.getUint8(0) && 216 === s.getUint8(1))
          for (var c = s.byteLength, d = 2; d + 1 < c; ) {
            if (255 === s.getUint8(d) && 225 === s.getUint8(d + 1)) {
              i = d;
              break;
            }
            d += 1;
          }
        if (
          (a =
            i &&
            ((n = i + 10),
            'Exif' ===
              (function (t, e, i) {
                var a = '';
                i += e;
                for (var n = e; n < i; n += 1) a += zt(t.getUint8(n));
                return a;
              })(s, i + 4, 4)) &&
            ((r = 18761 === (o = s.getUint16(n))) || 19789 === o) &&
            42 === s.getUint16(n + 2, r) &&
            8 <= (h = s.getUint32(n + 4, r))
              ? n + h
              : a)
        )
          for (var l, p = s.getUint16(a, r), m = 0; m < p; m += 1)
            if (((l = a + 12 * m + 2), 274 === s.getUint16(l, r))) {
              (l += 8), (e = s.getUint16(l, r)), s.setUint16(l, 1, r);
              break;
            }
      } catch (t) {
        e = 1;
      }
      return e;
    }
    var t = {
        render: function () {
          this.initContainer(),
            this.initCanvas(),
            this.initCropBox(),
            this.renderCanvas(),
            this.cropped && this.renderCropBox();
        },
        initContainer: function () {
          var t = this.element,
            e = this.options,
            i = this.container,
            a = this.cropper,
            n = Number(e.minContainerWidth),
            e = Number(e.minContainerHeight),
            n =
              (v(a, L),
              X(t, L),
              {
                width: Math.max(i.offsetWidth, 0 <= n ? n : 200),
                height: Math.max(i.offsetHeight, 0 <= e ? e : 100),
              });
          f(a, { width: (this.containerData = n).width, height: n.height }), v(t, L), X(a, L);
        },
        initCanvas: function () {
          var t = this.containerData,
            e = this.imageData,
            i = this.options.viewMode,
            a = Math.abs(e.rotate) % 180 == 90,
            n = a ? e.naturalHeight : e.naturalWidth,
            a = a ? e.naturalWidth : e.naturalHeight,
            e = n / a,
            o = t.width,
            h = t.height,
            e =
              (t.height * e > t.width
                ? 3 === i
                  ? (o = t.height * e)
                  : (h = t.width / e)
                : 3 === i
                ? (h = t.width / e)
                : (o = t.height * e),
              { aspectRatio: e, naturalWidth: n, naturalHeight: a, width: o, height: h });
          (this.canvasData = e),
            (this.limited = 1 === i || 2 === i),
            this.limitCanvas(!0, !0),
            (e.width = Math.min(Math.max(e.width, e.minWidth), e.maxWidth)),
            (e.height = Math.min(Math.max(e.height, e.minHeight), e.maxHeight)),
            (e.left = (t.width - e.width) / 2),
            (e.top = (t.height - e.height) / 2),
            (e.oldLeft = e.left),
            (e.oldTop = e.top),
            (this.initialCanvasData = g({}, e));
        },
        limitCanvas: function (t, e) {
          var i = this.options,
            a = this.containerData,
            n = this.canvasData,
            o = this.cropBoxData,
            h = i.viewMode,
            r = n.aspectRatio,
            s = this.cropped && o;
          t &&
            ((t = Number(i.minCanvasWidth) || 0),
            (i = Number(i.minCanvasHeight) || 0),
            1 < h
              ? ((t = Math.max(t, a.width)),
                (i = Math.max(i, a.height)),
                3 === h && (t < i * r ? (t = i * r) : (i = t / r)))
              : 0 < h &&
                (t
                  ? (t = Math.max(t, s ? o.width : 0))
                  : i
                  ? (i = Math.max(i, s ? o.height : 0))
                  : s && ((t = o.width) < (i = o.height) * r ? (t = i * r) : (i = t / r))),
            (t = (r = R({ aspectRatio: r, width: t, height: i })).width),
            (i = r.height),
            (n.minWidth = t),
            (n.minHeight = i),
            (n.maxWidth = 1 / 0),
            (n.maxHeight = 1 / 0)),
            e &&
              ((s ? 0 : 1) < h
                ? ((r = a.width - n.width),
                  (t = a.height - n.height),
                  (n.minLeft = Math.min(0, r)),
                  (n.minTop = Math.min(0, t)),
                  (n.maxLeft = Math.max(0, r)),
                  (n.maxTop = Math.max(0, t)),
                  s &&
                    this.limited &&
                    ((n.minLeft = Math.min(o.left, o.left + (o.width - n.width))),
                    (n.minTop = Math.min(o.top, o.top + (o.height - n.height))),
                    (n.maxLeft = o.left),
                    (n.maxTop = o.top),
                    2 === h) &&
                    (n.width >= a.width &&
                      ((n.minLeft = Math.min(0, r)), (n.maxLeft = Math.max(0, r))),
                    n.height >= a.height) &&
                    ((n.minTop = Math.min(0, t)), (n.maxTop = Math.max(0, t))))
                : ((n.minLeft = -n.width),
                  (n.minTop = -n.height),
                  (n.maxLeft = a.width),
                  (n.maxTop = a.height)));
        },
        renderCanvas: function (t, e) {
          var i,
            a,
            n,
            o,
            h = this.canvasData,
            r = this.imageData;
          e &&
            ((e = {
              width: r.naturalWidth * Math.abs(r.scaleX || 1),
              height: r.naturalHeight * Math.abs(r.scaleY || 1),
              degree: r.rotate || 0,
            }),
            (r = e.width),
            (o = e.height),
            (e = e.degree),
            (i =
              90 == (e = Math.abs(e) % 180)
                ? { width: o, height: r }
                : ((a = ((e % 90) * Math.PI) / 180),
                  (i = Math.sin(a)),
                  (n = r * (a = Math.cos(a)) + o * i),
                  (r = r * i + o * a),
                  90 < e ? { width: r, height: n } : { width: n, height: r })),
            (a = h.width * ((o = i.width) / h.naturalWidth)),
            (n = h.height * ((e = i.height) / h.naturalHeight)),
            (h.left -= (a - h.width) / 2),
            (h.top -= (n - h.height) / 2),
            (h.width = a),
            (h.height = n),
            (h.aspectRatio = o / e),
            (h.naturalWidth = o),
            (h.naturalHeight = e),
            this.limitCanvas(!0, !1)),
            (h.width > h.maxWidth || h.width < h.minWidth) && (h.left = h.oldLeft),
            (h.height > h.maxHeight || h.height < h.minHeight) && (h.top = h.oldTop),
            (h.width = Math.min(Math.max(h.width, h.minWidth), h.maxWidth)),
            (h.height = Math.min(Math.max(h.height, h.minHeight), h.maxHeight)),
            this.limitCanvas(!1, !0),
            (h.left = Math.min(Math.max(h.left, h.minLeft), h.maxLeft)),
            (h.top = Math.min(Math.max(h.top, h.minTop), h.maxTop)),
            (h.oldLeft = h.left),
            (h.oldTop = h.top),
            f(
              this.canvas,
              g({ width: h.width, height: h.height }, x({ translateX: h.left, translateY: h.top })),
            ),
            this.renderImage(t),
            this.cropped && this.limited && this.limitCropBox(!0, !0);
        },
        renderImage: function (t) {
          var e = this.canvasData,
            i = this.imageData,
            a = i.naturalWidth * (e.width / e.naturalWidth),
            n = i.naturalHeight * (e.height / e.naturalHeight);
          g(i, { width: a, height: n, left: (e.width - a) / 2, top: (e.height - n) / 2 }),
            f(
              this.image,
              g(
                { width: i.width, height: i.height },
                x(g({ translateX: i.left, translateY: i.top }, i)),
              ),
            ),
            t && this.output();
        },
        initCropBox: function () {
          var t = this.options,
            e = this.canvasData,
            i = t.aspectRatio || t.initialAspectRatio,
            t = Number(t.autoCropArea) || 0.8,
            a = { width: e.width, height: e.height };
          i && (e.height * i > e.width ? (a.height = a.width / i) : (a.width = a.height * i)),
            (this.cropBoxData = a),
            this.limitCropBox(!0, !0),
            (a.width = Math.min(Math.max(a.width, a.minWidth), a.maxWidth)),
            (a.height = Math.min(Math.max(a.height, a.minHeight), a.maxHeight)),
            (a.width = Math.max(a.minWidth, a.width * t)),
            (a.height = Math.max(a.minHeight, a.height * t)),
            (a.left = e.left + (e.width - a.width) / 2),
            (a.top = e.top + (e.height - a.height) / 2),
            (a.oldLeft = a.left),
            (a.oldTop = a.top),
            (this.initialCropBoxData = g({}, a));
        },
        limitCropBox: function (t, e) {
          var i,
            a,
            n = this.options,
            o = this.containerData,
            h = this.canvasData,
            r = this.cropBoxData,
            s = this.limited,
            c = n.aspectRatio;
          t &&
            ((t = Number(n.minCropBoxWidth) || 0),
            (n = Number(n.minCropBoxHeight) || 0),
            (i = s ? Math.min(o.width, h.width, h.width + h.left, o.width - h.left) : o.width),
            (a = s ? Math.min(o.height, h.height, h.height + h.top, o.height - h.top) : o.height),
            (t = Math.min(t, o.width)),
            (n = Math.min(n, o.height)),
            c &&
              (t && n ? (t < n * c ? (n = t / c) : (t = n * c)) : t ? (n = t / c) : n && (t = n * c),
              i < a * c ? (a = i / c) : (i = a * c)),
            (r.minWidth = Math.min(t, i)),
            (r.minHeight = Math.min(n, a)),
            (r.maxWidth = i),
            (r.maxHeight = a)),
            e &&
              (s
                ? ((r.minLeft = Math.max(0, h.left)),
                  (r.minTop = Math.max(0, h.top)),
                  (r.maxLeft = Math.min(o.width, h.left + h.width) - r.width),
                  (r.maxTop = Math.min(o.height, h.top + h.height) - r.height))
                : ((r.minLeft = 0),
                  (r.minTop = 0),
                  (r.maxLeft = o.width - r.width),
                  (r.maxTop = o.height - r.height)));
        },
        renderCropBox: function () {
          var t = this.options,
            e = this.containerData,
            i = this.cropBoxData;
          (i.width > i.maxWidth || i.width < i.minWidth) && (i.left = i.oldLeft),
            (i.height > i.maxHeight || i.height < i.minHeight) && (i.top = i.oldTop),
            (i.width = Math.min(Math.max(i.width, i.minWidth), i.maxWidth)),
            (i.height = Math.min(Math.max(i.height, i.minHeight), i.maxHeight)),
            this.limitCropBox(!1, !0),
            (i.left = Math.min(Math.max(i.left, i.minLeft), i.maxLeft)),
            (i.top = Math.min(Math.max(i.top, i.minTop), i.maxTop)),
            (i.oldLeft = i.left),
            (i.oldTop = i.top),
            t.movable &&
              t.cropBoxMovable &&
              w(this.face, d, i.width >= e.width && i.height >= e.height ? U : P),
            f(
              this.cropBox,
              g({ width: i.width, height: i.height }, x({ translateX: i.left, translateY: i.top })),
            ),
            this.cropped && this.limited && this.limitCanvas(!0, !0),
            this.disabled || this.output();
        },
        output: function () {
          this.preview(), y(this.element, _, this.getData());
        },
      },
      i = {
        initPreview: function () {
          var t = this.element,
            i = this.crossOrigin,
            e = this.options.preview,
            a = i ? this.crossOriginUrl : this.url,
            n = t.alt || 'The image to preview',
            o = document.createElement('img');
          i && (o.crossOrigin = i),
            (o.src = a),
            (o.alt = n),
            this.viewBox.appendChild(o),
            (this.viewBoxImage = o),
            e &&
              ('string' == typeof (o = e)
                ? (o = t.ownerDocument.querySelectorAll(e))
                : e.querySelector && (o = [e]),
              z((this.previews = o), function (t) {
                var e = document.createElement('img');
                w(t, m, { width: t.offsetWidth, height: t.offsetHeight, html: t.innerHTML }),
                  i && (e.crossOrigin = i),
                  (e.src = a),
                  (e.alt = n),
                  (e.style.cssText =
                    'display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;"'),
                  (t.innerHTML = ''),
                  t.appendChild(e);
              }));
        },
        resetPreview: function () {
          z(this.previews, function (e) {
            var i = Dt(e, m),
              i = (f(e, { width: i.width, height: i.height }), (e.innerHTML = i.html), e),
              e = m;
            if (o(i[e]))
              try {
                delete i[e];
              } catch (t) {
                i[e] = void 0;
              }
            else if (i.dataset)
              try {
                delete i.dataset[e];
              } catch (t) {
                i.dataset[e] = void 0;
              }
            else i.removeAttribute('data-'.concat(Ct(e)));
          });
        },
        preview: function () {
          var h = this.imageData,
            t = this.canvasData,
            e = this.cropBoxData,
            r = e.width,
            s = e.height,
            c = h.width,
            d = h.height,
            l = e.left - t.left - h.left,
            p = e.top - t.top - h.top;
          this.cropped &&
            !this.disabled &&
            (f(
              this.viewBoxImage,
              g({ width: c, height: d }, x(g({ translateX: -l, translateY: -p }, h))),
            ),
            z(this.previews, function (t) {
              var e = Dt(t, m),
                i = e.width,
                e = e.height,
                a = i,
                n = e,
                o = 1;
              r && (n = s * (o = i / r)),
                s && e < n && ((a = r * (o = e / s)), (n = e)),
                f(t, { width: a, height: n }),
                f(
                  t.getElementsByTagName('img')[0],
                  g(
                    { width: c * o, height: d * o },
                    x(g({ translateX: -l * o, translateY: -p * o }, h)),
                  ),
                );
            }));
        },
      },
      e = {
        bind: function () {
          var t = this.element,
            e = this.options,
            i = this.cropper;
          l(e.cropstart) && b(t, it, e.cropstart),
            l(e.cropmove) && b(t, et, e.cropmove),
            l(e.cropend) && b(t, tt, e.cropend),
            l(e.crop) && b(t, _, e.crop),
            l(e.zoom) && b(t, rt, e.zoom),
            b(i, nt, (this.onCropStart = this.cropStart.bind(this))),
            e.zoomable &&
              e.zoomOnWheel &&
              b(i, 'wheel', (this.onWheel = this.wheel.bind(this)), { passive: !1, capture: !0 }),
            e.toggleDragModeOnDblclick && b(i, at, (this.onDblclick = this.dblclick.bind(this))),
            b(t.ownerDocument, ot, (this.onCropMove = this.cropMove.bind(this))),
            b(t.ownerDocument, ht, (this.onCropEnd = this.cropEnd.bind(this))),
            e.responsive && b(window, 'resize', (this.onResize = this.resize.bind(this)));
        },
        unbind: function () {
          var t = this.element,
            e = this.options,
            i = this.cropper;
          l(e.cropstart) && s(t, it, e.cropstart),
            l(e.cropmove) && s(t, et, e.cropmove),
            l(e.cropend) && s(t, tt, e.cropend),
            l(e.crop) && s(t, _, e.crop),
            l(e.zoom) && s(t, rt, e.zoom),
            s(i, nt, this.onCropStart),
            e.zoomable && e.zoomOnWheel && s(i, 'wheel', this.onWheel, { passive: !1, capture: !0 }),
            e.toggleDragModeOnDblclick && s(i, at, this.onDblclick),
            s(t.ownerDocument, ot, this.onCropMove),
            s(t.ownerDocument, ht, this.onCropEnd),
            e.responsive && s(window, 'resize', this.onResize);
        },
      },
      Rt = {
        resize: function () {
          var t, e, i, a, n, o, h;
          this.disabled ||
            ((t = this.options),
            (a = this.container),
            (e = this.containerData),
            (i = a.offsetWidth / e.width),
            (a = a.offsetHeight / e.height),
            1 != (n = Math.abs(i - 1) > Math.abs(a - 1) ? i : a) &&
              (t.restore && ((o = this.getCanvasData()), (h = this.getCropBoxData())),
              this.render(),
              t.restore) &&
              (this.setCanvasData(
                z(o, function (t, e) {
                  o[e] = t * n;
                }),
              ),
              this.setCropBoxData(
                z(h, function (t, e) {
                  h[e] = t * n;
                }),
              )));
        },
        dblclick: function () {
          var t, e;
          this.disabled ||
            this.options.dragMode === J ||
            this.setDragMode(
              ((t = this.dragBox),
              (e = $),
              (t.classList ? t.classList.contains(e) : -1 < t.className.indexOf(e)) ? F : V),
            );
        },
        wheel: function (t) {
          var e = this,
            i = Number(this.options.wheelZoomRatio) || 0.1,
            a = 1;
          this.disabled ||
            (t.preventDefault(), this.wheeling) ||
            ((this.wheeling = !0),
            setTimeout(function () {
              e.wheeling = !1;
            }, 50),
            t.deltaY
              ? (a = 0 < t.deltaY ? 1 : -1)
              : t.wheelDelta
              ? (a = -t.wheelDelta / 120)
              : t.detail && (a = 0 < t.detail ? 1 : -1),
            this.zoom(-a * i, t));
        },
        cropStart: function (t) {
          var e,
            i = t.buttons,
            a = t.button;
          this.disabled ||
            (('mousedown' === t.type || ('pointerdown' === t.type && 'mouse' === t.pointerType)) &&
              ((p(i) && 1 !== i) || (p(a) && 0 !== a) || t.ctrlKey)) ||
            ((i = this.options),
            (e = this.pointers),
            t.changedTouches
              ? z(t.changedTouches, function (t) {
                  e[t.identifier] = M(t);
                })
              : (e[t.pointerId || 0] = M(t)),
            (a = 1 < Object.keys(e).length && i.zoomable && i.zoomOnTouch ? q : Dt(t.target, d)),
            ct.test(a) &&
              !1 !== y(this.element, it, { originalEvent: t, action: a }) &&
              (t.preventDefault(), (this.action = a), (this.cropping = !1), a === I) &&
              ((this.cropping = !0), v(this.dragBox, n)));
        },
        cropMove: function (t) {
          var e,
            i = this.action;
          !this.disabled &&
            i &&
            ((e = this.pointers),
            t.preventDefault(),
            !1 !== y(this.element, et, { originalEvent: t, action: i })) &&
            (t.changedTouches
              ? z(t.changedTouches, function (t) {
                  g(e[t.identifier] || {}, M(t, !0));
                })
              : g(e[t.pointerId || 0] || {}, M(t, !0)),
            this.change(t));
        },
        cropEnd: function (t) {
          var e, i;
          this.disabled ||
            ((e = this.action),
            (i = this.pointers),
            t.changedTouches
              ? z(t.changedTouches, function (t) {
                  delete i[t.identifier];
                })
              : delete i[t.pointerId || 0],
            e &&
              (t.preventDefault(),
              Object.keys(i).length || (this.action = ''),
              this.cropping &&
                ((this.cropping = !1), r(this.dragBox, n, this.cropped && this.options.modal)),
              y(this.element, tt, { originalEvent: t, action: e })));
        },
      },
      St = {
        change: function (t) {
          function e(t) {
            switch (t) {
              case B:
                f + D.x > y && (D.x = y - f);
                break;
              case k:
                p + D.x < w && (D.x = w - p);
                break;
              case T:
                m + D.y < b && (D.y = b - m);
                break;
              case O:
                v + D.y > x && (D.y = x - v);
            }
          }
          var i,
            a,
            o,
            n = this.options,
            h = this.canvasData,
            r = this.containerData,
            s = this.cropBoxData,
            c = this.pointers,
            d = this.action,
            l = n.aspectRatio,
            p = s.left,
            m = s.top,
            u = s.width,
            g = s.height,
            f = p + u,
            v = m + g,
            w = 0,
            b = 0,
            y = r.width,
            x = r.height,
            M = !0,
            C =
              (!l && t.shiftKey && (l = u && g ? u / g : 1),
              this.limited &&
                ((w = s.minLeft),
                (b = s.minTop),
                (y = w + Math.min(r.width, h.width, h.left + h.width)),
                (x = b + Math.min(r.height, h.height, h.top + h.height))),
              c[Object.keys(c)[0]]),
            D = { x: C.endX - C.startX, y: C.endY - C.startY };
          switch (d) {
            case P:
              (p += D.x), (m += D.y);
              break;
            case B:
              0 <= D.x && (y <= f || (l && (m <= b || x <= v)))
                ? (M = !1)
                : (e(B),
                  (u += D.x) < 0 && ((d = k), (p -= u = -u)),
                  l && (m += (s.height - (g = u / l)) / 2));
              break;
            case T:
              D.y <= 0 && (m <= b || (l && (p <= w || y <= f)))
                ? (M = !1)
                : (e(T),
                  (g -= D.y),
                  (m += D.y),
                  g < 0 && ((d = O), (m -= g = -g)),
                  l && (p += (s.width - (u = g * l)) / 2));
              break;
            case k:
              D.x <= 0 && (p <= w || (l && (m <= b || x <= v)))
                ? (M = !1)
                : (e(k),
                  (u -= D.x),
                  (p += D.x),
                  u < 0 && ((d = B), (p -= u = -u)),
                  l && (m += (s.height - (g = u / l)) / 2));
              break;
            case O:
              0 <= D.y && (x <= v || (l && (p <= w || y <= f)))
                ? (M = !1)
                : (e(O),
                  (g += D.y) < 0 && ((d = T), (m -= g = -g)),
                  l && (p += (s.width - (u = g * l)) / 2));
              break;
            case E:
              if (l) {
                if (D.y <= 0 && (m <= b || y <= f)) {
                  M = !1;
                  break;
                }
                e(T), (g -= D.y), (m += D.y), (u = g * l);
              } else
                e(T),
                  e(B),
                  !(0 <= D.x) || f < y ? (u += D.x) : D.y <= 0 && m <= b && (M = !1),
                  (!(D.y <= 0) || b < m) && ((g -= D.y), (m += D.y));
              u < 0 && g < 0
                ? ((d = N), (m -= g = -g), (p -= u = -u))
                : u < 0
                ? ((d = W), (p -= u = -u))
                : g < 0 && ((d = H), (m -= g = -g));
              break;
            case W:
              if (l) {
                if (D.y <= 0 && (m <= b || p <= w)) {
                  M = !1;
                  break;
                }
                e(T), (g -= D.y), (m += D.y), (p += s.width - (u = g * l));
              } else
                e(T),
                  e(k),
                  !(D.x <= 0) || w < p ? ((u -= D.x), (p += D.x)) : D.y <= 0 && m <= b && (M = !1),
                  (!(D.y <= 0) || b < m) && ((g -= D.y), (m += D.y));
              u < 0 && g < 0
                ? ((d = H), (m -= g = -g), (p -= u = -u))
                : u < 0
                ? ((d = E), (p -= u = -u))
                : g < 0 && ((d = N), (m -= g = -g));
              break;
            case N:
              if (l) {
                if (D.x <= 0 && (p <= w || x <= v)) {
                  M = !1;
                  break;
                }
                e(k), (u -= D.x), (p += D.x), (g = u / l);
              } else
                e(O),
                  e(k),
                  !(D.x <= 0) || w < p ? ((u -= D.x), (p += D.x)) : 0 <= D.y && x <= v && (M = !1),
                  (!(0 <= D.y) || v < x) && (g += D.y);
              u < 0 && g < 0
                ? ((d = E), (m -= g = -g), (p -= u = -u))
                : u < 0
                ? ((d = H), (p -= u = -u))
                : g < 0 && ((d = W), (m -= g = -g));
              break;
            case H:
              if (l) {
                if (0 <= D.x && (y <= f || x <= v)) {
                  M = !1;
                  break;
                }
                e(B), (g = (u += D.x) / l);
              } else
                e(O),
                  e(B),
                  !(0 <= D.x) || f < y ? (u += D.x) : 0 <= D.y && x <= v && (M = !1),
                  (!(0 <= D.y) || v < x) && (g += D.y);
              u < 0 && g < 0
                ? ((d = W), (m -= g = -g), (p -= u = -u))
                : u < 0
                ? ((d = N), (p -= u = -u))
                : g < 0 && ((d = E), (m -= g = -g));
              break;
            case U:
              this.move(D.x, D.y), (M = !1);
              break;
            case q:
              this.zoom(
                ((a = S({}, (i = c))),
                (o = 0),
                z(i, function (n, t) {
                  delete a[t],
                    z(a, function (t) {
                      var e = Math.abs(n.startX - t.startX),
                        i = Math.abs(n.startY - t.startY),
                        a = Math.abs(n.endX - t.endX),
                        t = Math.abs(n.endY - t.endY),
                        e = Math.sqrt(e * e + i * i),
                        i = (Math.sqrt(a * a + t * t) - e) / e;
                      Math.abs(i) > Math.abs(o) && (o = i);
                    });
                }),
                o),
                t,
              ),
                (M = !1);
              break;
            case I:
              D.x && D.y
                ? ((i = Et(this.cropper)),
                  (p = C.startX - i.left),
                  (m = C.startY - i.top),
                  (u = s.minWidth),
                  (g = s.minHeight),
                  0 < D.x ? (d = 0 < D.y ? H : E) : D.x < 0 && ((p -= u), (d = 0 < D.y ? N : W)),
                  D.y < 0 && (m -= g),
                  this.cropped ||
                    (X(this.cropBox, L),
                    (this.cropped = !0),
                    this.limited && this.limitCropBox(!0, !0)))
                : (M = !1);
          }
          M &&
            ((s.width = u),
            (s.height = g),
            (s.left = p),
            (s.top = m),
            (this.action = d),
            this.renderCropBox()),
            z(c, function (t) {
              (t.startX = t.endX), (t.startY = t.endY);
            });
        },
      },
      At = {
        crop: function () {
          return (
            !this.ready ||
              this.cropped ||
              this.disabled ||
              ((this.cropped = !0),
              this.limitCropBox(!0, !0),
              this.options.modal && v(this.dragBox, n),
              X(this.cropBox, L),
              this.setCropBoxData(this.initialCropBoxData)),
            this
          );
        },
        reset: function () {
          return (
            this.ready &&
              !this.disabled &&
              ((this.imageData = g({}, this.initialImageData)),
              (this.canvasData = g({}, this.initialCanvasData)),
              (this.cropBoxData = g({}, this.initialCropBoxData)),
              this.renderCanvas(),
              this.cropped) &&
              this.renderCropBox(),
            this
          );
        },
        clear: function () {
          return (
            this.cropped &&
              !this.disabled &&
              (g(this.cropBoxData, { left: 0, top: 0, width: 0, height: 0 }),
              (this.cropped = !1),
              this.renderCropBox(),
              this.limitCanvas(!0, !0),
              this.renderCanvas(),
              X(this.dragBox, n),
              v(this.cropBox, L)),
            this
          );
        },
        replace: function (e) {
          var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1];
          return (
            !this.disabled &&
              e &&
              (this.isImg && (this.element.src = e),
              t
                ? ((this.url = e),
                  (this.image.src = e),
                  this.ready &&
                    ((this.viewBoxImage.src = e),
                    z(this.previews, function (t) {
                      t.getElementsByTagName('img')[0].src = e;
                    })))
                : (this.isImg && (this.replaced = !0),
                  (this.options.data = null),
                  this.uncreate(),
                  this.load(e))),
            this
          );
        },
        enable: function () {
          return this.ready && this.disabled && ((this.disabled = !1), X(this.cropper, Q)), this;
        },
        disable: function () {
          return this.ready && !this.disabled && ((this.disabled = !0), v(this.cropper, Q)), this;
        },
        destroy: function () {
          var t = this.element;
          return (
            t[c] &&
              ((t[c] = void 0),
              this.isImg && this.replaced && (t.src = this.originalUrl),
              this.uncreate()),
            this
          );
        },
        move: function (t) {
          var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : t,
            i = this.canvasData,
            a = i.left,
            i = i.top;
          return this.moveTo(ft(t) ? t : a + Number(t), ft(e) ? e : i + Number(e));
        },
        moveTo: function (t) {
          var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : t,
            i = this.canvasData,
            a = !1;
          return (
            (t = Number(t)),
            (e = Number(e)),
            this.ready &&
              !this.disabled &&
              this.options.movable &&
              (p(t) && ((i.left = t), (a = !0)), p(e) && ((i.top = e), (a = !0)), a) &&
              this.renderCanvas(!0),
            this
          );
        },
        zoom: function (t, e) {
          var i = this.canvasData;
          return (
            (t = Number(t)),
            this.zoomTo((i.width * (t = t < 0 ? 1 / (1 - t) : 1 + t)) / i.naturalWidth, null, e)
          );
        },
        zoomTo: function (t, e, i) {
          var a,
            n,
            o,
            h = this.options,
            r = this.canvasData,
            s = r.width,
            c = r.height,
            d = r.naturalWidth,
            l = r.naturalHeight;
          if (0 <= (t = Number(t)) && this.ready && !this.disabled && h.zoomable) {
            (h = d * t), (l = l * t);
            if (!1 === y(this.element, rt, { ratio: t, oldRatio: s / d, originalEvent: i }))
              return this;
            i
              ? ((t = this.pointers),
                (d = Et(this.cropper)),
                (t =
                  t && Object.keys(t).length
                    ? ((o = n = a = 0),
                      z(t, function (t) {
                        var e = t.startX,
                          t = t.startY;
                        (a += e), (n += t), (o += 1);
                      }),
                      { pageX: (a /= o), pageY: (n /= o) })
                    : { pageX: i.pageX, pageY: i.pageY }),
                (r.left -= (h - s) * ((t.pageX - d.left - r.left) / s)),
                (r.top -= (l - c) * ((t.pageY - d.top - r.top) / c)))
              : u(e) && p(e.x) && p(e.y)
              ? ((r.left -= (h - s) * ((e.x - r.left) / s)), (r.top -= (l - c) * ((e.y - r.top) / c)))
              : ((r.left -= (h - s) / 2), (r.top -= (l - c) / 2)),
              (r.width = h),
              (r.height = l),
              this.renderCanvas(!0);
          }
          return this;
        },
        rotate: function (t) {
          return this.rotateTo((this.imageData.rotate || 0) + Number(t));
        },
        rotateTo: function (t) {
          return (
            p((t = Number(t))) &&
              this.ready &&
              !this.disabled &&
              this.options.rotatable &&
              ((this.imageData.rotate = t % 360), this.renderCanvas(!0, !0)),
            this
          );
        },
        scaleX: function (t) {
          var e = this.imageData.scaleY;
          return this.scale(t, p(e) ? e : 1);
        },
        scaleY: function (t) {
          var e = this.imageData.scaleX;
          return this.scale(p(e) ? e : 1, t);
        },
        scale: function (t) {
          var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : t,
            i = this.imageData,
            a = !1;
          return (
            (t = Number(t)),
            (e = Number(e)),
            this.ready &&
              !this.disabled &&
              this.options.scalable &&
              (p(t) && ((i.scaleX = t), (a = !0)), p(e) && ((i.scaleY = e), (a = !0)), a) &&
              this.renderCanvas(!0, !0),
            this
          );
        },
        getData: function () {
          var i,
            a,
            t = 0 < arguments.length && void 0 !== arguments[0] && arguments[0],
            e = this.options,
            n = this.imageData,
            o = this.canvasData,
            h = this.cropBoxData;
          return (
            this.ready && this.cropped
              ? ((i = { x: h.left - o.left, y: h.top - o.top, width: h.width, height: h.height }),
                (a = n.width / n.naturalWidth),
                z(i, function (t, e) {
                  i[e] = t / a;
                }),
                t &&
                  ((o = Math.round(i.y + i.height)),
                  (h = Math.round(i.x + i.width)),
                  (i.x = Math.round(i.x)),
                  (i.y = Math.round(i.y)),
                  (i.width = h - i.x),
                  (i.height = o - i.y)))
              : (i = { x: 0, y: 0, width: 0, height: 0 }),
            e.rotatable && (i.rotate = n.rotate || 0),
            e.scalable && ((i.scaleX = n.scaleX || 1), (i.scaleY = n.scaleY || 1)),
            i
          );
        },
        setData: function (t) {
          var e,
            i = this.options,
            a = this.imageData,
            n = this.canvasData,
            o = {};
          return (
            this.ready &&
              !this.disabled &&
              u(t) &&
              ((e = !1),
              i.rotatable &&
                p(t.rotate) &&
                t.rotate !== a.rotate &&
                ((a.rotate = t.rotate), (e = !0)),
              i.scalable &&
                (p(t.scaleX) && t.scaleX !== a.scaleX && ((a.scaleX = t.scaleX), (e = !0)),
                p(t.scaleY)) &&
                t.scaleY !== a.scaleY &&
                ((a.scaleY = t.scaleY), (e = !0)),
              e && this.renderCanvas(!0, !0),
              (i = a.width / a.naturalWidth),
              p(t.x) && (o.left = t.x * i + n.left),
              p(t.y) && (o.top = t.y * i + n.top),
              p(t.width) && (o.width = t.width * i),
              p(t.height) && (o.height = t.height * i),
              this.setCropBoxData(o)),
            this
          );
        },
        getContainerData: function () {
          return this.ready ? g({}, this.containerData) : {};
        },
        getImageData: function () {
          return this.sized ? g({}, this.imageData) : {};
        },
        getCanvasData: function () {
          var e = this.canvasData,
            i = {};
          return (
            this.ready &&
              z(['left', 'top', 'width', 'height', 'naturalWidth', 'naturalHeight'], function (t) {
                i[t] = e[t];
              }),
            i
          );
        },
        setCanvasData: function (t) {
          var e = this.canvasData,
            i = e.aspectRatio;
          return (
            this.ready &&
              !this.disabled &&
              u(t) &&
              (p(t.left) && (e.left = t.left),
              p(t.top) && (e.top = t.top),
              p(t.width)
                ? ((e.width = t.width), (e.height = t.width / i))
                : p(t.height) && ((e.height = t.height), (e.width = t.height * i)),
              this.renderCanvas(!0)),
            this
          );
        },
        getCropBoxData: function () {
          var t,
            e = this.cropBoxData;
          return (
            (t =
              this.ready && this.cropped
                ? { left: e.left, top: e.top, width: e.width, height: e.height }
                : t) || {}
          );
        },
        setCropBoxData: function (t) {
          var e,
            i,
            a = this.cropBoxData,
            n = this.options.aspectRatio;
          return (
            this.ready &&
              this.cropped &&
              !this.disabled &&
              u(t) &&
              (p(t.left) && (a.left = t.left),
              p(t.top) && (a.top = t.top),
              p(t.width) && t.width !== a.width && ((e = !0), (a.width = t.width)),
              p(t.height) && t.height !== a.height && ((i = !0), (a.height = t.height)),
              n && (e ? (a.height = a.width / n) : i && (a.width = a.height * n)),
              this.renderCropBox()),
            this
          );
        },
        getCroppedCanvas: function () {
          var t,
            e,
            i,
            a,
            n,
            o,
            h,
            r,
            s,
            c,
            d,
            l,
            p,
            m,
            u,
            g,
            f,
            v,
            w,
            b,
            y,
            x,
            M,
            C,
            D,
            B,
            k,
            O = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
          return this.ready && window.HTMLCanvasElement
            ? ((B = this.canvasData),
              (u = this.image),
              (l = this.imageData),
              (a = B),
              (v = O),
              (g = l.aspectRatio),
              (e = l.naturalWidth),
              (n = l.naturalHeight),
              (c = void 0 === (c = l.rotate) ? 0 : c),
              (d = void 0 === (d = l.scaleX) ? 1 : d),
              (l = void 0 === (l = l.scaleY) ? 1 : l),
              (i = a.aspectRatio),
              (r = a.naturalWidth),
              (a = a.naturalHeight),
              (h = void 0 === (h = v.fillColor) ? 'transparent' : h),
              (p = void 0 === (p = v.imageSmoothingEnabled) || p),
              (m = void 0 === (m = v.imageSmoothingQuality) ? 'low' : m),
              (o = void 0 === (o = v.maxWidth) ? 1 / 0 : o),
              (k = void 0 === (k = v.maxHeight) ? 1 / 0 : k),
              (t = void 0 === (t = v.minWidth) ? 0 : t),
              (v = void 0 === (v = v.minHeight) ? 0 : v),
              (w = document.createElement('canvas')),
              (f = w.getContext('2d')),
              (s = R({ aspectRatio: i, width: o, height: k })),
              (i = R({ aspectRatio: i, width: t, height: v }, 'cover')),
              (r = Math.min(s.width, Math.max(i.width, r))),
              (s = Math.min(s.height, Math.max(i.height, a))),
              (i = R({ aspectRatio: g, width: o, height: k })),
              (a = R({ aspectRatio: g, width: t, height: v }, 'cover')),
              (o = Math.min(i.width, Math.max(a.width, e))),
              (k = Math.min(i.height, Math.max(a.height, n))),
              (g = [-o / 2, -k / 2, o, k]),
              (w.width = Y(r)),
              (w.height = Y(s)),
              (f.fillStyle = h),
              f.fillRect(0, 0, r, s),
              f.save(),
              f.translate(r / 2, s / 2),
              f.rotate((c * Math.PI) / 180),
              f.scale(d, l),
              (f.imageSmoothingEnabled = p),
              (f.imageSmoothingQuality = m),
              f.drawImage.apply(
                f,
                [u].concat(
                  j(
                    g.map(function (t) {
                      return Math.floor(Y(t));
                    }),
                  ),
                ),
              ),
              f.restore(),
              (t = w),
              this.cropped
                ? ((e = (v = this.getData()).x),
                  (i = v.y),
                  (a = v.width),
                  (n = v.height),
                  1 != (o = t.width / Math.floor(B.naturalWidth)) &&
                    ((e *= o), (i *= o), (a *= o), (n *= o)),
                  (h = R({
                    aspectRatio: (k = a / n),
                    width: O.maxWidth || 1 / 0,
                    height: O.maxHeight || 1 / 0,
                  })),
                  (r = R(
                    { aspectRatio: k, width: O.minWidth || 0, height: O.minHeight || 0 },
                    'cover',
                  )),
                  (c = (s = R({
                    aspectRatio: k,
                    width: O.width || (1 != o ? t.width : a),
                    height: O.height || (1 != o ? t.height : n),
                  })).width),
                  (d = s.height),
                  (c = Math.min(h.width, Math.max(r.width, c))),
                  (d = Math.min(h.height, Math.max(r.height, d))),
                  (p = (l = document.createElement('canvas')).getContext('2d')),
                  (l.width = Y(c)),
                  (l.height = Y(d)),
                  (p.fillStyle = O.fillColor || 'transparent'),
                  p.fillRect(0, 0, c, d),
                  (m = O.imageSmoothingEnabled),
                  (u = O.imageSmoothingQuality),
                  (p.imageSmoothingEnabled = void 0 === m || m),
                  u && (p.imageSmoothingQuality = u),
                  (g = t.width),
                  (f = t.height),
                  (w = i),
                  (v = e) <= -a || g < v
                    ? (C = x = b = v = 0)
                    : v <= 0
                    ? ((x = -v), (v = 0), (C = b = Math.min(g, a + v)))
                    : v <= g && ((x = 0), (C = b = Math.min(a, g - v))),
                  b <= 0 || w <= -n || f < w
                    ? (D = M = y = w = 0)
                    : w <= 0
                    ? ((M = -w), (w = 0), (D = y = Math.min(f, n + w)))
                    : w <= f && ((M = 0), (D = y = Math.min(n, f - w))),
                  (B = [v, w, b, y]),
                  0 < C && 0 < D && B.push(x * (k = c / a), M * k, C * k, D * k),
                  p.drawImage.apply(
                    p,
                    [t].concat(
                      j(
                        B.map(function (t) {
                          return Math.floor(Y(t));
                        }),
                      ),
                    ),
                  ),
                  l)
                : t)
            : null;
        },
        setAspectRatio: function (t) {
          var e = this.options;
          return (
            this.disabled ||
              ft(t) ||
              ((e.aspectRatio = Math.max(0, t) || NaN),
              this.ready && (this.initCropBox(), this.cropped) && this.renderCropBox()),
            this
          );
        },
        setDragMode: function (t) {
          var e,
            i,
            a = this.options,
            n = this.dragBox,
            o = this.face;
          return (
            this.ready &&
              !this.disabled &&
              ((i = a.movable && t === F),
              (a.dragMode = t = (e = t === V) || i ? t : J),
              w(n, d, t),
              r(n, $, e),
              r(n, G, i),
              a.cropBoxMovable || (w(o, d, t), r(o, $, e), r(o, G, i))),
            this
          );
        },
      },
      jt = h.Cropper,
      Pt = (function () {
        function n(t) {
          var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {},
            i = this,
            a = n;
          if (!(i instanceof a)) throw new TypeError('Cannot call a class as a function');
          if (!t || !pt.test(t.tagName))
            throw new Error(
              'The first argument is required and must be an <img> or <canvas> element.',
            );
          (this.element = t),
            (this.options = g({}, mt, u(e) && e)),
            (this.cropped = !1),
            (this.disabled = !1),
            (this.pointers = {}),
            (this.ready = !1),
            (this.reloading = !1),
            (this.replaced = !1),
            (this.sized = !1),
            (this.sizing = !1),
            this.init();
        }
        var t, e, i;
        return (
          (t = n),
          (i = [
            {
              key: 'noConflict',
              value: function () {
                return (window.Cropper = jt), n;
              },
            },
            {
              key: 'setDefaults',
              value: function (t) {
                g(mt, u(t) && t);
              },
            },
          ]),
          (e = [
            {
              key: 'init',
              value: function () {
                var t,
                  e = this.element,
                  i = e.tagName.toLowerCase();
                if (!e[c]) {
                  if (((e[c] = this), 'img' === i)) {
                    if (
                      ((this.isImg = !0), (t = e.getAttribute('src') || ''), !(this.originalUrl = t))
                    )
                      return;
                    t = e.src;
                  } else 'canvas' === i && window.HTMLCanvasElement && (t = e.toDataURL());
                  this.load(t);
                }
              },
            },
            {
              key: 'load',
              value: function (t) {
                var e,
                  i,
                  a,
                  n,
                  o,
                  h,
                  r = this;
                t &&
                  ((this.url = t),
                  (this.imageData = {}),
                  (e = this.element),
                  (i = this.options).rotatable || i.scalable || (i.checkOrientation = !1),
                  i.checkOrientation && window.ArrayBuffer
                    ? dt.test(t)
                      ? lt.test(t)
                        ? this.read(
                            ((h = (h = t).replace(Yt, '')),
                            (a = atob(h)),
                            (h = new ArrayBuffer(a.length)),
                            z((n = new Uint8Array(h)), function (t, e) {
                              n[e] = a.charCodeAt(e);
                            }),
                            h),
                          )
                        : this.clone()
                      : ((o = new XMLHttpRequest()),
                        (h = this.clone.bind(this)),
                        (this.reloading = !0),
                        ((this.xhr = o).onabort = h),
                        (o.onerror = h),
                        (o.ontimeout = h),
                        (o.onprogress = function () {
                          o.getResponseHeader('content-type') !== st && o.abort();
                        }),
                        (o.onload = function () {
                          r.read(o.response);
                        }),
                        (o.onloadend = function () {
                          (r.reloading = !1), (r.xhr = null);
                        }),
                        i.checkCrossOrigin && Nt(t) && e.crossOrigin && (t = Lt(t)),
                        o.open('GET', t, !0),
                        (o.responseType = 'arraybuffer'),
                        (o.withCredentials = 'use-credentials' === e.crossOrigin),
                        o.send())
                    : this.clone());
              },
            },
            {
              key: 'read',
              value: function (t) {
                var e = this.options,
                  i = this.imageData,
                  a = Xt(t),
                  n = 0,
                  o = 1,
                  h = 1;
                1 < a &&
                  ((this.url = (function (t, e) {
                    for (var i = [], a = new Uint8Array(t); 0 < a.length; )
                      i.push(zt.apply(null, bt(a.subarray(0, 8192)))), (a = a.subarray(8192));
                    return 'data:'.concat(e, ';base64,').concat(btoa(i.join('')));
                  })(t, st)),
                  (n = (t = (function (t) {
                    var e = 0,
                      i = 1,
                      a = 1;
                    switch (t) {
                      case 2:
                        i = -1;
                        break;
                      case 3:
                        e = -180;
                        break;
                      case 4:
                        a = -1;
                        break;
                      case 5:
                        (e = 90), (a = -1);
                        break;
                      case 6:
                        e = 90;
                        break;
                      case 7:
                        (e = 90), (i = -1);
                        break;
                      case 8:
                        e = -90;
                    }
                    return { rotate: e, scaleX: i, scaleY: a };
                  })(a)).rotate),
                  (o = t.scaleX),
                  (h = t.scaleY)),
                  e.rotatable && (i.rotate = n),
                  e.scalable && ((i.scaleX = o), (i.scaleY = h)),
                  this.clone();
              },
            },
            {
              key: 'clone',
              value: function () {
                var t = this.element,
                  e = this.url,
                  i = t.crossOrigin,
                  a = e,
                  n =
                    (this.options.checkCrossOrigin && Nt(e) && ((i = i || 'anonymous'), (a = Lt(e))),
                    (this.crossOrigin = i),
                    (this.crossOriginUrl = a),
                    document.createElement('img'));
                i && (n.crossOrigin = i),
                  (n.src = a || e),
                  (n.alt = t.alt || 'The image to crop'),
                  ((this.image = n).onload = this.start.bind(this)),
                  (n.onerror = this.stop.bind(this)),
                  v(n, K),
                  t.parentNode.insertBefore(n, t.nextSibling);
              },
            },
            {
              key: 'start',
              value: function () {
                function t(t, e) {
                  g(a.imageData, { naturalWidth: t, naturalHeight: e, aspectRatio: t / e }),
                    (a.initialImageData = g({}, a.imageData)),
                    (a.sizing = !1),
                    (a.sized = !0),
                    a.build();
                }
                var e,
                  i,
                  a = this,
                  n = this.image,
                  o =
                    ((n.onload = null),
                    (n.onerror = null),
                    (this.sizing = !0),
                    h.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(h.navigator.userAgent));
                n.naturalWidth && !o
                  ? t(n.naturalWidth, n.naturalHeight)
                  : ((e = document.createElement('img')),
                    (i = document.body || document.documentElement),
                    ((this.sizingImage = e).onload = function () {
                      t(e.width, e.height), o || i.removeChild(e);
                    }),
                    (e.src = n.src),
                    o ||
                      ((e.style.cssText =
                        'left:0;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:0;position:absolute;top:0;z-index:-1;'),
                      i.appendChild(e)));
              },
            },
            {
              key: 'stop',
              value: function () {
                var t = this.image;
                (t.onload = null),
                  (t.onerror = null),
                  t.parentNode.removeChild(t),
                  (this.image = null);
              },
            },
            {
              key: 'build',
              value: function () {
                var t, e, i, a, n, o, h, r, s;
                this.sized &&
                  !this.ready &&
                  ((t = this.element),
                  (e = this.options),
                  (i = this.image),
                  (a = t.parentNode),
                  ((n = document.createElement('div')).innerHTML =
                    '<div class="cropper-container" touch-action="none"><div class="cropper-wrap-box"><div class="cropper-canvas"></div></div><div class="cropper-drag-box"></div><div class="cropper-crop-box"><span class="cropper-view-box"></span><span class="cropper-dashed dashed-h"></span><span class="cropper-dashed dashed-v"></span><span class="cropper-center"></span><span class="cropper-face"></span><span class="cropper-line line-e" data-cropper-action="e"></span><span class="cropper-line line-n" data-cropper-action="n"></span><span class="cropper-line line-w" data-cropper-action="w"></span><span class="cropper-line line-s" data-cropper-action="s"></span><span class="cropper-point point-e" data-cropper-action="e"></span><span class="cropper-point point-n" data-cropper-action="n"></span><span class="cropper-point point-w" data-cropper-action="w"></span><span class="cropper-point point-s" data-cropper-action="s"></span><span class="cropper-point point-ne" data-cropper-action="ne"></span><span class="cropper-point point-nw" data-cropper-action="nw"></span><span class="cropper-point point-sw" data-cropper-action="sw"></span><span class="cropper-point point-se" data-cropper-action="se"></span></div></div>'),
                  (o = (n = n.querySelector('.'.concat(c, '-container'))).querySelector(
                    '.'.concat(c, '-canvas'),
                  )),
                  (h = n.querySelector('.'.concat(c, '-drag-box'))),
                  (s = (r = n.querySelector('.'.concat(c, '-crop-box'))).querySelector(
                    '.'.concat(c, '-face'),
                  )),
                  (this.container = a),
                  (this.cropper = n),
                  (this.canvas = o),
                  (this.dragBox = h),
                  (this.cropBox = r),
                  (this.viewBox = n.querySelector('.'.concat(c, '-view-box'))),
                  (this.face = s),
                  o.appendChild(i),
                  v(t, L),
                  a.insertBefore(n, t.nextSibling),
                  X(i, K),
                  this.initPreview(),
                  this.bind(),
                  (e.initialAspectRatio = Math.max(0, e.initialAspectRatio) || NaN),
                  (e.aspectRatio = Math.max(0, e.aspectRatio) || NaN),
                  (e.viewMode = Math.max(0, Math.min(3, Math.round(e.viewMode))) || 0),
                  v(r, L),
                  e.guides || v(r.getElementsByClassName(''.concat(c, '-dashed')), L),
                  e.center || v(r.getElementsByClassName(''.concat(c, '-center')), L),
                  e.background && v(n, ''.concat(c, '-bg')),
                  e.highlight || v(s, Z),
                  e.cropBoxMovable && (v(s, G), w(s, d, P)),
                  e.cropBoxResizable ||
                    (v(r.getElementsByClassName(''.concat(c, '-line')), L),
                    v(r.getElementsByClassName(''.concat(c, '-point')), L)),
                  this.render(),
                  (this.ready = !0),
                  this.setDragMode(e.dragMode),
                  e.autoCrop && this.crop(),
                  this.setData(e.data),
                  l(e.ready) && b(t, 'ready', e.ready, { once: !0 }),
                  y(t, 'ready'));
              },
            },
            {
              key: 'unbuild',
              value: function () {
                var t;
                this.ready &&
                  ((this.ready = !1),
                  this.unbind(),
                  this.resetPreview(),
                  (t = this.cropper.parentNode) && t.removeChild(this.cropper),
                  X(this.element, L));
              },
            },
            {
              key: 'uncreate',
              value: function () {
                this.ready
                  ? (this.unbuild(), (this.ready = !1), (this.cropped = !1))
                  : this.sizing
                  ? ((this.sizingImage.onload = null), (this.sizing = !1), (this.sized = !1))
                  : this.reloading
                  ? ((this.xhr.onabort = null), this.xhr.abort())
                  : this.image && this.stop();
              },
            },
          ]) && A(t.prototype, e),
          i && A(t, i),
          Object.defineProperty(t, 'prototype', { writable: !1 }),
          n
        );
      })();
    return g(Pt.prototype, t, i, e, Rt, St, At), Pt;
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  <script src="/user/assets/js/custom/cropper.js"></script>
  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js"></script> -->
  
  <script>
      const fileIn = document.getElementById("file");
      const profilePhoto = document.getElementById("profilePhoto");
      const imagePreviewModal = document.getElementById("imagePreviewModal");
      const imagePreviewContainer = document.getElementById("imagePreviewContainer");
      const cropImageButton = document.getElementById("cropImageButton");
      let croppedImage=null;
      // Add event listener to file input
      fileIn.addEventListener("change", function (event) {
          const file = event.target.files[0];
          const reader = new FileReader();
  
          reader.onload = function (e) {
              const img = document.createElement("img");
              img.src = e.target.result;
              img.classList.add("img-fluid");
              img.style.display = "block";
              img.style.maxWidth = "80%";
  
              // Display the image in the modal
              imagePreviewContainer.innerHTML = "";
              imagePreviewContainer.appendChild(img);
  
              // Show the modal
              $(imagePreviewModal).modal("show");
  
              const cropper = new Cropper(img, {
                  aspectRatio: 1,
                  viewMode: 1,
                  cropBoxResizable: false,
                  minCropBoxWidth: 200,
                  minCropBoxHeight: 200,
                  dragMode: "move"
              });
  
              cropImageButton.addEventListener("click", async function () {
                  const croppedCanvas = cropper.getCroppedCanvas({
                      width: 800,
                      height: 800
                  });
  
                  const croppedImageData = cropper.getCroppedCanvas().toDataURL("image/jpeg");
  
                  profilePhoto.src = croppedImageData;
  
                  croppedImage = await dataURItoBlob(croppedImageData);
  
                  $(imagePreviewModal).modal("hide");
          console.log(croppedImage);
              });
          };
  
          if (reader) {
              reader.readAsDataURL(file);
          }
          
      });
  
      const form1 = document.getElementById('updateUser');
      form1.addEventListener('submit', (event) => {
          event.preventDefault();
          const passwordError=document.querySelector('#passwordError')
          passwordError.innerHTML=''
          let hasError=false;
          const formData = new FormData(form1);
          if (formData.get('password').trim() === '') {
              hasError = true;
              passwordError.innerHTML += '<p style="color:red">Please enter your currentPassword.</p>';
              setTimeout(() => {
                  passwordError.innerHTML = ''
              }, 5000);
              return;
          }
          if (croppedImage !== null) {
           formData.delete('profileimage');
           formData.append('profileimage', croppedImage, 'cropped_image.jpg');
      }
          const formObject = {};
       if(!hasError){
              formData.forEach(function (key, value) {
                  formObject[key] = value;
              });
              // console.log(formObject)
          document.getElementById('buttonSub').disabled = true;
       }
          fetch('/update-userdata', {
              method: 'POST',
              body:formData
          })
              .then(response => response.json())
              .then(data => {
                  if (data.status) {
                      console.log('update successfully');
                      location.reload()
                  } else {
                      document.getElementById('buttonSub').disabled = false;
                      console.error(data.message);
                      const errorMessage = data.message || 'Unknown error';
                      const toastContainer = document.querySelector('.toast-container');
                      const toastElement = `
                  <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true" style="z-index: 10000;">
                   <div class="d-flex">
          <div class="toast-body">
            ${errorMessage}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
           </div>
           `;
                      toastContainer.innerHTML = toastElement;
                      const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
                      toast.show();
                  }
              })
              .catch(error => {
                  console.error(error);
              });
       });
  
      function sendCroppedImage(imageData) {
          // Create a new FormData object
          const formData = new FormData();
  
          // Append the cropped image data as a blob to the FormData
          formData.append("profileimage", dataURItoBlob(imageData), "cropped_image.jpg");
  
          // Send the cropped image data to the server using fetch or AJAX
          fetch("/upload-profileimage", {
              method: "POST",
              body: formData
          })
              .then((response) => response.json())
              .then((data) => {
                  console.log("image uploaded successfully");
              })
              .catch((error) => {
                  console.error(error);
              });
      }
  
      // Function to convert a data URI to a Blob object
      function dataURItoBlob(dataURI) {
          const byteString = atob(dataURI.split(",")[1]);
          const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          return new Blob([ab], { type: mimeString });
      }
  
  
          // let cropper;
      // function loadImage() {
      // 	const input = document.getElementById('file');
      //     $('#imagePreviewModal').show()
      // 	const canvas = document.getElementById('cropImageShow');
      // 	const file = input.files[0];
      // 	console.log(file);
  
      // 	if (file) {
      // 		const reader = new FileReader();
  
      // 		reader.onload = function (e) {
      // 			canvas.src = e.target.result;
      // 			if (cropper) {
      // 				cropper.destroy();
      // 			}
  
      // 			cropper= new cropper(canvas, {
      // 				viewMode: 2
      // 			});
      // 		};
  
      // 		reader.readAsDataURL(file);
      // 	} else {
      // 		canvas.src = "";
      // 		if (cropper) {
      // 			cropper.destroy();
      // 		}
      // 	}
      // }
      // function uploadCroppedImage() {
      // 	const canvas = cropped.getCroppedCanvas();
      // 	if (canvas) {
      // 		canvas.toBlob((blob) => {
      // 			const fileName = "cropped_image.jpg";
      // 			const file = new File([blob], fileName, { type: "image/jpeg" });
      // 			const input = document.getElementById("file");
  
      // 			if (DataTransfer && FileList) {
      // 				const dataTransfer = new DataTransfer();
      // 				dataTransfer.items.add(file);
      // 				input.files = dataTransfer.files;
      // 			} else {
      // 				console.error("FileList and DataTransfer are not supported in this browser.");
      // 			}
  
      // 			const showImg = document.getElementById("profilePhoto");
      // 			showImg.src = URL.createObjectURL(blob);
  
      // 			cropper.destroy();
      // 		});
      // 	}
      // }
  
  </script>
  


  exports.salesReport = async (req,res)=>{
    try{
        const date = req.query.date
        let orders
        const currentDate = new Date()

        function getFirstDayOfMonth(date){
            return new Date(date.getFullYear(), date.getMonth(), 1);
        }
        function getFirstDayOfYear(date) {
            return new Date(date.getFullYear(), 0, 1);
        }
        switch(date){
            case 'today' :
                orders = await Order.find({
                    status:'delivered',
                    createdOn:  {
                        $gte: new Date().setHours(0, 0, 0, 0), // Start of today
                        $lt: new Date().setHours(23, 59, 59, 999), // End of today
                    }
                    
                }).populate('userId')
                // console.log(orders,"++++++++++++++++++++++++");
                break;

            case 'week':
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the first day of the week (Sunday)
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the week (Saturday)
                endOfWeek.setHours(23, 59, 59, 999);

                orders = await Order.find({
                    status: 'delivered',
                    createdOn: {
                        $gte: startOfWeek,
                        $lt: endOfWeek,
                    },
                }).populate('userId');
                break;
                case 'month':
                const startOfMonth = getFirstDayOfMonth(currentDate);
                const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

                orders = await Order.find({
                    status: 'delivered',
                    createdOn: {
                        $gte: startOfMonth,
                        $lt: endOfMonth,
                    },
                }).populate('userId');
                break;
            case 'year':
                const startOfYear = getFirstDayOfYear(currentDate);
                const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);

                orders = await Order.find({
                    status: 'delivered',
                    createdOn: {
                        $gte: startOfYear,
                        $lt: endOfYear,
                    },
                }).populate('userId');
               
                break;
            default:
                // Fetch all orders
                orders = await Order.find({ status: 'delivered' }).populate('userId');    

        }
        const itemsPerPage=3
        const currentpage=parseInt(req.query.page)||1;
        const startIndex=(currentpage-1)*itemsPerPage
        const endIndex=startIndex+itemsPerPage
        const totalpages=Math.ceil(orders.length/3)
        const currentProduct=orders.slice(startIndex,endIndex)
        if (req.query.downloadPdf) {
            console.log('////////////////////');
            const doc = new PDFDocument();
            // Customize your PDF content here based on the sales report data
            doc.text('Sales Report', { align: 'center' });
            doc.text(Date: ${new Date().toLocaleDateString()}, { align: 'center' });
            doc.moveDown();
            let orderCounter = 0;
            // Add your sales data to the PDF
            orders.forEach((order) => {
              doc.text(Order ID: ORD${String(order._id.toString().slice(-4)).padStart(5, '0')}, { fontSize: 12 });
              doc.text(Customer Name: ${order.userId.name ? order.userId.name : 'N/A'}, { fontSize: 12 });
              doc.text(Price: ${order.totalPrice}, { fontSize: 12 });
              doc.text(Status: ${order.status}, { fontSize: 12 });
              doc.text(Date: ${order.createdOn ? order.createdOn.toLocaleDateString() : 'N/A'}, { fontSize: 12 });
              doc.moveDown(); // Add spacing between entries
            });

            
            // Set the response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="sales_report.pdf"');
            // Pipe the PDF content to the response stream
            doc.pipe(res);
            doc.end();
          } else{
            
            res.render('admin/salesReport',{orders:currentProduct,formatDate,totalpages,currentpage})

          }
       
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "An error occurred" });
    }
}

exports.downloadPdf = async (req, res) => {
    try {
       
        // ... Your existing sales report generation logic ...
  
        // Generate PDF using pdfkit
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');
        doc.pipe(res);
  
        // Add PDF content here
        doc.text('Sales Report', { align: 'center', underline: true });
        // ... Add more content based on your requirements ...
  
        doc.end();
  
    } catch (error) {
        console.log('Error occurred in downloadPdf route:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
  };



  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  const adminDashboard=async(req,res)=>{
    try{
       const [totalRevenue,totalUsers,totalOrders,totalProducts,totalCategories,orders,monthlyEarnings,newUsers]=await Promise.all
       ([Order.aggregate([
        {$match:{status:"payment successfull"}},
        {$group:{_id:null,totalAmount:{$sum:"$totalAmount"}}},

       ]),
       
       User.countDocuments({isBlocked:false,is_verified:true}),
       Order.countDocuments(),
       Product.countDocuments(),
       categ.countDocuments(),
       Order.find().limit(10).sort({orderDate:-1}).populate('user'),
       Order.aggregate([
        {
        $match: {
            status:"payment successfull",
            orderDate:{$gte:new Date(new Date().getFullYear(),new Date().getMonth(),1)},

        },
    },
    {$group: {_id: null, monthlyAmount: { $sum: "$totalAmount" }}},
        
       ]),
       User.find({isBlocked:false,is_verified:true}).sort({date:-1}).limit(5)
    ]);


    /////daily/////////////
    
    const getDailyDataArray = async () => {
        //weekly data
        const currentDate = new Date(); 
        const sevenDaysAgo = new Date(currentDate); 
        sevenDaysAgo.setDate(currentDate.getDate() - 7); 
        
        const dailyOrders = await Order.aggregate([
          {
            $match: {
                status:"payment successfull",
              orderDate: { $gte: sevenDaysAgo, $lte: currentDate } 
            }
          },
          {
            $group: {
              _id: { $dayOfWeek: '$orderDate' },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { '_id': 1 } 
          }
        ]);
        
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        const dailyDataArray = [];
        for (let i = 6; i >= 0; i--) {
          const dayIndex = new Date(currentDate);
          dayIndex.setDate(currentDate.getDate() - i); 
          const foundDay = dailyOrders.find(order => order._id === (dayIndex.getDay() === 0 ? 7 : dayIndex.getDay())); 
          const count = foundDay ? foundDay.count : 0; 
          const dayNameIndex = dayIndex.getDay() === 0 ? 6 : dayIndex.getDay() - 1; 
          const dayName = dayNames[dayNameIndex]; 
          dailyDataArray.push({ day: dayName, count }); 
        }
        
        
        return dailyDataArray;
        
        }

        ////monthly////
        const getMonthlyDataArray = async () => {

            //Monthly Data
            const currentDate = new Date(); 
            const sevenMonthsAgo = new Date(); 
            sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
            
            const monthlyOrders = await Order.aggregate([
              {
                $match: {
                    status:"payment successfull",
                  orderDate: { $gte: sevenMonthsAgo, $lte: currentDate }
                }
              },
              {
                $group: {
                  _id: { $month: '$orderDate' },
                  count: { $sum: 1 }
                }
              },
              {
                $sort: { '_id': 1 } 
              }
            ]);
            console.log(monthlyOrders+'monthly');
            
            const monthNames = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];
            
            const monthlyDataArray = [];
            for (let i = 6; i >= 0; i--) {
              const monthIndex = (currentDate.getMonth() - i + 12) % 12; 
              const foundMonth = monthlyOrders.find(order => order._id === (monthIndex + 1)); 
              const count = foundMonth ? foundMonth.count : 0; 
              const monthName = monthNames[monthIndex];
              monthlyDataArray.push({ month: monthName, count }); 
            }
            
            return monthlyDataArray;
            };

            /////yearly////

            const getYearlyDataArray = async () => {
                const currentDate = new Date(); 
                const sevenYearsAgo = new Date(currentDate); 
                sevenYearsAgo.setFullYear(currentDate.getFullYear() - 7); 
                
                const yearlyOrders = await Order.aggregate([
                  {
                    $match: {
                        status:"payment successfull",
                      orderDate: { $gte: sevenYearsAgo, $lte: currentDate } 
                    }
                  },
                  {
                    $group: {
                      _id: { $year: '$orderDate' },
                      count: { $sum: 1 }
                    }
                  },
                  {
                    $sort: { '_id': 1 } 
                  }
                ]);
                
                
                const yearlyDataArray = [];
                for (let i = 6; i >= 0; i--) {
                  const year = currentDate.getFullYear() - i; 
                
                  const foundYear = yearlyOrders.find(order => order._id === year); 
                  const count = foundYear ? foundYear.count : 0; 
                  yearlyDataArray.push({ year, count }); 
                }
                
                
                return yearlyDataArray;
                };



    console.log('monthlyEarnings'+monthlyEarnings);
    const adminData=req.session.adminData
    const totalRevenueValue=totalRevenue.length > 0 ?totalRevenue[0].totalAmount : 0;
    const monthlyEarningsValue=monthlyEarnings.length > 0 ?monthlyEarnings[0].monthlyAmount : 0;
    console.log(monthlyEarningsValue);
    const monthlyDataArray=await getMonthlyDataArray();
    const dailyDataArray=await getDailyDataArray();
    const yearlyDataArray=await getYearlyDataArray();

    console.log(monthlyDataArray);
    console.log(dailyDataArray);
    console.log(yearlyDataArray);


    

        var search='';
        if(req.query.search){
            search=req.query.search;
        }

       const data =await User.find({is_admin:0,
        $or:[
            { name:{$regex:'.*'+search+'.*',$options:'i'}},
            { email:{$regex:'.*'+search+'.*',$options:'i'}},
            { mobile:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
               
    });
    console.log(totalRevenueValue+'total');
        res.render('dashboard',{admin: adminData,
        data,
        orders,
        newUsers,
        totalRevenue: totalRevenueValue,
        totalOrders,
        totalProducts,
        totalCategories,
        totalUsers,
        monthlyEarnings: monthlyEarningsValue,
        monthlyMonths: monthlyDataArray.map(item => item.month),
        monthlyOrderCounts: monthlyDataArray.map(item => item.count),
        dailyDays: dailyDataArray.map(item => item.day),
        dailyOrderCounts: dailyDataArray.map(item => item.count),
        yearlyYears: yearlyDataArray.map(item => item.year),
        yearlyOrderCounts: yearlyDataArray.map(item => item.count),
        })





          


               
            
            
            


    }catch(error){
        console.log(error)
}
}