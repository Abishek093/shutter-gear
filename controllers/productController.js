const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;


async function loadProduct (req,res){
    try {

        const productdata = await Product.find()
        res.render('products',{productdata})
    } catch (error) {
        console.log(error.message);
    }
}

const loadNewProduct = async(req, res)=>{
    try {
        const allCategories = await Category.find({})
        res.render('addnewProduct',{allCategories})
    } catch (error) {
        console.log(error.message);
    }
}

// const addProduct = async(req, res)=>{
//     try {
//         const { title, category, brand, model, regular_price, sales_price, quantity, stock_status, description } = req.body
//         const category_id = await Category.findOne({name:category},{})
//         const fileNames = req.files.map(file => file.filename);

//         console.log(fileNames);

//         const product = await Product.create({
//             title, 
//             category, 
//             brand, 
//             model, 
//             regular_price, 
//             sales_price, 
//             quantity, 
//             stock_status, 
//             description,
//             images: fileNames
//         })
//         console.log("Success");
//         res.redirect('/admin/products')
//     } catch (error) {
//         console.log(error.message);
//     }
// }



const addProduct = async (req, res) => {
    try {
        const { title, category, brand, model, regular_price, sales_price, quantity, description } = req.body;
        const category_id = await Category.findOne({ name: category }, {});
        const fileNames = req.files.map(file => file.filename);

        const product = await Product.create({
            title,
            category,
            brand,
            model,
            regular_price,
            sales_price,
            quantity,
            description,
            images: fileNames
        });

        // Create a temporary directory for resized images
        const tempDir = path.join(__dirname, "temp");
        await fs.mkdir(tempDir, { recursive: true });

        // Resize and crop the uploaded images to 277x277
        await Promise.all(fileNames.map(async (filename) => {
            const inputImagePath = `./public/productImages/${filename}`;
            const outputImagePath = path.join(tempDir, filename);

            await sharp(inputImagePath)
                .resize({ width: 277, height: 277, fit: 'cover' })
                .toFile(outputImagePath);
        }));

        // Move the resized images back to the original directory
        await Promise.all(fileNames.map(async (filename) => {
            const tempImagePath = path.join(tempDir, filename);
            const finalImagePath = `./public/productImages/${filename}`;

            await fs.rename(tempImagePath, finalImagePath);
        }));

        // Remove the temporary directory
        await fs.rmdir(tempDir, { recursive: true });

        console.log("Success");
        res.redirect('/admin/products');
    } catch (error) {
        console.log(error.message);
    }
};



const loadEditProduct = async(req, res)=>{
    try {
        let product_id = req.params.id
        let product = await Product.findOne({_id: product_id})
        const allCategories = await Category.find({})
        res.render('editProduct',{product_id, product, allCategories})
    } catch (error) {
        console.log(error.message);
    }
}

// const editProduct = async (req, res) => {
//     try {
//         let product_id = req.params.id;
//         const { title, category, brand, model, regular_price, sales_price, quantity, stock_status, description,  } = req.body;
//         const category_id = await Category.findOne({ name: category }, {});
//         const fileNames = req.files.map(file => file.filename);

//         if (req.files.length) {
//             const product = await Product.findByIdAndUpdate(
//                 { _id: product_id },
//                 {
//                     title,
//                     category,
//                     brand,
//                     model,
//                     regular_price,
//                     sales_price,
//                     quantity,
//                     stock_status,
//                     description,
//                     images: fileNames
//                 });
//         } else {
//             const product = await Product.findByIdAndUpdate(
//                 { _id: product_id },
//                 {
//                     title,
//                     category,
//                     brand,
//                     model,
//                     regular_price,
//                     sales_price,
//                     quantity,
//                     stock_status,
//                     description,
//                 });
//         }
//         console.log("Success");
//         res.redirect('/admin/products');
//     } catch (error) {
//         console.log(error.message);
//     }
// };

const editProduct = async (req, res) => {
    try {
        let product_id = req.params.id;
        const { title, category, brand, model, regular_price, sales_price, quantity, description } = req.body;
        const category_id = await Category.findOne({ name: category }, {});
        const existingProduct = await Product.findById(product_id);

        // Get existing images from the database
        const existingImages = existingProduct.images || [];
        const fileNames = req.files.map(file => file.filename);

        if (req.files.length) {
            // Check if the total number of images (existing + new) exceeds the limit of 4
            if (existingImages.length + fileNames.length > 4) {
                console.log("Error: Exceeded the maximum allowed images limit (4).");
                return res.redirect('/admin/products');
            }

            // Update product information with both existing and new images
            await Product.findByIdAndUpdate(
                { _id: product_id },
                {
                    title,
                    category,
                    brand,
                    model,
                    regular_price,
                    sales_price,
                    quantity,
                    description,
                    images: [...existingImages, ...fileNames],
                }
            );

        // Create a temporary directory for resized images
        const tempDir = path.join(__dirname, "temp");
        await fs.mkdir(tempDir, { recursive: true });

        // Resize and crop the uploaded images to 277x277
        await Promise.all(fileNames.map(async (filename) => {
            const inputImagePath = `./public/productImages/${filename}`;
            const outputImagePath = path.join(tempDir, filename);

            await sharp(inputImagePath)
                .resize({ width: 277, height: 277, fit: 'cover' })
                .toFile(outputImagePath);
        }));

        // Move the resized images back to the original directory
        await Promise.all(fileNames.map(async (filename) => {
            const tempImagePath = path.join(tempDir, filename);
            const finalImagePath = `./public/productImages/${filename}`;

            await fs.rename(tempImagePath, finalImagePath);
        }));

        // Remove the temporary directory
        await fs.rmdir(tempDir, { recursive: true });

        console.log("Success");
        res.redirect('/admin/products');
    } else {
        // Update product information without changing images
        await Product.findByIdAndUpdate(
            { _id: product_id },
            {
                title,
                category,
                brand,
                model,
                regular_price,
                sales_price,
                quantity,
                description,
            }
        );
        console.log('Success');
        res.redirect('/admin/products');
    }
} catch (error) {
    console.log(error.message);
    res.redirect('/admin/products'); // Redirect in case of an error
}
};



const deleteProduct = async(req, res)=>{
    try {
        const product_id = req.params.id
        const product = await Product.findById(product_id)
        if(!product){
            console.log("Product not found");
            res.status(404).send('Product not found');
            return;
        }
        product.is_Listed = !product.is_Listed
        await product.save()
        res.redirect('/admin/products');

    } catch (error) {
        console.log(error.message);
    }
}

const deleteImage = async(req, res)=>{
    try {
        const id = req.params.id;
        const image = req.params.img;

        const updatedDocument = await Product.findOneAndUpdate({_id: id}, {$pull:{images: image}});

        if (!updatedDocument) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.redirect('/admin/editProduct/' + id);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    loadProduct,
    loadNewProduct,
    addProduct,
    loadEditProduct,
    editProduct,
    deleteProduct,
    deleteImage
};