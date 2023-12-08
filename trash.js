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




